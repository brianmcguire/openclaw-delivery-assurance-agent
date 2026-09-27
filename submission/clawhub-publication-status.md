# ClawHub publication attempt

Checked September 26, 2026. This is not a successful publication receipt.

- Authenticated publisher: `brianmcguire`, verified using `clawhub whoami`.
- Proposed package: `@brianmcguire/delivery-assurance-agent`, version `0.1.0`.
- Source commit: `06feed72971b0d0a8ba0b23d17142338b08b4a5e`.
- Artifact: 20 files, approximately 30 KB; MIT license; no live data or reporting credentials.
- Official ClawHub CLI: `0.23.3`.
- Local static Plugin Inspector against OpenClaw `2026.9.5`: pass, zero findings.
- Scoped publication preview: pass, no upload.
- Actual authenticated publication: failed with a registry-side Node.js action memory limit (512 MB).
- Subsequent `clawhub package moderation-status @brianmcguire/delivery-assurance-agent --json`: `Package not found`.

No public installability, pending moderation record, registry URL, or successful release is claimed. Do not change package identity or inflate installs to work around this failure. Retry the same release after the registry service issue is resolved, checking status first.

## Support draft — not sent

I attempted to publish `@brianmcguire/delivery-assurance-agent` 0.1.0 using ClawHub CLI 0.23.3. The roughly 30 KB package passes the local static Plugin Inspector with zero findings and the publication dry run succeeds. The actual publish fails with: “Node.js action execution ran out of memory (maximum memory usage: 512 MB).” A subsequent moderation-status query returns Package not found. Can you inspect the registry-side publication action or advise the supported retry path?

Public source: https://github.com/brianmcguire/openclaw-delivery-assurance-agent/tree/06feed72971b0d0a8ba0b23d17142338b08b4a5e

No credentials, private logs, or project records are attached. Send this yourself to the official OpenClaw/ClawHub support channel if the failure persists.

## September 27 Delivery Lens retry

Rebuilt from published commit `21723a760d5619e6fce4aae4fd04ed2483cb879a` under the same package identity, `@brianmcguire/delivery-assurance-agent` 0.1.0, with display name Delivery Lens. ClawHub CLI 0.23.3 is the current npm release; authenticated publisher is brianmcguire.

- All 20 Node and 3 Python checks passed.
- Official static inspector against OpenClaw 2026.9.5 returned zero issues.
- Publication dry run passed: 20 files, 29,829 bytes.
- Archive privacy scan passed, including comparison against locally available credentials without exposing them.
- Archive SHA-256: `e314b0f7978b46f177f7742856034d041761b363e430f16c95ff1a29da7aee76`.
- Actual publication again failed with the registry-side 512 MB Node.js action memory limit. This is not a package-size rejection or successful submission.
- Post-attempt moderation status returned `Package not found`; no release or moderation receipt exists.

The prepared artifact is generated locally under `.local/releases/brianmcguire-delivery-assurance-agent-0.1.0.tgz`. Follow `docs/plugin-publishing.md` to rebuild and retry with the recorded source commit after the registry issue is resolved. A ClawHub public installation cannot yet be verified. The MIT GitHub installation remains available.

## September 27 pending retry after upstream issue investigation

A bounded retry from source commit `be0ac20deea6c9c826854940da8ec5830374aacd` began at 18:34:26 UTC. The CLI returned at 18:35:59 UTC with a 45-second publication wait timeout and attempt ID `zx77k0etgccw0sn4bhq1mxmpqs8f6y7b`, still pending. Unlike prior attempts, the owner moderation endpoint now reports an existing Delivery Lens package, `scanStatus: pending`, and `latestRelease: null`. Public inspect remains unavailable. This confirms a staged attempt, not public publication or installation. Do not upload another copy while pending.

The same memory error is tracked at https://github.com/openclaw/clawhub/issues/3788. Another reporter described an unchanged-artifact retry succeeding. That is upstream evidence of intermittency, not proof our checks will finish. See `clawhub-support-request.md` for the prepared, unsent diagnostic request.

Check from the development checkout:

```bash
export PATH="$PWD/.local/node/node_modules/node/bin:$PATH"
.local/publish-cli/node_modules/.bin/clawhub package moderation-status @brianmcguire/delivery-assurance-agent --json
.local/publish-cli/node_modules/.bin/clawhub package inspect @brianmcguire/delivery-assurance-agent --json
```

Hosted backend memory/stage logs require registry maintainers. The local captured error is `.local/clawhub-lens-publish-result.json`; the timestamped latest result is `.local/clawhub-lens-retry-diagnostic.json`. Neither contains a hosted memory profile.

## September 27 publication confirmed

Live authenticated registry checks after the founder observed the public New Plugins listing confirm Delivery Lens 0.1.0 is published as `@brianmcguire/delivery-assurance-agent`, family `code-plugin`, community channel. Package and latest-release scan status are `clean`; `blockedFromDownload` is false. Public inspect returns latest version 0.1.0 and all 21 packaged files. SHA-256 matches the reviewed archive: `6bd3a09d09f82cbc1941342647ceb365708f3c39225ac6605417c6ae3fc8f8f9`.

The release links source commit `be0ac20deea6c9c826854940da8ec5830374aacd`. Registry verification is `source-linked`, scope `artifact-only`, `hasProvenance:false`; this is not official OpenClaw endorsement or full build provenance. A fresh registry installation and workflow check have not yet been performed. The earlier memory failure cleared on the bounded retry; no support request was sent.
