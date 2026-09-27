import { mkdirSync, existsSync, writeFileSync, cpSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const state = join(root, ".local/delivery-openclaw"),
  workspace = join(root, ".local/delivery-workspace");
const flags = new Set(process.argv.slice(2));
const model = process.env.DELIVERY_MODEL;
const port = Number(process.env.DELIVERY_PORT || 19789);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error(
    "DELIVERY_PORT must be an available port from 1024 to 65535.",
  );
if (!model)
  throw new Error(
    "Set DELIVERY_MODEL to an available provider/model before setup.",
  );
mkdirSync(state, { recursive: true, mode: 0o700 });
if (existsSync(join(state, "openclaw.json")))
  throw new Error(
    "Isolated config already exists. Refusing to overwrite; edit it through scripts/openclaw config.",
  );
cpSync(join(root, "workspace"), workspace, { recursive: true });
const config = {
  gateway: {
    mode: "local",
    bind: "loopback",
    port,
    auth: {
      mode: "token",
      token: randomBytes(32).toString("hex"),
      allowTailscale: flags.has("--tailscale"),
    },
    tailscale: { mode: flags.has("--tailscale") ? "serve" : "off" },
  },
  agents: {
    defaults: {
      workspace,
      model: { primary: model },
      heartbeat: { every: "0m" },
      skipBootstrap: true,
    },
    entries: {
      "delivery-assurance-agent": {
        name: "Delivery Lens",
        workspace,
        skills: ["delivery-assurance"],
      },
    },
  },
  session: { dmScope: "per-channel-peer" },
  tools: {
    allow: [
      "delivery_record",
      "delivery_update",
      "delivery_brief",
      "delivery_checkin",
      "delivery_setup_card",
      "delivery_participant_card",
      "show_widget",
    ],
    deny: [
      "exec",
      "process",
      "read",
      "write",
      "edit",
      "apply_patch",
      "browser",
      "message",
      "sessions_spawn",
      "sessions_send",
      "web_fetch",
      "web_search",
    ],
  },
  browser: { enabled: false },
  plugins: {
    slots: { memory: "none" },
    allow: [
      "delivery-assurance-agent",
      ...(model.startsWith("openai/") ? ["codex"] : []),
    ],
    load: { paths: [join(root, "plugin")] },
    entries: {
      "delivery-assurance-agent": {
        enabled: true,
        hooks: { allowConversationAccess: true },
        config: {
          dataDir: join(root, ".local/delivery-data"),
          agentId: "delivery-assurance-agent",
          allowUnverifiedLocal: flags.has("--local-test"),
        },
      },
    },
  },
};
if (model.startsWith("openai/"))
  config.plugins.entries.codex = {
    enabled: true,
    config: {
      codexDynamicToolsLoading: "direct",
      sessionCatalog: { enabled: false },
      ...(flags.has("--reuse-codex-login")
        ? { appServer: { homeScope: "user" } }
        : {}),
    },
  };
writeFileSync(
  join(state, "openclaw.json"),
  JSON.stringify(config, null, 2) + "\n",
  { mode: 0o600 },
);
console.log(
  "Created isolated configuration at " + join(state, "openclaw.json"),
);
console.log(
  "No existing OpenClaw state was changed. Run scripts/openclaw config validate.",
);
if (flags.has("--reuse-codex-login"))
  console.log(
    "Native Codex account reuse explicitly enabled; this profile shares the trusted operator account.",
  );
if (flags.has("--local-test"))
  console.log(
    "Unverified local test attribution enabled. Disable it before the two-person demonstration.",
  );
