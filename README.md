# Delivery Assurance Agent

A first delivery lead for startups and small agencies. It asks milestone owners for updates, records what they said, flags delivery concerns, follows up for a recovery action and date, and brings decisions to the founder.

This project targets both the hackathon and distribution as an OpenClaw community plugin, using one codebase and shared releases. Agent Index reporting is optional operator setup for the hackathon. See [the release plan](docs/release-plan.md) for packaging boundaries and acceptance checks.

**New here? Read [Start here](START-HERE.md), then send `DELIVERY START` in the agent conversation.** The guided walkthrough explains the role, offers a fictional example or your own project, checks identity, drafts project setup, and helps a second real person join. It is one shared agent with multiple human contributors.

It runs in a shared OpenClaw conversation with a small local SQLite store. No PMO, dashboard, project-management subscription, or fixed model provider is required. All included project data is fictional.

The MVP includes project records, source-checked free-form updates, rule-based health, owner questions, correction history, founder decisions and briefs, and the official AI Worth Using client with an installation-scoped collector. See [verification](docs/verification.md) for the exact tested state and remaining hackathon acceptance items. Automated test identities are not a verified two-human demonstration.

## Requirements

- macOS or Linux with npm and Python 3.10+.
- OpenClaw 2026.9.5 and Node 24.16+ below 25, or Node 26.1+. The installer places pinned Node and OpenClaw inside this checkout; it does not update your global installation.
- A working OpenClaw model provider that can call tools. Use your own local or cloud provider. The local development run used an existing ChatGPT/Codex sign-in; public installation does not require it.
- For the demonstrated access design: Tailscale with HTTPS enabled, two real people with distinct identities, and permission to access the shared gateway. Other supported identity-bearing access needs its own validation.

## Installation

Clone this repository and enter its directory:

```bash
git clone https://github.com/brianmcguire/openclaw-delivery-assurance-agent.git
cd openclaw-delivery-assurance-agent
```

Choose an available provider/model, then install:

```bash
export DELIVERY_MODEL='your-provider/your-model'
scripts/install.sh
```

For an existing native Codex login, explicitly opt into reuse:

```bash
export DELIVERY_MODEL='openai/gpt-6-sol'
scripts/install.sh --reuse-codex-login
```

Choose a model available to your account. For Tailscale Serve on a host with no conflicting Serve route, add `--tailscale`. Inspect `tailscale serve status` first. The installer refuses to overwrite an existing isolated config; it never uses `--force` against your global gateway.

Configuration lives in `.local/delivery-openclaw/openclaw.json`; the private workspace is `.local/delivery-workspace`; the ledger is `.local/delivery-data/delivery.sqlite`. Use the repository wrapper for every command:

```bash
scripts/openclaw config validate
scripts/openclaw models status
# If needed, authenticate your chosen provider in this isolated profile:
scripts/openclaw models auth login --provider YOUR_PROVIDER
scripts/openclaw gateway run
```

The gateway binds to loopback port 19789. Set `DELIVERY_PORT` before initial setup to use another port. Do not run a second copy against the same state directory. Stop the foreground process with Ctrl-C. Optional Serve belongs to that process and is released when it stops.

`--reuse-codex-login` uses OpenClaw's documented `appServer.homeScope: "user"` opt-in. It does not import secrets into Git. The team shares that model route inside one trusted installation. A separate OpenClaw provider login is preferable when the host's native Codex work must be independent. The OpenAI runtime requires the official `@openclaw/codex` plugin; the installer installs it through OpenClaw so its trust record is valid. Copying its directory alone is insufficient.

