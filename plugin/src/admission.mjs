import { hash, actorKey } from "./store.mjs";
export function parseRequest(raw) {
  const json = /^DELIVERY (PROJECT|CORRECT|DECIDE)\s*\n([\s\S]+)$/.exec(
    raw.trim(),
  );
  if (json) {
    const payload = JSON.parse(json[2]);
    if (!payload || typeof payload !== "object" || Array.isArray(payload))
      throw Error("Payload must be a JSON object");
    return { action: json[1], payload };
  }
  const join = /^DELIVERY JOIN ([a-z0-9-]+) ([a-z0-9-]+)\s*$/.exec(raw.trim());
  if (join) return { action: "JOIN", project: join[1], owner: join[2] };
  const update =
    /^DELIVERY (UPDATE|RECOVERY) ([a-z0-9-]+) ([a-z0-9-]+)\s*\n([\s\S]+)$/.exec(
      raw.trim(),
    );
  if (update)
    return {
      action: update[1],
      project: update[2],
      milestone: update[3],
      raw: update[4],
    };
  const check = /^DELIVERY CHECKIN ([a-z0-9-]+)\s*$/.exec(raw.trim());
  if (check) return { action: "CHECKIN", project: check[1] };
  if (raw.trim() === "DELIVERY WHOAMI") return { action: "WHOAMI" };
  if (raw.trim() === "DELIVERY START") return { action: "START" };
  if (raw.trim() === "DELIVERY FORM") return { action: "START" };
  const participants = /^DELIVERY PARTICIPANTS ([a-z0-9-]+)\s*$/.exec(raw.trim());
  if (participants) return { action: "START", project: participants[1] };
  if (raw.trim().startsWith("DELIVERY "))
    throw Error(
      "Invalid DELIVERY header. See quick start for the supported commands.",
    );
  return null;
}
export function identity(context, hook, allowLocal = false) {
  const sender = context.requesterSenderId || hook.senderId;
  const domain =
    context.messageChannel || hook.channel || hook.messageProvider || "gateway";
  if (sender)
    return { id: String(sender), domain: String(domain), verified: true };
  if (allowLocal)
    return { id: "local-test", domain: "unverified", verified: false };
  throw Error(
    "No runtime sender identity. Use per-person sign-in through the shared Control UI. Local test mode is not multiplayer.",
  );
}
export function prepare(event, context) {
  const raw = event.currentUserMessage;
  const a = {
    context,
    raw,
    receipt: `${context.sessionId || context.sessionKey}:${event.currentUserMessageId || context.runId || hash(raw || "")}`,
  };
  if (typeof raw !== "string") {
    a.error = "Host did not supply currentUserMessage; write admission refused";
    return a;
  }
  try {
    a.request = parseRequest(raw);
  } catch (e) {
    a.error = e.message;
  }
  return a;
}
export function admit(store, a, context, allowLocal) {
  if (a.result) return a.result;
  if (a.error) throw Error(a.error);
  let request = a.request;
  // A read-only turn need not establish a human identity. Writes always do.
  let actor;
  try {
    actor = a.profileActor || identity(context, a.context, allowLocal);
  } catch (e) {
    if (request && !["CHECKIN", "WHOAMI", "START"].includes(request.action)) throw e;
  }
  const provenance = {
    receipt: a.receipt,
    sessionKey: context.sessionKey || a.context.sessionKey,
    sessionId: context.sessionId || a.context.sessionId,
    kind: actor?.verified ? "runtime-inbound" : "unverified-local",
  };
  if (
    !request &&
    actor &&
    a.raw &&
    !/\b(brief|summary|report|record|status|whoami|what|show|list|help|explain|draft)\b/i.test(
      a.raw,
    )
  ) {
    const matches = store.projects().flatMap((p) => {
      const owner = store.owner(p, actor);
      return owner && p.sessionKey === provenance.sessionKey
        ? store
            .rows("questions", p.id)
            .filter((q) => q.state === "open" && q.owner === owner.id)
            .map((q) => ({ p, q }))
        : [];
    });
    const targets = [
      ...new Set(matches.map((x) => `${x.p.id}/${x.q.milestone}`)),
    ];
    if (targets.length === 1) {
      const { p, q } = matches[0];
      request = {
        action: q.kind === "recovery" ? "RECOVERY" : "UPDATE",
        project: p.id,
        milestone: q.milestone,
        raw: a.raw,
      };
    }
  }
  if (!request) return { actor: actor || null };
  if (
    ["PROJECT", "JOIN", "CORRECT", "DECIDE", "UPDATE", "RECOVERY"].includes(
      request.action,
    ) &&
    !actor
  )
    throw Error("Authenticated contributor identity is required");
  let result = { actor: actor || null };
  if (request.action === "START") result.onboardingRequested = true;
  if (request.action === "WHOAMI")
    result.identity = actor || {
      verified: false,
      reason: "No sender identity supplied by this runtime",
    };
  if (request.action === "PROJECT")
    result.project = store.create(request.payload, actor, provenance);
  if (request.action === "JOIN")
    result.owner = store.join(request.project, request.owner, actor);
  if (request.action === "UPDATE" || request.action === "RECOVERY")
    result.source = store.capture(
      request.project,
      request.milestone,
      request.raw,
      request.action.toLowerCase(),
      actor,
      provenance,
    );
  if (request.action === "CORRECT")
    result.correction = store.correct(request.payload, actor, provenance);
  if (request.action === "DECIDE")
    result.decision = store.decide(request.payload, actor, provenance);
  if (request.action === "CHECKIN") result.checkinProject = request.project;
  result.projectId =
    request.project || request.payload?.project || result.project?.id;
  a.result = result;
  return result;
}

export function profileFromCurrentMessage(history, runId) {
  if (!runId) return null;
  const message = history.messages?.find(
    (m) => m.role === "user" && m.idempotencyKey === `${runId}:user`,
  );
  const sender = message?.__openclaw?.senderIdentity;
  return sender?.type === "profile" && typeof sender.id === "string"
    ? { id: sender.id, domain: "gateway-profile", verified: true }
    : null;
}
