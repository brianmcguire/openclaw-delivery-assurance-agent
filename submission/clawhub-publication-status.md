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
