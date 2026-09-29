# Submission package

**Delivery Lens** — a first delivery lead for a startup or small agency.

The hackathon entry and OpenClaw plugin distribution use the same codebase and release. See [the shared release plan](../docs/release-plan.md); community publication and upstream acceptance have separate checks.

**One-sentence pitch:** Your startup's first delivery lead: turn owner updates and blockers into recovery plans and clear founder decisions in a shared OpenClaw conversation.

## Who Delivery Lens is for

Use Delivery Lens when customer delivery takes too much of the founder's attention, but the team is not ready to hire a delivery lead. It is intended for small startups and agencies managing customer projects or pilots, especially teams already using OpenClaw.

Updates are scattered, owners say "working on it," blockers linger, and the founder discovers a missed commitment too late. Delivery Lens gives the team a repeatable workflow:

- Collect updates from the people responsible for milestones.
- Spot threatened dates and unresolved blockers.
- Ask for a recovery action and date.
- Bring the founder specific decisions backed by the original updates.
- Preserve corrections so the current brief stays accurate.

For example, an owner reports that sandbox access is blocking a pilot. Delivery Lens asks for a recovery plan. The owner proposes synthetic data, and the founder's brief shows the approval needed while keeping the original blocker open.

The team works in a shared OpenClaw conversation without introducing another dashboard. Owners still need to provide updates; automatic monitoring of external project systems is not implemented.

## Agent Index description

Small teams often discover delivery trouble after a promised date has slipped. Delivery Lens keeps a durable project record in a shared OpenClaw conversation. It asks milestone owners for updates, attributes each reply to its authenticated contributor, detects date threats and blockers, requests a recovery action and date, and escalates decisions to the founder. Original statements and corrections remain traceable. It does not send customer messages or make commitments. For example, when missing sandbox access blocks a pilot, it asks the owner for a dated recovery plan and brings the synthetic-data approval decision to the founder.

## Concrete use case for reviewers

A startup is preparing a customer pilot, but the milestone owner cannot get sandbox access. Delivery Lens records the owner's update, flags the blocker, and asks for a recovery action and date. The owner proposes synthetic test data and requests approval. The founder's brief shows who owns recovery, when it is due, the approval needed, and that sandbox access remains unresolved. A corrected target date updates the brief while preserving the original evidence.

This is the fictional scenario used in the completed two-person pilot and linked demo. The project data is fictional; the founder and owner interactions were performed by two real people. The agent records and coordinates the plan. It does not create the dataset, grant access, or send customer messages.

## Startup role and real problem

Role: the first delivery lead, before the team needs a PMO. It keeps a customer pilot or implementation moving when the founder cannot chase every milestone. The design uses delivery-practice concepts—baselines, accountable owners, evidence, recovery plans, and escalation—without requiring enterprise project software. The public example is wholly fictional and works for software startups, agencies, and service businesses.

## Start here

Read [the guided walkthrough](../START-HERE.md). Send `DELIVERY START` in the running agent and choose the fictional example. It introduces the role, checks identity, drafts setup, and guides two real contributors through the delivery workflow.

## Install and use

See [installation](../README.md#installation), [multiplayer setup](../docs/multiplayer.md), [architecture](../docs/architecture.md), and [privacy](../docs/privacy.md). A clone plus checkout-local OpenClaw, a configured model, and one trusted team's shared conversation are sufficient. Two distinct people must authenticate and contribute to establish the live multiplayer result.

## Published plugin

[Delivery Lens on ClawHub](https://clawhub.ai/brianmcguire/plugins/delivery-assurance-agent) is a community code plugin. Version 0.1.3 is published under Productivity with a clean scan and an expanded use-case README. ClawHub publication is separate from hackathon organizer verification.

## Published demo

[Watch Delivery Lens](https://youtu.be/yOk-3M2gTH0): an 88-second edited walkthrough of the completed real two-person pilot, using fictional data and AI-generated Cedar narration. The organizer subsequently verified Delivery Lens; their reply did not separately discuss the retrospective video format.

## Published screenshots

The [Agent Index listing](https://aiworthusing.com/agent-index/delivery-assurance-agent) shows three unaltered [OpenClaw pilot captures](screenshots/README.md): the owner's blocker update and recovery question, the dated recovery answer, and the corrected founder brief. They depict real interactions with fictional project data. The captures predate the new Delivery Lens icon installed on September 29.

## Organizer verification

The entrant provided a September 27 organizer reply stating “Delivery Lens is now Verified.” The organizer said they tested the published BYO setup through its native Codex route and confirmed the project workflow and separate-installer usage reporting. One-click remains off because this release has no cloud image; the organizer described that as by design. This is user-provided organizer correspondence, not an independently fetched public status page.

## Submission assets

- [Pilot runbook](pilot-runbook.md): exact interactions for the existing fictional project.
- [OpenClaw proposal draft](openclaw-proposal.md): prepared for maintainer discussion; not submitted.
- [Demo script and shot list](demo-script.md): exact 60–90 second two-person recording sequence.
- [Usage evidence](usage-evidence.md): capture real attribution and successful reporting without private data.
- [Requirement checklist](checklist.md): verified rules and acceptance status.
- [Implemented versus planned](scope.md).
- [Links](links.json): repository, video, and Agent Index fields.
- [Verification](../docs/verification.md): tested facts and outstanding acceptance gates.
- [Official client steps](../docs/agent-index.md): registration, credential caveat, dry run, live report, and five-minute reporter.

The real two-person demonstration, video, Agent Index entry, successful genuine usage report, and organizer verification are recorded. Keep the reporting host online for genuine usage through the September 30 leaderboard snapshot.
