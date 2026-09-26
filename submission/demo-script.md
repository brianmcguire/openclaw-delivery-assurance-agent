# Real two-person demo — 80–90 seconds

This is a recording plan, not a claim that a video exists. Use the fictional Harbor pilot. Have two actual people on their own authenticated Tailscale accounts and devices. Do not operate both accounts yourself or use invented contributor names. Get both people's agreement to the recording. Show only demo project data; crop account emails, tokens, unrelated conversations, and tailnet administration.

## Prepare before recording

1. Install and start the isolated gateway using the README and multiplayer guide. For an externally managed Serve route, configure trusted-proxy identity and allowlist both people's Tailscale logins first. Confirm both people can open the same Shared session.
2. Each sends `DELIVERY WHOAMI`. Confirm distinct verified runtime IDs. A display name alone is insufficient. Capture that check with IDs partially redacted but distinguishable.
3. Founder copies `node scripts/envelope.mjs PROJECT samples/project.json` to their clipboard. Owner opens `samples/owner-update.txt` and `samples/owner-recovery.txt` locally. Keep `samples/correction.json` available; obtain the actual current revision before using it.
4. Record at least 60 seconds of the running agent. Target 85 seconds of edited footage. It is acceptable to trim real waiting time and label the cut; do not replace model results with a prewritten report. Keep an uncut source recording as evidence.

## Shot list and exact interactions

| Time | Person and screen | Action / on-screen text | Narration |
|---|---|---|---|
| 0–8s | Split view of founder and owner | Show the two identity replies and the same Shared conversation. | “This is Delivery Assurance Agent, the first delivery lead for a small startup. Two people are using the same project conversation.” |
| 8–20s | Founder | Paste the `DELIVERY PROJECT` envelope from the fictional sample. Show named owner questions. | “I give it the outcome, milestone owners, dates, and escalation rules. It starts collecting updates.” |
| 20–35s | Owner, own account | Send `DELIVERY JOIN harbor-pilot pilot-lead`, then paste `samples/owner-update.txt`. | “Our pilot lead reports missing sandbox access and a threatened date.” |
| 35–45s | Agent reply | Show the actual risk, source reference, and recovery question. | “It records who said what and asks for a recovery action and date.” |
| 45–57s | Owner | Paste `samples/owner-recovery.txt`. Show the recorded plan and pending founder approval. | “The owner proposes synthetic data by September 24. A plan is recorded, but the blocker is still open.” |
| 57–72s | Founder | Send `Give me the founder brief for harbor-pilot.` Show health, recovery date, evidence, and decision needed. | “The founder sees what changed, the remaining risk, and the decision to approve synthetic data.” |
| 72–85s | Owner then founder | Submit the correction envelope below with the current revision, then ask `Show the updated brief for harbor-pilot, focusing on the corrected target.` | “Corrections update the assessment without erasing the original statement.” |
| 85–90s | Final brief and public repo | Show MIT repository and genuine Index link only if it exists. | “One shared delivery workflow, a durable record, and a clear next decision.” |

Correction envelope (revision 3 is expected after one update and one recovery; check it):

```text
DELIVERY CORRECT
{"project":"harbor-pilot","milestone":"data-access","field":"targetDate","value":"2026-09-24","reason":"FICTIONAL SAMPLE: I typed the wrong target date.","expectedRevision":3}
```

The correction should resolve the threatened-date concern, preserve the missing-access blocker and recovery plan, and retain the original September 25 statement in the evidence history. If it does not, stop and fix the actual record before recording a successful claim.

## If the live model is slower

Record the full sequence, then trim waiting time while leaving each person's real input and the actual resulting output visible. Keep the finished video between 60 and 90 seconds. Do not imply a third-party message or notification was sent; questions appear in the shared session.

## Final acceptance

Capture the seven requested steps: founder creation; distinct owner update; agent recovery question; owner action/date; updated risk; founder decision brief; correction reflected. Save the real video URL in `submission/links.json` and use its YouTube video ID during Index registration. No recording is bundled with this repository.
