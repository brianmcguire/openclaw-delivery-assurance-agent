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
