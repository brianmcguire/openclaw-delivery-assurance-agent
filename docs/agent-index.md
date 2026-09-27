# Agent Index integration

Verified against the [event](https://luma.com/zhkhsnpa), [publishing guide](https://aiworthusing.com/agent-index/publish), and [official client](https://github.com/plow-pbc/agent-index-client) on September 25, 2026 Eastern time. The vendored client is pinned in `vendor/agent-index-client/UPSTREAM.json` with a commit and SHA-256. Its Apache-2.0 LICENSE and NOTICE are retained; the original project code is MIT.

The current publishing guide explicitly allows other runtimes to replace the usage collector. The current official client also includes an OpenClaw SQLite collector. `scripts/agent-index.py` loads the unmodified official client and replaces its agentsview/Hermes/OpenClaw collectors with one that reads only this installation's `usage` table. The plugin writes that table from OpenClaw's `llm_output` event, using provider-reported counters. Run IDs deduplicate completed-run events. There is no token estimate, synthetic usage, or machine-wide Codex history scan.

The wrapper also isolates the client's install identity and report key under `.local/agent-index`. Keep that directory across restarts and upgrades. Do not delete it to create new installs, and do not copy it into someone else's installation. Registration, assertion exchange, reporting, HTTP origin checks, and response handling remain upstream code.

## Exact steps

1. Read the current upstream instructions again before submission. Get the [plow-agents CLI](https://github.com/plow-pbc/plow-agents) using its official installation instructions. Sign in yourself with `plow-agents login`.
2. The publishing page currently documents `export PLOW_AGENT_TOKEN="$(cat ~/.config/plow/token)"` for a bring-your-own agent. The client README describes an agent-scoped token minted by Plow, including one from an existing container. These descriptions differ. Use the token provided by your supported Plow setup; if the host login token is rejected, ask the organizers for the correct agent-scoped credential. Do not substitute a GitHub bearer or invent a token.
3. First inspect this installation's genuine counters without any network operation:

   ```bash
   python3 scripts/agent-index.py --preview
   python3 scripts/agent-index.py status
   ```

   `status` returns 0 if registered, 3 if absent, 2 if state is unreadable. Stop on 2; do not register over unreadable state. `--preview` is our local-only inspection command, not proof of reporting. Upstream `--dry-run` requires a stored report key in the pinned version.
4. Register the listing using the official client through the wrapper. The public repository is ready. The real demo video can be added later by rerunning `--register` with the same slug and `--video`; do not delay registration while recording. First register without the video argument:

   ```bash
   python3 scripts/agent-index.py --register \
     --agent delivery-assurance-agent \
     --name 'Delivery Lens' \
     --blurb 'A startup delivery lead that asks owners for recovery plans and brings evidence-backed decisions to the founder.' \
     --runtime 'OpenClaw 2.0' \
     --repo 'https://github.com/brianmcguire/openclaw-delivery-assurance-agent' \
     --install-url 'https://github.com/brianmcguire/openclaw-delivery-assurance-agent#installation'
   ```

   When the real video is uploaded, rerun the same registration command with `--video 'YOUTUBE_VIDEO_ID'`; `--video` takes a YouTube ID, not a URL. Choose another slug if it belongs to someone else; joining someone else's listing is not publishing your project. Each genuine installer uses their own supported credential and persistent install state.
5. Inspect a registered dry run, then send one genuine report:

   ```bash
   python3 scripts/agent-index.py --agent delivery-assurance-agent --dry-run
   python3 scripts/agent-index.py --agent delivery-assurance-agent
   ```

   Verify a successful response and the matching public listing/usage. Do not claim reporting works based solely on the local preview.
6. Run the provided supervisor command every five minutes while this installation is in genuine use:

   ```bash
   scripts/report-usage.sh
   ```

   This stops on an error, rather than silently dropping a broken collector or replacing good totals with zero. Run it under your normal process supervisor for persistence. It does not create traffic or invoke the model.
7. Follow [Agent Index publishing](https://aiworthusing.com/agent-index/publish) and the linked [community Discord](https://aiworthusing.com/agent-index/publish) for verification. The publishing page currently says prize qualification requires a verified entry. One-click deploy requires a separately approved image and organizer enablement; this repository is a local install, not a claimed one-click deployment.

No registration or live report is attempted without the appropriate credential. No stories, customer data, prompts, project names, or source text are sent by the collector. The registration fields and video are public by design.


## September 27 pilot reporting readiness

The current publishing guide and official client README were rechecked on September 27. The guide still requires MIT licensing, usage reporting, and organizer verification for prizes. The Mac mini installation has genuine completed-run usage counters from the real two-person pilot, but registration status returned absent and neither the development Mac nor gateway host had a Plow login credential at this check. Local preview succeeded; no live report was sent. Preserve the Mac mini install identity when registering and reporting its usage. The host-login versus agent-scoped credential distinction above remains unresolved until a supported credential is accepted.

## September 27 current publishing status

Registration and genuine server-accepted reporting are now verified. The existing listing was updated with YouTube ID `yOk-3M2gTH0`. The Mac mini has a dedicated user LaunchAgent, `studio.activa.delivery-lens.agent-index`, running a single report every 300 seconds using the installation's saved report credential. Its first scheduled run returned HTTP 200 / ok=true and exit 0. The report identity was preserved, and no login or API token is embedded in the plist. See [persistent reporting](reporting-operations.md). Organizer verification still requires the official community.
