#!/usr/bin/env python3
"""Official Agent Index client with a scoped OpenClaw usage collector.

The upstream module is unmodified. The publishing guide explicitly permits replacing
its usage function for other runtimes. No machine-wide agentsview or Hermes usage
is read. --preview is an offline local check; it is not a successful Index report.
"""
import datetime
import importlib.util
import json
import os
from pathlib import Path
import sqlite3
import sys
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
KEYS = ('input', 'output', 'cache_read', 'cache_write')

def collect(db_path, days=28, today=None):
    if not isinstance(days, int) or not 1 <= days <= 365:
        raise ValueError('days must be between 1 and 365')
    today = today or datetime.datetime.now(datetime.timezone.utc).date()
    cutoff = (today - datetime.timedelta(days=days-1)).isoformat()
    path = Path(db_path).resolve()
    if not path.is_file():
        raise RuntimeError('Delivery usage database missing; refusing a partial or zero report')
    result = {}
    with sqlite3.connect('file:' + quote(str(path)) + '?mode=ro', uri=True) as db:
        for day, model, body in db.execute('SELECT day, model, body FROM usage WHERE day >= ? AND day <= ?', (cutoff, today.isoformat())):
            if datetime.date.fromisoformat(day).isoformat() != day or not model:
                raise ValueError('Invalid usage row')
            counters = json.loads(body)
            if set(counters) != set(KEYS) or any(type(counters[k]) is not int or counters[k] < 0 for k in KEYS):
                raise ValueError('Invalid usage counters; refusing report')
            target = result.setdefault(day, {}).setdefault(model, dict.fromkeys(KEYS, 0))
            for key in KEYS:
                target[key] += counters[key]
    return result

def load_client():
    spec = importlib.util.spec_from_file_location('official_agent_index_client', ROOT / 'vendor/agent-index-client/agent_index_client.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

def main(argv):
    client = load_client()
    data = Path(os.environ.get('DELIVERY_DATA_DIR', ROOT / '.local/delivery-data'))
    state = Path(os.environ.get('DELIVERY_INDEX_STATE_DIR', ROOT / '.local/agent-index')).resolve()
    # Isolate installation identity and credential cleanup from all other agents.
    client.state_dir = lambda: str(state)
    client.TOKEN_PATH = str(state / 'token')
    client.STATE_PATH = str(state / 'unused-hermes-state.json')
    def from_openclaw(days):
        try:
            return collect(data / 'delivery.sqlite', days)
        except Exception as exc:
            client.FAILURES.append('delivery OpenClaw collector: ' + str(exc))
            return {}
    client.from_agentsview = from_openclaw
    client.from_hermes = lambda days: {}
    # The current upstream client also scans every OpenClaw agent store by
    # default. This installation reports only this plugin's scoped ledger.
    client.from_openclaw = lambda days: {}
    if argv == ['--preview']:
        # No credential checks, cleanup, registration, network, or client-state writes.
        print(json.dumps({'days': client.merge(collect(data / 'delivery.sqlite'))}, indent=2))
        return 0
    state.mkdir(parents=True, exist_ok=True, mode=0o700)
    return client.main(argv)

if __name__ == '__main__':
    try:
        sys.exit(main(sys.argv[1:]))
    except (ValueError, RuntimeError, sqlite3.Error) as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(2)
