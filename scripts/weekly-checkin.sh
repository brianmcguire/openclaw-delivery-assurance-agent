#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
project="${1:?Usage: scripts/weekly-checkin.sh project-id session-key}"
session="${2:?Provide the exact shared session key}"
[[ "$project" =~ ^[a-z0-9][a-z0-9-]{0,63}$ ]] || exit 2
[[ "$session" == agent:delivery-assurance-agent:* ]] || exit 2
exec "$ROOT/scripts/openclaw" cron add \
  --agent delivery-assurance-agent \
  --name "Delivery check-in: $project" \
  --declaration-key "delivery-weekly-$project" \
  --every 7d --session "session:$session" --session-key "$session" \
  --message "DELIVERY CHECKIN $project" --no-deliver \
  --tools delivery_record,delivery_update,delivery_checkin,delivery_brief --json
