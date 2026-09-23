#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
: "${DELIVERY_MODEL:?Set DELIVERY_MODEL to your OpenClaw provider/model}"
# Install supported Node and pinned OpenClaw only inside this checkout.
npm install --prefix .local/node node@24.16.0 --no-audit --no-fund
export PATH="$ROOT/.local/node/node_modules/node/bin:$PATH"
npm install --prefix .local/runtime openclaw@2026.9.5 --no-audit --no-fund
node scripts/setup.mjs "$@"
if [[ "$DELIVERY_MODEL" == openai/* ]]; then
  # OpenClaw may discover/install this configured provider during setup.
  # --force finishes the official install and trust record in either case.
  scripts/openclaw plugins install @openclaw/codex@2026.9.5 --force
fi
scripts/openclaw config validate
printf '%s\n' 'Installed. Configure model credentials in this isolated profile if needed, then run scripts/openclaw gateway run.'
