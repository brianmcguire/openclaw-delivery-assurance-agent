# ClawHub publication support request

Resolved for this release: live registry checks now confirm published 0.1.0 with clean scans and downloads unblocked. No support message or GitHub comment was sent. Keep this draft as historical diagnostics; no escalation is currently needed. The latest retry created a pending publication attempt; do not report it as another memory failure or upload again while pending.

Post as an additional reproduction on the existing issue, rather than opening a duplicate:
https://github.com/openclaw/clawhub/issues/3788

## Suggested comment

We are seeing the same registry-side 512 MB Node.js action memory error when publishing Delivery Lens with ClawHub CLI 0.23.3 on September 26 and 27, 2026.

- Package: `@brianmcguire/delivery-assurance-agent`, version `0.1.0`, family `code-plugin`.
- Publisher identity: verified with `clawhub whoami`.
- Source: https://github.com/brianmcguire/openclaw-delivery-assurance-agent
- Latest prepared source: `be0ac20deea6c9c826854940da8ec5830374aacd`.
- Previous failed archive: 20 files, 29,829 bytes. Local validation had zero issues; dry run succeeded.
- Latest archive additionally includes the user integration guide, for 21 files.
- Actual failure: `Node.js action execution ran out of memory (maximum memory usage: 512 MB)`.
- Earlier post-failure moderation status: `Package not found`.
- Latest attempt started `2026-09-27T18:34:26.364Z` and returned at `2026-09-27T18:35:59.953Z` after a 45-second publication wait timeout.
- Attempt ID: `zx77k0etgccw0sn4bhq1mxmpqs8f6y7b`.
- Owner moderation status now exists: `scanStatus: pending`, `latestRelease: null`.
- Latest archive SHA-256: `6bd3a09d09f82cbc1941342647ceb365708f3c39225ac6605417c6ae3fc8f8f9`.
- If the attempt remains stuck, please correlate this attempt ID and package identity with backend stages.

Could a maintainer correlate our package identity and attempt timing with the failing backend action, stage, deployed revision, and resolved OpenClaw target? The CLI error did not include a request ID. We can supply the public artifact and run a requested reproduction. Please advise a supported retry path without bypassing security or provenance checks.

## Where to check locally

The private development checkout retains `.local/clawhub-lens-publish-result.json` and the timestamped retry result `.local/clawhub-lens-retry-diagnostic.json`. These contain captured CLI output, not a backend memory profile. Inspect before sharing. Do not share login tokens, the `.local` directory, OpenClaw state, or real project records.

A maintainer must inspect hosted registry logs. Changing the Mac mini gateway, local Node heap, or usage reporter does not change the hosted Convex action's memory limit.
