#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# Register explicitly first. No auto-registration or key replacement on errors.
python3 "$ROOT/scripts/agent-index.py" status
while true; do
  python3 "$ROOT/scripts/agent-index.py" --agent delivery-assurance-agent
  sleep 300
done
