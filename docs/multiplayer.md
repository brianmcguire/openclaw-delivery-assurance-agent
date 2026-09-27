# Multiplayer setup and real-person test

Use one isolated gateway for one trusted team. Current [OpenClaw multi-user guidance](https://docs.openclaw.ai/concepts/multi-user) requires identity-bearing access to distinguish people. Sharing one token, changing a display name, using two tabs, or making two CLI session IDs is not a two-person test.

## Preferred path: shared Control UI through Tailscale Serve

1. Install and sign in to Tailscale on the gateway host and each person's device. Invite the second person to the intended tailnet using their own identity. Keep grants/ACLs restricted to the trusted pilot team. This repository does not change tailnet membership or ACLs for you.
2. Check `tailscale serve status` first. Do not replace an existing route. This install uses loopback port 19789 by default and optional OpenClaw-managed Serve. On a host with an existing HTTPS route, use a separate available Serve port with the identity-aware proxy configuration below, or deploy on a separate host.
3. For a fresh installation, add `--tailscale` to `scripts/install.sh`. For an existing isolated setup with a free Serve route:

   ```bash
   scripts/openclaw config set gateway.tailscale.mode serve
   scripts/openclaw config set gateway.auth.allowTailscale true
   scripts/openclaw config set plugins.entries.delivery-assurance-agent.config.allowUnverifiedLocal false
   scripts/openclaw config validate
   scripts/openclaw gateway run
   ```

4. Both people open `https://YOUR_HOST.YOUR_TAILNET.ts.net/`. OpenClaw-managed Serve verifies Tailscale identity. Use the actual URL shown by startup. Do not expose the token-authenticated loopback service to the public internet or turn on Funnel for this demo.
5. Select Delivery Lens and open the same Shared session. Confirm that the UI identifies each person differently. Send `DELIVERY WHOAMI` from each account and confirm two distinct runtime identities in the replies. If either is unverified, stop the multiplayer test and repair identity admission.
6. The founder creates the project. The owner sends `DELIVERY JOIN harbor-pilot pilot-lead`, then the supplied free-form update. Both should see the owner-specific recovery question. The owner sends the recovery reply. The founder asks for a brief. Follow [the recording script](../submission/demo-script.md).

Owner alias enrollment records the first runtime identity that claims the alias. Only admit trusted people and confirm the alias assignment together. The same identity cannot claim founder and pilot-lead to simulate a second person.

## Existing Tailscale Serve route on a shared host

When OpenClaw cannot own the host's HTTPS root route, a separate tailnet-only Serve route can proxy to this isolated loopback gateway. [OpenClaw's external Serve guidance](https://docs.openclaw.ai/gateway/tailscale#externally-managed-serve-and-funnel) treats this as generic proxy ingress; `allowTailscale` does not establish identity there. Use [trusted-proxy authentication](https://docs.openclaw.ai/gateway/trusted-proxy-auth) only when Tailscale Serve is the sole remote route to this listener and local processes on the host are trusted. Tailscale [strips incoming identity headers and supplies its own](https://tailscale.com/docs/features/tailscale-serve#identity-headers).

For this route, set `gateway.bind: "loopback"`, `gateway.trustedProxies: ["127.0.0.1"]`, and `gateway.auth.mode: "trusted-proxy"`. Configure `gateway.auth.trustedProxy.userHeader: "tailscale-user-login"`, `requiredHeaders: ["x-forwarded-proto", "x-forwarded-host"]`, `allowLoopback: true`, and `allowUsers` with the two real contributors' Tailscale logins. Keep a separate local password for internal CLI checks. Validate the isolated config and test each person's `DELIVERY WHOAMI` through the HTTPS route before recording. Do not enable Funnel or use a shared gateway token as evidence of distinct contributors. This option trusts other local processes on the gateway host; use a dedicated host if that trust assumption does not hold.

## Cadence

The project stores `cadenceDays`; the MVP's supplied automation helper schedules a weekly check-in. For another cadence, use the currently supported OpenClaw `cron add` flags and match the project's value.

After the shared session exists, find its session key with `scripts/openclaw sessions --json`. Schedule the weekly check-in there:

```bash
scripts/weekly-checkin.sh harbor-pilot 'agent:delivery-assurance-agent:main'
scripts/openclaw cron list
```

The exact session key may differ for a new conversation. The job is idempotently declared and has no external delivery destination. It runs the agent in the shared session to ask new owner questions and produce the founder brief. Shared-session output is not a push-notification guarantee. Team members must open the session; adding private channel reminders is outside this MVP.

## Limits and fallback

Tailscale is optional for installation but is the tested access path for this development environment. Another official identity-bearing reverse proxy or supported group channel can be used, with separate channel configuration and an attribution test. No Slack, Telegram, WhatsApp, email, or customer channel is bundled or silently configured.

If a real second person is unavailable, run the local checks and one-identity smoke test, then record the two-person result as pending. Do not substitute fictional identities, unit-test actors, or one operator driving two accounts for the required live human demonstration.

## Inline card sandbox behind a proxy

The project setup card uses OpenClaw's dedicated sandbox listener (gateway port plus one by default). It must have a different origin from the authenticated Control UI. For an externally managed HTTPS route, choose a separate unused port and proxy **only** the sandbox listener there. Inspect existing Serve routes first. Example for an isolated gateway on 19889:

```bash
tailscale serve --bg --https=8445 http://127.0.0.1:19890
```

In that isolated profile set `mcp.apps.sandboxOrigin` to `https://YOUR-TAILNET-HOST:8445`, validate configuration, and reload the gateway. Do not proxy the authenticated gateway to this origin or host private content there. This route hosts the sandbox shell; project writes still go through the authenticated chat. Direct local access needs both listener ports. See [official sandbox origin guidance](https://docs.openclaw.ai/cli/mcp/apps).
