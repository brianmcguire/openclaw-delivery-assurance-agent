# Use Delivery Lens with OpenClaw

Delivery Lens is one shared delivery lead. People supply updates and make decisions; the agent maintains the project record, asks recovery questions, and explains what needs attention. It is useful alongside your existing assistant, coding tools, and project systems. It does not replace them or automatically connect to them.

## Your first ten minutes

1. Open the dedicated Delivery Lens agent and send `DELIVERY START`. Choose a fictional example or your own project. Send `DELIVERY FORM` if you prefer form fields and choices.
2. Confirm `DELIVERY WHOAMI` returns a verified identity. Supply an outcome, delivery date, milestones, owner aliases, and escalation thresholds. Budget and effort are optional.
3. Review the draft and explicitly create the project. Wait for the saved-project receipt.
4. Send `DELIVERY PARTICIPANTS <project-id>`. Share the joining instructions with a real owner. The gateway operator admits their identity separately; the owner checks WHOAMI and sends the provided JOIN command.
5. The owner submits progress, next step, target date, blockers, and help needed. The agent records their source and asks a recovery question when necessary.
6. The owner answers with an action and date. The founder requests a brief and records any required decision. A recovery plan does not close a blocker.

Read the full multiplayer, privacy, and configuration guides in the source repository: https://github.com/brianmcguire/openclaw-delivery-assurance-agent

## Add it to an existing installation

Start with an isolated profile and a separate data directory, following the plugin README. This verifies compatibility without changing your main assistant. The supported runtime is OpenClaw 2026.9.5; later versions require fresh identity and workflow checks.

Once tested, an operator can add a dedicated Delivery Lens agent within an existing trusted-team gateway. Merge the plugin configuration and agent entry into the existing configuration; do not replace the gateway configuration with the repository's generated example. Keep the current provider, channels, and other agents. Use the installed `agent-workspace` as a source for a new workspace rather than overwriting another agent's instructions.

Set the plugin's `agentId` to that dedicated agent ID, configure a private absolute `dataDir`, keep `allowUnverifiedLocal:false`, and explicitly allow conversation access for the plugin's identity hooks. Restrict that agent to the six delivery tools and `show_widget`, following the plugin README and repository setup example. Apply tool restrictions to the dedicated agent rather than changing the entire gateway's tool policy. Validate the merged configuration and arrange any necessary gateway restart with the operator.

The plugin is currently configured for one delivery agent and one store per installation. It is not a way to provision separate private stores for arbitrary agents or customers. All people admitted to the gateway must fit its trust model. Session visibility and owner aliases are not security boundaries.

## Work alongside other skills and plugins

| Existing capability | Practical workflow today | Boundary |
| --- | --- | --- |
| Coding assistant such as Sparx or Clawd | Use it to implement a milestone. The accountable human reviews the result and supplies a Delivery Lens update. | Agent-to-agent enrollment and automatic forwarding are not implemented. |
| Research or planning skill | Use it to draft a milestone plan, then review the plan during Delivery Lens project creation. | Drafts do not create projects, owners, or commitments. |
| GitHub, Jira, Linear, or another project plugin | Use the existing tool to inspect work. The owner supplies an update with a ticket or pull-request reference in the text. | There is no automatic sync or ticket write-back. A copied reference is not independently verified ticket evidence. |
| Calendar or scheduling capability | The operator configures the documented weekly check-in in the Delivery Lens shared session. | The project's cadence field alone creates no schedule; delivery to email or customer channels is not implemented. |
| Messaging or outreach skill | Review the founder brief and prepare a message elsewhere. Explicitly approve any external send in that tool's own workflow. | Delivery Lens does not send messages, change project systems, or authorize commitments. |

Installing another plugin on the same gateway does not grant Delivery Lens its tools. Keep capability grants deliberate. Adding unrestricted shell, file, browser, or messaging access changes the restricted design that was tested.

## Example: a software pilot

The founder creates a fictional pilot with a test-data milestone and an owner. The owner uses their existing coding assistant to prepare an importer. After reviewing it, the owner sends the following from their own verified account in the Delivery Lens conversation:

```text
DELIVERY UPDATE <project-id> <milestone-id>
FICTIONAL EXAMPLE. I completed the importer and reviewed its test output. Next step is loading the sandbox data. My target is 2026-10-02. Sandbox access is blocked. I need approval to use synthetic data. Reference: repository pull request #42, supplied by me and not independently checked here.
```

The agent asks for a recovery action and date. The owner replies:

```text
DELIVERY RECOVERY <project-id> <milestone-id>
FICTIONAL EXAMPLE. I will prepare synthetic data by 2026-10-01. Founder approval is needed. Sandbox access is still unresolved.
```

Replace placeholders with saved IDs and use dates relevant to your project. The founder asks for the current brief. It should show the owner's evidence, the recovery plan, the open blocker, and the decision. Recording approval still does not send a customer message or execute the recovery action.

## Tool and data contract for future integrations

The six delivery tools provide record access, source-backed extraction, briefs, check-ins, and the two onboarding cards. Mutations enter through explicit `DELIVERY PROJECT`, `JOIN`, `UPDATE`, `RECOVERY`, `CORRECT`, and `DECIDE` chat messages. The runtime admits the source and contributor before the extraction tool can use it. Tool arguments cannot manufacture an authenticated contributor or substitute an arbitrary source.

Future connectors must preserve original statements, source references, actor identity, dates, and correction history. Automation output must be attributed as automation rather than impersonating an owner. Do not insert directly into SQLite, bypass admission checks, or clear blockers because an external task changed status. Integrations need their own approved capability scope and end-to-end checks before being described as supported.

## Daily use

Ask for a founder brief before your delivery meeting. Run `DELIVERY CHECKIN <project-id>` to identify stale updates or unanswered recovery questions. Ask for a correction draft when a fact is wrong, then send the correction with the current revision. Record a decision using the actual decision ID. Original updates remain in the audit history.

The live pilot verified two humans using one shared conversation. Remote agent enrollment, automatic project-system integrations, and iOS cards have not been verified. Optional hackathon usage reporting is configured separately and is excluded from the plugin package.
