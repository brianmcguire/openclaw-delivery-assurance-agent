# Verification report

Verified September 22, 2026 Eastern time (September 23 UTC). This report separates automated tests, actual runtime execution, and the still-pending two-person pilot.

## September 25 readiness update

### September 26 onboarding addition

Published guided onboarding adds `DELIVERY START` and `START-HERE.md`. All 14 Node and 3 Python checks pass, including read-only admission without identity, date generation, sample-envelope creation, and rejection of same-founder owner enrollment. CI passed at `6b11a5a`. The isolated Mac mini gateway was reloaded and a genuine CLI START turn returned the role introduction, both setup paths, an accurate unverified-identity warning, and no claim that a project was saved. This verifies the live introduction only: the complete guided founder/owner conversation and two-human onboarding are still pending. Browser identity was subsequently reported working by the founder; that report is not a second-person test.

An isolated second installation on a Mac mini uses OpenClaw 2026.9.5 and a separate loopback gateway. Its tailnet-only HTTPS route and gateway health responded successfully. That route was changed from shared-token access to Tailscale identity via OpenClaw trusted-proxy mode, with the existing owner's login allowlisted; config validation passed and the prior isolated config was backed up. Browser founder profile admission was directly verified September 26; a second real person's contribution remains unverified. The host's other gateway and Serve routes were not changed.

The official Agent Index client was refreshed to upstream commit `edf196031803e204cdbcd81ce574e1f54fd75f65`. Its new machine-wide OpenClaw collector is disabled by this project's wrapper so only this installation's genuine delivery-agent usage ledger is reported. Offline checks pass; registration and a live report remain pending a supported Plow credential. No demo video has been recorded.

## Actual environment and isolation

Development used macOS, checkout-local Node 24.16.0 and OpenClaw 2026.9.5, the official Codex plugin, and an existing configured ChatGPT/Codex provider route. The original global OpenClaw 2026.4.14 installation and production remote gateway configuration were preserved. The delivery gateway uses a separate state directory, workspace, database, and loopback port 19789. The existing private delivery prototype repository was left untouched; its source was not copied into this public project.

The live access path is OpenClaw Control UI through Tailscale Serve. No Slack, Telegram, email, or customer channel was configured. Gateway health returned `ok: true`, no plugin errors, and the intended delivery agent. Current config validation passed. A fresh provider-neutral configuration also passed validation, and a repeat setup refused to overwrite it. Other model providers were not exercised end to end.

## Live OpenClaw workflow: passed with one identity

The coding agent drove the real browser UI using one existing authenticated profile. This was an automated UI smoke test, **not a two-human multiplayer demonstration**. The fictional `local-smoke` project assigned all three milestones to that one contributor to make this limitation explicit.

1. `DELIVERY WHOAMI` returned a verified gateway profile.
2. Project creation persisted the project and generated three named milestone update questions.
3. The free-form missing-access update was captured and attributed to that profile. The agent flagged the blocker and target after baseline, reported amber, and asked for a recovery action and ISO date.
4. The recovery reply recorded the action and date and answered the open recovery question. The blocker remained open and the agent did not repeat the question.
5. The founder brief showed the approval decision, supporting source IDs, recovery plan, unknown milestone data, and unavailable budget/effort variance.
6. A target-date correction changed revision 3 to 4. The subsequent brief resolved the threatened-date concern while retaining the blocker and unapproved decision.
7. Direct read-only ledger checks confirmed the original September 25 statement remained stored, the target now reads September 24, recovery remains recorded, and every source used that same verified runtime profile.

One extraction attempt was rejected by source validation during the recovery turn; the model corrected the extraction and completed the turn. Early development sessions also exposed a native Codex policy-handoff issue after tool configuration reloads. Fresh sessions with stable configuration completed the workflow. Neither error is hidden as a successful first attempt.

## Scheduled check-in: passed

The weekly helper registered an OpenClaw cron job for the exact shared session. A manually triggered execution of that job finished successfully, used the live model and delivery tools, and appeared in the shared Control UI conversation. It reported the corrected target, unresolved blocker, recovery commitment, pending founder decision, and missing updates without generating a duplicate recovery question. External delivery was `not-requested`.

The smoke-test job was disabled afterward. The seven-day wall-clock trigger has not been observed; registration and execution through the actual scheduler were verified. No recurring test traffic remains enabled by this project.

