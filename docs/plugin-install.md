# Delivery Lens plugin

One delivery lead for a startup or small agency: collect owner updates, preserve evidence, track recovery plans, and bring decisions to the founder. Use one installation per trusted team. Project owners are human identities; independent agent enrollment is not implemented.

## Example: a customer pilot is blocked

A small startup is preparing a customer pilot. The milestone owner reports that field mapping is complete, but sandbox access is missing. Delivery Lens records the owner's statement, flags the blocker, and asks for a recovery action and date. The owner proposes preparing synthetic test data by Thursday and asks for approval. The founder's brief shows the plan, who owns it, the approval needed, and that sandbox access remains unresolved. If the owner corrects the target date, the next brief reflects it while preserving the original update.

This is an illustrative use case. People supply updates through the shared OpenClaw conversation; Delivery Lens does not independently monitor sandbox access, generate test data, or send customer messages.

## Distribution artifact

The repository's `npm run package` builds a local `.tgz` from the same plugin and workspace used for the hackathon. It includes all tools, both HTML cards, agent instructions, the delivery skill, and MIT license. Agent Index registration, credentials, external reporting scripts, and live data are excluded. This command does not publish to npm or ClawHub.

Use supported Node 24.16+ (excluding Node 25) or 26.1+, OpenClaw 2026.9.5, and your configured tool-capable model provider. Validate compatibility again before using a later runtime. Prefer the repository's isolated installer for the complete first-run configuration. Do not install over a production agent.

For an existing isolated profile, install the reviewed local artifact with its own state/config environment:

```bash
openclaw plugins install /absolute/path/delivery-assurance-agent-0.1.2.tgz --force --accept-capabilities
```

`--accept-capabilities` accepts the reviewed six delivery tools; inspect the manifest first. OpenClaw installs this archive disabled until its required configuration is supplied.

`--force` explicitly confirms a local source and can replace an existing plugin. Inspect the package first; use a fresh profile for the first test. Configure `plugins.entries.delivery-assurance-agent.config.dataDir` as a private absolute directory and `agentId` as `delivery-assurance-agent`; keep `allowUnverifiedLocal:false`. Enable `hooks.allowConversationAccess` for this entry, which is required for attribution. Enable the plugin after setting its required configuration.

Copy `agent-workspace/` from the installed plugin to a new dedicated workspace and point `agents.entries.delivery-assurance-agent.workspace` there. Do not overwrite existing workspace instructions. Enable the `delivery-assurance` skill. Allow only `delivery_record`, `delivery_update`, `delivery_brief`, `delivery_checkin`, `delivery_setup_card`, `delivery_participant_card`, and `show_widget` for this agent. The repository's `scripts/setup.mjs` is the full configuration example, including denial of external messaging and arbitrary file/shell access. Adding tools to an unrestricted agent is not equivalent to this restricted delivery setup.

Validate config and restart the isolated gateway. Configure authenticated multi-user ingress according to the repository multiplayer guide; one shared token does not distinguish contributors. Behind HTTPS proxies, expose the separate sandbox listener on its own origin for inline cards.

## Work with existing OpenClaw capabilities

See [Use Delivery Lens with OpenClaw](using-with-openclaw.md), included in this package, for setup, coexistence with existing agents, and practical workflows with other skills and plugins. Use a dedicated delivery agent with restricted tools. Do not overwrite your main assistant or assume another installed plugin is automatically connected.

## First use

Send `DELIVERY START` or `DELIVERY FORM`, create the fictional project, then `DELIVERY PARTICIPANTS <project-id>`. Prepare the second person's joining instructions, admit their own identity separately, and confirm their WHOAMI and JOIN results. Ask for a brief after an owner update; request a correction draft to fix a fact while preserving evidence.

The local archive installed and started in an isolated test profile. CLI plugin info still reports `provenance-invalid` for that local source; no registry trust or listing is claimed. Verify release provenance for the eventual registry package.

No Agent Index account is required for plugin operation. Reporting is optional, explicitly configured by the hackathon operator outside this package. Multi-person live validation, registry publication, iOS behavior, and upstream maintainer acceptance are separate release checks.

Source and full guidance: https://github.com/brianmcguire/openclaw-delivery-assurance-agent
