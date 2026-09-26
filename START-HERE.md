# Start here: Delivery Assurance Agent

One shared agent acts as a startup's first delivery lead. The founder sets the outcome and makes decisions; a project owner supplies updates and recovery plans. The agent keeps the evidence and current brief. Sparx/Clawd integration is not part of this workflow.

## 1. Enter and choose your path

After [installation](README.md#installation) and [identity-bearing multiplayer setup](docs/multiplayer.md), open Delivery Assurance Agent in OpenClaw and start a new conversation. Send:

```text
DELIVERY START
```

For fields and multiple-choice controls, send **`DELIVERY FORM`** or ask “Show the project setup card.” It offers project details, owner/milestone inputs, cadence and baseline choices, and a review screen. In the browser, Create submits the reviewed command through your current identity. In native apps without a prompt bridge, copy the reviewed command into chat. No data is saved on Review; wait for the agent to confirm creation. Unsent form drafts are not shared or durable.

The agent explains its role, checks the current contributor identity, and asks whether you want **Try a fictional example** or **Set up your project**. It asks focused questions rather than requiring you to write project JSON yourself. At the end it gives you an exact project envelope to send. A draft is not saved until you send that envelope.

For the hackathon pilot, choose the fictional example. Its milestone dates are generated relative to the current UTC date. If a sample with the same ID already exists, resume it or choose a new ID. A solo rehearsal is available, but it is not proof of multiplayer.

## 2. Create the project

For your own project, supply the outcome, delivery date, milestones and owners, optional baseline, update cadence, and escalation rules. Use explicit ISO dates. All participants in this installation belong to one trusted team; do not enter private customer data into a broadly accessible gateway.

Send the `DELIVERY PROJECT` envelope the agent drafts. The agent records it and asks the assigned owners for updates.

## 3. Bring in a real owner

Have a second consenting person open the **same Shared conversation** using their own identity-bearing access. They send `DELIVERY WHOAMI`; the identity must be verified and distinct from yours. Gateway access may require the operator to add their login first. Sharing the session does not configure authentication or send an invitation.

The agent supplies the exact `DELIVERY JOIN <project-id> pilot-lead` command. The owner sends it from their connection. The agent checks enrollment against the project record. You cannot claim that alias yourself to simulate another person.

## 4. See the agent do work

The owner reports completed work, next step, target date, blockers, and help needed. For the fictional walkthrough, the agent supplies an example update with a missing-access blocker and threatened date. The owner sends it. The agent records the source and asks for a recovery action and date. The owner replies with a proposed synthetic-data recovery plan.

The founder then asks for the brief. Look for the original evidence, accountable owner, recovery action, pending approval, and missing information. Neither a plan nor a draft is approval. The agent asks questions in this conversation; it does not privately message anyone.

## 5. Continue operating

- Ask: `Give me the founder brief for <project-id>.`
- Send: `DELIVERY CHECKIN <project-id>` to collect missing or stale updates.
- Ask for a correction envelope; check its current revision, then send it. History is preserved.
- Ask for a decision envelope using an existing decision ID; the founder sends it to record approval or another resolution.

Weekly automation needs [operator setup](docs/multiplayer.md#cadence); a cadence field alone does not schedule anything. The agent does not send customer messages or make commitments.

Record this same sequence using [the demo shot list](submission/demo-script.md). Capture two real identities, the owner's update and recovery, the founder brief, and a correction. Never replace a pending human step with a scripted identity.

## If onboarding stops

An unverified identity must be fixed at the gateway. A draft may need additional dates or owners. A second person may still need access or enrollment. The agent should tell you which step is pending instead of claiming success. See [troubleshooting](README.md#troubleshooting) and [verification](docs/verification.md) for current limits. Conversational setup drafts live in the chat; the project ledger becomes durable after submission.

## Bring in the owner

After creation, send `DELIVERY PARTICIPANTS <your-project-id>`. Select the owner and prepare the joining packet with the actual shared conversation HTTPS address. The operator must admit their own identity first. Share the packet yourself; the card sends nothing. The owner sends WHOAMI and JOIN from their own account. Confirm the record afterward. The Agent option explains the connection gap; it does not connect a bot.
