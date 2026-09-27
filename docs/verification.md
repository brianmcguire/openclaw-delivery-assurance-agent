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

## September 26 packaged model turn and registry inspection

A genuine `DELIVERY START` turn from the archive-installed agent returned its role, both onboarding paths, and a correct unverified-CLI-identity warning without creating a project. This used the configured native Codex provider in the isolated package-test profile. The provider logged one-shot cleanup and disposal warnings after returning; a clean model session lifecycle remains unverified. No second-person identity or external usage report was generated.

The official ClawHub CLI 0.23.3 static Plugin Inspector passed against the staged package and pinned OpenClaw 2026.9.5: zero breakages, warnings, deprecations, or issues. Runtime capture was not enabled; the actual archive-installed model turn is separate evidence. Added required build-version metadata, a source commit record, optional scoped package naming, and a release-mode clean-checkout guard. Registry publication/review remains pending.

The official ClawHub publication dry run also succeeded for the 20-file clean release candidate from `4122878`. Source ref/path were explicitly set to the source commit and repository root to avoid auto-detecting the ignored local staging folder. This preview uploaded nothing and did not validate account ownership or complete registry moderation. The final scoped name awaits the publisher's actual ClawHub owner handle.

The publisher subsequently supplied `brianmcguire` and completed ClawHub login; `whoami` confirmed that identity. The clean scoped artifact from `06feed7` passed local inspection and publication preview. Actual publication failed with the registry action's 512 MB memory limit; a subsequent moderation-status query returned Package not found. No public registry release is claimed. See [publication status and support draft](../submission/clawhub-publication-status.md).


## September 27 real two-person pilot

The founder and a different real project owner interacted in the same live Mac mini Control UI conversation using distinct verified runtime identities. The fictional Harbor pilot was already created by the founder on September 26. On September 27 the owner verified identity, joined the pilot-lead role, submitted a blocker update, answered the agent's recovery question, and applied a target-date correction. The founder requested briefs before and after the recovery and correction. This was a real two-person interaction; the project and delivery statements were explicitly fictional.

Read-only checks of the persistent SQLite store confirmed runtime attribution and original source receipts; two evidence-backed concerns; the recovery question marked answered; a synthetic-dataset recovery action due September 29; and the target corrected from September 30 to September 29 at revision 4. The correction event retained before/after values and the original update remained intact. The updated on-screen founder brief reflected the correction, resolved the target-date concern, retained the sandbox blocker and recovery plan, and kept synthetic-data approval pending. No budget baseline or variance was invented.

Network policy was restricted to the owner's Delivery Assurance HTTPS chat and widget ports, with separate gateway identity admission. Cross-network machine-share acceptance was not independently confirmed; the actual owner's verified chat access was confirmed. This does not establish project-level tenant isolation or agent-to-agent participation. Private account identifiers, network addresses, and invitation credentials are omitted here.

The seven-step pilot scenario is verified. A 60+ second recorded video, Agent Index registration/server-accepted genuine usage reporting, organizer verification, and successful ClawHub publication remain pending.


## Public name

Renamed to Delivery Lens on September 27. Existing delivery-assurance-agent plugin/agent identifiers, DELIVERY commands, repository URL, and persistent project records are retained. Earlier verification entries use the name displayed at the time.


## September 27 Agent Index registration and first report

The official client running alongside the Mac mini installation registered Delivery Lens under the retained delivery-assurance-agent slug. Registration returned the public listing URL https://aiworthusing.com/agent-index/delivery-assurance-agent. The first genuine usage report returned HTTP 200 with ok=true, three days and three model/day rows. Reported counters came from this installation's durable completed-run usage ledger, including the real pilot; no artificial activity was generated. The public listing could not be fetched by the web tool during this check, so public rendering and organizer verification remain pending. Continuous five-minute reporting is not yet supervised. No demo video URL exists yet.


## September 27 demo video publication

An 88.15-second, 1920×1080 edited walkthrough uses actual saved captures from the completed two-person pilot, with OpenAI Cedar AI-generated narration. The entire local video decoded without errors. It is explicitly labeled as a completed pilot replay with fictional project data, not a continuous live screen recording. The founder approved the finished video and uploaded it to YouTube as Unlisted: https://youtu.be/yOk-3M2gTH0. User-supplied screenshots show saved unlisted visibility, completed SD/HD processing, and playback after the requested private-window check. This is user-supplied playback evidence, not an independently performed signed-out playback test. Organizer acceptance of the retrospective format remains unverified.

## September 27 release and persistent reporting check

All 20 Node and 3 Python checks passed on checkout-local Node 24.16.0; the unmodified official client self-check and git diff whitespace check passed. The dedicated Mac mini user LaunchAgent is registered with StartInterval 300 and RunAtLoad true. Its first automatic invocation exited 0 and returned HTTP 200 / ok=true for the existing installation and three usage rows. No new model traffic or install identity was created. A second scheduled invocation also exited 0 with HTTP 200 / ok=true, confirming operation beyond startup. Reboot recovery has not yet been observed; a user LaunchAgent resumes after operator login, and reporting depends on the host being awake and online.

The YouTube ID was corrected from the initially misread character to `yOk-3M2gTH0`, and the official registration client returned updated for the existing Delivery Lens listing. Organizer verification is not complete. A verification request was posted from the entrant's signed-in Discord account to the official AI Worth Using hackathon support channel at 2:12 p.m. ET on September 27. No approval has been received. The request explicitly discloses the retrospective video format and asks whether a one-click image is required.
