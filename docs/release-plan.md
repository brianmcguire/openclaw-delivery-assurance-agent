# One codebase, two distribution paths

Delivery Assurance Agent is intended for both the AI Worth Using x OpenClaw hackathon and distribution as an OpenClaw community plugin. Both use the same delivery logic, persistent store, onboarding, setup card, prompts, and tests. Maintain one repository and shared release versions; do not fork a separate hackathon implementation.

## Package boundaries

- `plugin/`: reusable delivery tools, storage, and setup card. Ordinary plugin use must not require an Agent Index account or send external usage reports.
- `workspace/`: agent instructions and skills shipped with the supported installation workflow. Plugin packaging must include or explicitly install these instructions; installing only the tools is not a complete agent setup.
- `scripts/`: installation helpers and optional operator-run reporting/scheduling tools.
- `samples/`: clearly fictional examples usable by both audiences.
- `submission/`: hackathon description, recording plan, reporting evidence, checklist, and final links.

Local usage counters support the optional hackathon reporter. External registration and reporting require explicit operator setup. Keep account credentials, live project data, and installation identity outside published packages. Do not add reporting as a plugin startup side effect.

## Shared release acceptance

1. Verify project creation, attributed owner updates, risk detection, recovery tracking, founder decisions, corrections, and durable storage.
2. Complete a real two-person pilot with distinct verified identities. Fixture tests and a solo rehearsal do not establish multiplayer operation.
3. Verify fresh installation, included workspace instructions and HTML assets, supported runtime/provider configuration, and the actual published package contents.
4. Preserve one trusted-team boundary per installation and explicit approval for external actions. Document native-client limitations accurately.
5. Tag the tested shared release and reference that version in both distribution paths.

## Hackathon path

Use the same release with optional official Agent Index reporting enabled by its operator. Complete the real 60+ second video, registration, successful genuine usage report, organizer verification, and submission links. Follow [the hackathon checklist](../submission/checklist.md). These steps are not prerequisites for ordinary plugin use.

## OpenClaw contribution path

Prepare an installable community plugin using the current official SDK and packaging guidance. Verify installation from the proposed distribution artifact on a clean isolated profile. A public repository and working development checkout do not prove registry publication or fresh package installation.

Before proposing a new core capability, open a feature issue or discuss it with maintainers using the actual pilot evidence, alternatives, and prior art. OpenClaw currently directs most new capabilities to third-party plugins and skill contributions to ClawHub. Confirm the applicable distribution path for this combined plugin and agent workspace; do not assume a skill listing distributes executable plugin code.

Keep any agreed upstream PR focused on a reusable platform need. Delivery-specific policy remains in this plugin unless maintainers explicitly agree otherwise. Hackathon submission, community publication, and upstream acceptance are separate outcomes.

Official references, checked September 26, 2026:

- [OpenClaw contribution guidance](https://github.com/openclaw/openclaw/blob/main/CONTRIBUTING.md)
- [OpenClaw vision](https://github.com/openclaw/openclaw/blob/main/VISION.md)
- [Plugin documentation](https://docs.openclaw.ai/tools/plugin)

## Current gaps

The browser setup card has created a persistent fictional project under one verified founder identity. The two-person pilot, live iOS behavior, a fresh end-to-end model workflow from the locally installed archive, community package publication, Agent Index registration/reporting, video, and upstream proposal remain pending. See [verification](verification.md) for the detailed evidence.
