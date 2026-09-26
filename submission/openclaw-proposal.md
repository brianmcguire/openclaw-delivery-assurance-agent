# Draft proposal: Delivery Assurance community plugin

This is a draft for maintainer discussion, not a filed issue or PR.

Small startup teams need someone to collect owner updates, notice threatened delivery dates, ask for a recovery plan, and bring decisions to the founder. Delivery Assurance implements that role in one shared OpenClaw conversation, with a durable SQLite record and attributed source evidence.

Repository: https://github.com/brianmcguire/openclaw-delivery-assurance-agent

## Proposed distribution

Publish an optional community plugin with its agent workspace and skill. Keep delivery policy outside core. The hackathon entry uses the same codebase with separately enabled official Agent Index reporting; ordinary plugin installations require no reporting account.

## Implemented behavior

Project setup cards; person joining instructions; runtime-bound human attribution; milestone updates; evidence-backed risks; recovery questions with duplicate suppression; founder briefs and decisions; audited corrections; local persistence. The agent has no customer messaging or arbitrary shell/file access. Independent agent enrollment and cross-gateway bridges are not implemented.

## Evidence to attach before posting

- Passing focused checks and CI for the proposed release.
- Local archive installation, config validation, and isolated gateway startup.
- Actual browser project creation and participant-card preparation.
- Pending: a real two-person pilot, redacted recording, and fresh end-to-end use from the packaged installation.

## Prior art and question for maintainers

ClawHub contains project-management skills, including the community Project skill. This proposal focuses on durable, attributed updates and recovery/decision tracking in a real shared workflow. We have not verified the other skill's implementation or claimed that this is the first project-management agent.

Would community plugin distribution with included onboarding and workspace instructions be the preferred route? If the pilot exposes a reusable platform gap, we would propose that separately before preparing a focused core PR. No core inclusion or maintainer endorsement is assumed.

Contribution guidance: https://github.com/openclaw/openclaw/blob/main/CONTRIBUTING.md
