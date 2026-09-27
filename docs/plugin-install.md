# Delivery Lens

Your startup's first delivery lead, inside OpenClaw.

Use Delivery Lens when customer projects take more coordination than the founder can personally manage, but the team is not ready to hire a delivery lead. Owners contribute updates in one shared conversation. Delivery Lens keeps the project record current, spots delivery concerns, asks for recovery plans, and brings decisions to the founder.

[Watch the 88-second two-person demo](https://youtu.be/yOk-3M2gTH0) · [Source and full setup guide](https://github.com/brianmcguire/openclaw-delivery-assurance-agent)

## When would you use it?

| Situation | What Delivery Lens does | What the founder gets |
| --- | --- | --- |
| A customer pilot is blocked by missing access | Records the owner's update, flags the blocker, and asks for a recovery action and date | A proposed workaround, its owner and due date, and the approval needed |
| An agency launch keeps slipping | Tracks stated target dates and repeated rollover, asks the owner for a recovery plan, and records missing information | A brief explaining the delivery concern and the decision or intervention needed |
| A small implementation team has incomplete or conflicting updates | Identifies stale updates or supported conflicts and asks focused questions in the shared conversation | A current assessment with source references and explicit gaps rather than assumed progress |

These are illustrative use cases. Delivery Lens assesses the updates people submit; it does not independently monitor external systems.

## A pilot from blocker to founder decision

Imagine a startup preparing a fictional customer pilot. Brian is the founder. Jonathan owns the test-data milestone. They use their own verified accounts in the same OpenClaw conversation.

**1. The founder sets the plan.** Brian sends `DELIVERY START`, chooses the fictional example, and confirms the outcome, milestones, owners, dates, and escalation rules. `DELIVERY FORM` offers fields and multiple-choice options. A reviewed draft becomes durable only after explicit submission and a saved-project receipt.

**2. The owner joins and reports a blocker.** Jonathan checks `DELIVERY WHOAMI`, sends the joining command supplied by the agent, and submits:

```text
DELIVERY UPDATE demo-pilot data-access
FICTIONAL EXAMPLE. I completed the field mapping. Next step is loading test data. Sandbox access is blocked. My target is 2026-10-02. I need the founder to approve synthetic data.
```

**3. Delivery Lens asks for recovery.** It records Jonathan's original statement and source reference, flags the blocker, and asks a focused question such as:

> What recovery action will you own, by what date, and what decision do you need from the founder?

**4. The owner gives an action and date.**

```text
DELIVERY RECOVERY demo-pilot data-access
FICTIONAL EXAMPLE. I will prepare a synthetic test dataset by 2026-10-01. I need founder approval to use it. Sandbox access is still unresolved.
```

**5. The founder sees the decision.** Brian asks:

```text
Give me the founder brief for demo-pilot.
```

The brief includes the current health and reasons, changes since the previous brief, due milestones, evidence-backed risks, recovery actions, founder decisions, and missing information. For this example, the useful result is:

| Item | What the brief should make clear |
| --- | --- |
| Open issue | Sandbox access remains blocked |
| Accountable owner | Jonathan, linked to the enrolled owner alias |
| Recovery plan | Prepare synthetic test data by 2026-10-01 |
| Decision needed | Founder approval to use synthetic data |
| Evidence | References to the admitted update and recovery statements |

This table describes expected content, not a fabricated agent response. The exact assessment depends on the saved project and dates. A recovery plan does not close the blocker or approve itself.

Use actual saved project and milestone IDs and current ISO dates when trying this example. The guided fictional setup supplies them for you.

## What multiplayer means here

One delivery agent works with multiple human contributors. The founder sets direction and records decisions. Each owner supplies their own updates and recovery commitments. Both can see the agent's questions and resulting brief in the shared conversation.

Each person needs their own identity-bearing gateway access. Send `DELIVERY PARTICIPANTS <project-id>` for joining instructions, then verify WHOAMI and JOIN from the second person's account. The joining card prepares text; it does not send an invitation or grant access. One person operating two names is a solo rehearsal, not multiplayer.

Use one installation per trusted team. Private customer separation requires separate trust boundaries; session visibility is not tenant isolation. Independent agent enrollment, including Sparx or Clawd as an owner, is not implemented.

## Your regular delivery routine

- Before a delivery meeting, ask for the founder brief.
- Send `DELIVERY CHECKIN <project-id>` to surface stale updates and unanswered recovery questions. Questions appear in the shared conversation; owners need to open it.
- When a fact is wrong, ask for a correction draft, check its current revision, and send it. The next brief uses the corrected fact and preserves the original evidence.
- When a decision is ready, ask for a decision draft with the actual decision ID. The founder explicitly sends it to record the resolution.

The operator can configure a weekly check-in using the repository's cadence guide. A cadence field alone does not activate a schedule. Budget and effort variance require supplied baselines and actuals; otherwise they remain unavailable.

## Work alongside your existing tools

Keep your coding assistant for implementation, research skills for discovery, and project tools for managing tickets. The accountable human reviews those results and submits a Delivery Lens update. A supplied ticket reference can remain in the original statement, but it is not independent verification of that ticket.

See [Use Delivery Lens with OpenClaw](using-with-openclaw.md), included in this package, for handoffs and adding a dedicated delivery agent to an existing trusted-team gateway. Automatic GitHub/Jira/Linear synchronization and agent-to-agent forwarding are not implemented. Delivery Lens does not send customer messages, change external project systems, or make commitments.

## Install and configure

Install into a fresh isolated profile first:

```bash
openclaw plugins install clawhub:@brianmcguire/delivery-assurance-agent
```

Installation alone does not configure the agent, model, ledger, or multiplayer access. For the complete guided setup, follow the [repository installation instructions](https://github.com/brianmcguire/openclaw-delivery-assurance-agent#installation). The operator configures a dedicated workspace, private data directory, restricted tools, model provider, and authenticated shared access. Keep your existing production agent intact.

### Operator details

Use supported Node 24.16+ (excluding Node 25) or 26.1+, OpenClaw 2026.9.5, and your configured tool-capable model provider. Validate compatibility again before using a later runtime. Prefer the repository's isolated installer for the complete first-run configuration. Do not install over a production agent.

For an existing isolated profile, install the reviewed local artifact with its own state/config environment:

```bash
openclaw plugins install /absolute/path/brianmcguire-delivery-assurance-agent-0.1.3.tgz --force --accept-capabilities
```

`--accept-capabilities` accepts the reviewed six delivery tools; inspect the manifest first. OpenClaw installs this archive disabled until its required configuration is supplied.

`--force` explicitly confirms a local source and can replace an existing plugin. Inspect the package first; use a fresh profile for the first test. Configure `plugins.entries.delivery-assurance-agent.config.dataDir` as a private absolute directory and `agentId` as `delivery-assurance-agent`; keep `allowUnverifiedLocal:false`. Enable `hooks.allowConversationAccess` for this entry, which is required for attribution. Enable the plugin after setting its required configuration.

Copy `agent-workspace/` from the installed plugin to a new dedicated workspace and point `agents.entries.delivery-assurance-agent.workspace` there. Do not overwrite existing workspace instructions. Enable the `delivery-assurance` skill. Allow only `delivery_record`, `delivery_update`, `delivery_brief`, `delivery_checkin`, `delivery_setup_card`, `delivery_participant_card`, and `show_widget` for this agent. The repository's `scripts/setup.mjs` is the full configuration example, including denial of external messaging and arbitrary file/shell access. Adding tools to an unrestricted agent is not equivalent to this restricted delivery setup.

Validate config and restart the isolated gateway. Configure authenticated multi-user ingress according to the repository multiplayer guide; one shared token does not distinguish contributors. Behind HTTPS proxies, expose the separate sandbox listener on its own origin for inline cards.

## What's verified

Two real people completed the fictional pilot through a shared OpenClaw conversation, including an owner blocker update, recovery plan, founder brief, and audited correction. The linked video is an explicitly labeled retrospective walkthrough of actual saved captures with AI-generated Cedar narration. The repository contains automated checks for attribution, risk detection, corrections, persistence, and cards.

ClawHub 0.1.2 is published as a community code plugin with clean scans. A fresh registry installation and full onboarding test remain separate from publication. iOS card behavior and independent agent participation have not been verified. See [the current verification record](https://github.com/brianmcguire/openclaw-delivery-assurance-agent/blob/main/docs/verification.md).

No Agent Index account is needed to use the plugin. Hackathon usage reporting is optional operator configuration outside this package. The archive includes delivery tools, workspace instructions, skill, both cards, this guide, and the MIT license. It excludes live project records and reporting credentials.

## License

MIT. Source, multiplayer setup, privacy notes, and troubleshooting: https://github.com/brianmcguire/openclaw-delivery-assurance-agent