## Automated checks: passed

```bash
PATH="$PWD/.local/node/node_modules/node/bin:$PATH" npm test
python3 vendor/agent-index-client/agent_index_client.py --self-check
bash -n scripts/install.sh scripts/openclaw scripts/weekly-checkin.sh scripts/report-usage.sh
scripts/openclaw config validate
python3 scripts/agent-index.py --preview
```

- 12 Node tests: source evidence, runtime attribution, durable reopen, recovery and duplicate suppression, corrections and stale revisions, conflicting reports, date/baseline risks, missing owner, escalation, per-requester brief changes, prompt-injection admission boundaries, actual usage counters, and exact session/run profile lookup.
- 2 Python tests: installation-scoped counter collection and failure handling.
- Official upstream client self-check passed.
- Shell syntax and isolated OpenClaw configuration passed.
- Offline usage preview read actual completed OpenClaw run counters. It made no registration or reporting request.

The two-identity store test uses fixtures. It verifies attribution logic, not the presence of two humans. Test stores are temporary and excluded from usage reporting.

## Still unverified / external acceptance gates

- A second real person authenticating and completing the seven-step workflow with the founder.
- Agent Index registration, successful live reporting, organizer verification, and leaderboard visibility. Required Plow credentials were not available.
- A recorded 60+ second video. The exact two-person recording sequence is prepared in `submission/demo-script.md`.
- Fresh-machine package installation and live execution on Linux or another model provider. Fresh configuration generation and validation were tested locally.

The Control UI profile adapter is pinned to the 2026.9.5 host transcript schema. Recheck attribution after runtime upgrades. This installation is one trusted team, not a multi-tenant security boundary. Questions appear in the shared conversation; private notifications and customer messages are not implemented.

## Public package review

Published under MIT at [openclaw-delivery-assurance-agent](https://github.com/brianmcguire/openclaw-delivery-assurance-agent). The 48-file staged package was checked for credentials, private host identifiers, local paths, private project material, and accidentally included state/database files; no matches were found. Authored local documentation links resolved. The vendored official client hash matched its recorded upstream SHA-256. Private state, transcripts, and usage credentials are excluded by `.gitignore`. The upstream license's original trailing blank line is preserved.

## September 26 project setup card verification

All 17 Node checks and 3 Python checks pass, including DOM validation, explicit single submission, unverified identity handling, native fallback, baseline choices, and safe text rendering. The isolated Mac mini browser form was exercised through all four steps with the verified founder profile. Selecting Create sent the reviewed fictional project command through the chat bridge; the actual agent confirmed creation and posted milestone check-in questions with a distinct-owner JOIN command. The fictional project was persisted in the isolated SQLite store. Browser automation used keyboard activation because its nested-frame pointer inspection rejected clicks; human mouse/touch behavior has not been separately verified.

The first live render exposed an unavailable sandbox origin. A separate tailnet-only HTTPS route to the isolated sandbox listener resolved it, with `mcp.apps.sandboxOrigin` configured according to official documentation. Existing production routes were preserved. This is a verified one-person project setup interaction, not a two-person pilot. Live iOS card submission and a second participant remain pending.

## September 26 participant card and package verification

All 20 Node checks and 3 Python checks pass on checkout-local Node 24.16.0. CI passed at `fafbb8f`, including building the plugin archive. The card checks cover real role/milestone references, no external send or enrollment side effect, already-bound roles, missing identity, credential-bearing address rejection, and safe rendering of untrusted labels.

The 19-file plugin archive includes both cards, all delivery code, the workspace instructions and skill, and MIT license. Private state and hackathon reporting assets are excluded. The archive installed into a fresh isolated OpenClaw profile with explicit capability consent; required configuration validated and the gateway started with the plugin on unused loopback port 19991, then stopped cleanly. The CLI info reported `provenance-invalid` for this local archive source; no trust registry was edited or bypassed. This is a local install/startup check, not registry trust, publication, or a fresh two-person model workflow.

The participant card was exercised in the actual Mac mini founder conversation after a gateway reload: the operator address field and Prepare action produced the expected packet for the unbound pilot-lead alias and its two milestones. The Agent choice displayed the unimplemented connection notice. No JOIN, access change, or external invitation was performed. Keyboard activation was used in the nested widget. The first attempt before reload used stale plugin code and rejected the new command; the subsequent run successfully rendered it.