For a local model, use an `ollama/MODEL` reference and follow the current [OpenClaw Ollama setup](https://docs.openclaw.ai/providers/ollama/setup) and [provider configuration](https://docs.openclaw.ai/providers/ollama/configuration) in this isolated profile. Use `scripts/openclaw` wherever those instructions say `openclaw`. Local Ollama uses its native endpoint without `/v1`; choose a model that supports tool calls. This route is documented but was not live-tested here.

See [.env.example](.env.example) for supported variables. It is documentation, not a credentials file loaded by the agent.

## Multiplayer quick start

Follow [multiplayer setup](docs/multiplayer.md). Both people open the same Shared Control UI session under separate authenticated identities. Send `DELIVERY WHOAMI` and verify distinct identities before claiming multiplayer works.

The founder creates the fictional project by pasting the output of:

```bash
node scripts/envelope.mjs PROJECT samples/project.json
```

If your default Node is unsupported, use `.local/node/node_modules/node/bin/node` instead. The agent asks named owners for status. The second person claims the unbound owner alias:

```text
DELIVERY JOIN harbor-pilot pilot-lead
```

The owner submits ordinary prose after a short routing header:

```text
DELIVERY UPDATE harbor-pilot data-access
FICTIONAL SAMPLE. I completed the field mapping. Next step is loading the test data. I am blocked because the sandbox access has not arrived. My target is 2026-09-25. I need the founder to approve using a synthetic dataset if access is still missing tomorrow.
```

The agent records the source, flags the threatened date and blocker, and asks the owner for a recovery action and date. The owner answers:

```text
DELIVERY RECOVERY harbor-pilot data-access
FICTIONAL SAMPLE. I will build a synthetic dataset by 2026-09-24. The access blocker is still open. I need the founder to approve using a synthetic dataset if access is still missing tomorrow.
```

A plain-language reply also works when that person has exactly one outstanding milestone in this shared session. Use the header when several milestones need answers. Dates must be explicit `YYYY-MM-DD`; the agent asks for clarification instead of inventing a date.

The founder asks, "Give me the founder brief for harbor-pilot." The brief shows the recovery plan, the remaining blocker, and the approval decision. The plan does not silently resolve the issue.

## Corrections and decisions

Ask for the current record first, then use its milestone revision:

```text
DELIVERY CORRECT
{"project":"harbor-pilot","milestone":"data-access","field":"targetDate","value":"2026-09-24","reason":"FICTIONAL SAMPLE: I typed the wrong target date.","expectedRevision":3}
```

The revision is an example, not a fixed value. Corrections retain the original source and audit event. Supported fields are date, target date, owner, status, blocker, and recovery date, as described in the agent instructions. Founder or assigned owner can correct facts; the founder reassigns owners. Setting blocker to null explicitly clears it. Correcting status resolves a recorded completion conflict; correcting the target resets the rollover count because the prior sequence may be erroneous.

Record an actual founder decision using the returned decision ID:

```text
DELIVERY DECIDE
{"project":"harbor-pilot","decisionId":"COPY_FROM_RECORD","resolution":"Approved synthetic test data for the internal pilot. No customer commitment is authorized."}
```

Ask for a brief again to see the change. Merely drafting the decision does not approve it.

## Cadence and follow-up

`DELIVERY CHECKIN harbor-pilot` collects missing or stale updates and new recovery questions. Questions remain in the shared session. The store tracks open, answered, and superseded questions; it does not repeatedly ask for a recovery plan already supplied. Missed recovery dates or unanswered questions are escalated in the founder assessment.

For weekly operation, use [the cadence instructions](docs/multiplayer.md#cadence). This posts in the shared conversation and does not send to customers, email, or private chat channels. Team members need to open the session. There is no claimed push-delivery guarantee.

## Configure for your own startup

Copy `samples/project.json`, change the ID, alias, outcome, owners, dates, and milestone plan, and set `sample:false` for real internal work. Keep the resulting file outside the repository. The data model has no healthcare requirement. A design agency, software startup, or implementation consultancy can use the same workflow.

Set optional `baseline.effortHours` or `baseline.budget` with `baseline.currency`. Actuals must be cumulative per milestone and explicitly stated. Without a baseline or complete actuals, variance is listed as unavailable. Configure due-soon, unanswered-follow-up, rollover, and variance thresholds. Project `cadenceDays` defaults to seven; keep the scheduler interval consistent with it.

Use a separate checkout, gateway profile, and data directory per trust boundary. This agent does not provide customer-level tenant isolation. Read [privacy and permissions](docs/privacy.md) and [architecture](docs/architecture.md).

## Project setup card

Send `DELIVERY FORM` in the browser conversation for a four-step inline form: project, team/milestones, cadence/rules, review. Choose fictional or real data, a two-person workflow or solo rehearsal, and an optional effort/budget baseline. The reviewed Create action submits through the current chat identity; the host still validates the project. Native clients without the prompt bridge can copy the reviewed command. Unsent form drafts disappear on reload. Live iOS compatibility is not yet verified.

## Add a participant

Send `DELIVERY PARTICIPANTS <project-id>` to open the joining card. Choose Person, select an existing unbound owner role, and enter the shared HTTPS conversation address. The card prepares text for you to share yourself; it sends nothing and grants no access. The gateway operator separately admits the person's own identity. They send WHOAMI and JOIN from their own account, then the agent confirms enrollment. The Agent option explains why Clawd/Sparx or agents on other gateways cannot yet connect.

## Plugin distribution

The same source builds an installable local plugin archive with `npm run package`. It includes both cards, workspace instructions, skill, and MIT license, without Agent Index reporting assets. See [plugin installation](docs/plugin-install.md) and [the shared release plan](docs/release-plan.md). Registry publication and upstream acceptance remain separate steps.

## Checks and usage reporting

```bash
npm ci
PATH="$PWD/.local/node/node_modules/node/bin:$PATH" npm test
python3 vendor/agent-index-client/agent_index_client.py --self-check
python3 scripts/agent-index.py --preview
```

The first two commands are offline checks. Preview reads genuine completed-run counters from this installation and never posts. Tests use temporary stores and cannot inflate the project's reporting table. Follow [Agent Index registration and reporting](docs/agent-index.md) to publish and enable the official five-minute report loop. A successful preview does not establish registration or leaderboard reporting.

## Troubleshooting

- **No identity or `local-test`:** disable `allowUnverifiedLocal`, use identity-bearing access, and test `DELIVERY WHOAMI`. One shared token is not two people. Local-test mode exists only for an explicitly labeled developer smoke test.
- **No models:** configure credentials through this wrapper, then check `models status`. An OpenAI route needs the official Codex plugin installed, not copied. Other providers use their own OpenClaw setup.
- **Plugin trust error:** reinstall the official provider plugin in this isolated profile with `scripts/openclaw plugins install @openclaw/codex@2026.9.5 --force`, then inspect it. Do not modify trust databases by hand.
- **Native session policy handoff after configuration edits:** preserve the conversation and start a fresh session after the provider reconnects. Avoid editing the tool policy during an active run.
- **Invalid update fields:** preserve exact spans, use ISO dates, and state units. Missing information remains unknown. Use the routing header if a plain reply could refer to multiple milestones.
- **Stale correction:** read the current revision and retry deliberately. Do not repeatedly submit the old revision.
- **Serve unavailable or occupied:** use the loopback UI for local setup, keep multiplayer pending, and fix the tailnet/HTTPS route. Do not use public Funnel as an identity workaround.
- **Widget sandbox host unavailable:** expose the separate sandbox listener through a dedicated HTTPS origin and configure `mcp.apps.sandboxOrigin`; see [proxy sandbox setup](docs/multiplayer.md#inline-card-sandbox-behind-a-proxy). Keep that origin separate from authenticated content.
- **Usage registration unavailable:** complete Plow sign-in or obtain the agent-scoped token. A missing collector or unreadable registration state is an error, not zero usage.

## Submission and license

The [submission package](submission/README.md) includes the pitch, checklist, implemented scope, and exact two-person demo sequence. Record real people using the running agent for at least 60 seconds. Do not stage usage or installs.

Project code is [MIT](LICENSE). The bundled official Agent Index client retains its Apache-2.0 license and NOTICE.
