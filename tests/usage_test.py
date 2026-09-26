import datetime
import importlib.util
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('adapter', ROOT / 'scripts/agent-index.py')
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)
class UsageTests(unittest.TestCase):
    def test_scoped_day_model_collection_and_failure(self):
        with tempfile.TemporaryDirectory() as folder:
            db = Path(folder) / 'delivery.sqlite'
            with sqlite3.connect(db) as conn:
                conn.execute('CREATE TABLE usage (run TEXT PRIMARY KEY, day TEXT, model TEXT, body TEXT)')
                for run, day, counts in [('a','2026-09-22',[10,2,3,0]),('b','2026-09-22',[20,4,5,0]),('old','2020-01-01',[999,999,0,0])]:
                    conn.execute('INSERT INTO usage VALUES (?,?,?,?)', (run,day,'provider/model',json.dumps(dict(zip(adapter.KEYS,counts)))))
            result=adapter.collect(db,today=datetime.date(2026,9,23))
            self.assertEqual(result,{'2026-09-22':{'provider/model':{'input':30,'output':6,'cache_read':8,'cache_write':0}}})
            with sqlite3.connect(db) as conn:
                conn.execute('UPDATE usage SET body=? WHERE run=?',(json.dumps({'input':-1}),'a'))
            with self.assertRaises(ValueError): adapter.collect(db,today=datetime.date(2026,9,23))
        with self.assertRaises(RuntimeError): adapter.collect('/missing/delivery.sqlite')
    def test_upstream_is_pinned_and_unmodified(self):
        import hashlib
        lock=json.loads((ROOT/'vendor/agent-index-client/UPSTREAM.json').read_text())
        actual=hashlib.sha256((ROOT/'vendor/agent-index-client/agent_index_client.py').read_bytes()).hexdigest()
        self.assertEqual(actual,lock['sha256'])
    def test_wrapper_excludes_upstream_machine_wide_openclaw_collector(self):
        with tempfile.TemporaryDirectory() as folder:
            data = Path(folder) / 'data'
            data.mkdir()
            with sqlite3.connect(data / 'delivery.sqlite') as conn:
                conn.execute('CREATE TABLE usage (run TEXT PRIMARY KEY, day TEXT, model TEXT, body TEXT)')
                conn.execute('INSERT INTO usage VALUES (?,?,?,?)', ('real-run', datetime.date.today().isoformat(), 'provider/model', json.dumps({'input': 7, 'output': 2, 'cache_read': 0, 'cache_write': 0})))
            client = SimpleNamespace(FAILURES=[], state_dir=None, TOKEN_PATH=None, STATE_PATH=None)
            def inspect(_argv):
                self.assertEqual(client.from_openclaw(28), {})
                self.assertEqual(client.from_hermes(28), {})
                self.assertEqual(client.from_agentsview(28)[datetime.date.today().isoformat()]['provider/model']['input'], 7)
                return 0
            client.main = inspect
            with patch.object(adapter, 'load_client', return_value=client), patch.dict('os.environ', {'DELIVERY_DATA_DIR': str(data), 'DELIVERY_INDEX_STATE_DIR': str(Path(folder) / 'index')}):
                self.assertEqual(adapter.main(['status']), 0)
if __name__ == '__main__': unittest.main()
