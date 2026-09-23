import { stamp, uid } from "./store.mjs";
const daysBetween = (a, b) => (Date.parse(a) - Date.parse(b)) / 86400000;
export function assess(store, projectId, at = new Date()) {
  const p = store.project(projectId),
    today = at.toISOString().slice(0, 10),
    concerns = [],
    missing = [];
  const add = (type, m, severity, reason, sources = []) =>
    concerns.push({
      id: `risk:${p.id}:${m?.id || "project"}:${type}`,
      project: p.id,
      milestone: m?.id || null,
      type,
      severity,
      reason,
      owner: m?.owner || p.escalationContact,
      sources: [...new Set(sources.filter(Boolean))],
      state: "open",
      recoveryAction: m?.recoveryAction || null,
      recoveryDate: m?.recoveryDate || null,
    });
  for (const m of p.milestones) {
    if (!m.owner)
      add("missing-owner", m, "amber", "No accountable owner is assigned.");
    else if (!p.owners.find((o) => o.id === m.owner)?.actor)
      missing.push(
        `${m.id}: owner ${m.owner} has not joined with a runtime identity.`,
      );
    if (m.status === "unknown") missing.push(`${m.id}: status is unknown.`);
    if (!m.lastUpdate) missing.push(`${m.id}: no update received.`);
    else if (
      daysBetween(today, m.lastUpdate.slice(0, 10)) >= p.cadenceDays &&
      m.status !== "done"
    )
      add(
        "stale-update",
        m,
        "amber",
        `No update within the ${p.cadenceDays}-day cadence.`,
        Object.values(m.sources),
      );
    if (m.status !== "done") {
      if (m.dueDate < today)
        add(
          "overdue",
          m,
          "red",
          `Baseline milestone date ${m.dueDate} has passed; current status is ${m.status}.`,
          [m.sources.dueDate, m.sources.status],
        );
      else if (m.targetDate && m.targetDate > m.dueDate)
        add(
          "threatened-date",
          m,
          "amber",
          `Owner target ${m.targetDate} is later than baseline ${m.dueDate}.`,
          [m.sources.targetDate],
        );
      if (m.blockerState === "open")
        add(
          "blocker",
          m,
          "amber",
          m.blocker || "Owner reports an unresolved blocker.",
          [m.sources.blocker],
        );
      if (m.rollovers >= p.thresholds.rollovers)
        add(
          "rollover",
          m,
          "amber",
          `Target moved later ${m.rollovers} times.`,
          [m.sources.targetDate],
        );
      if (
        m.recoveryAction &&
        m.recoveryDate &&
        m.recoveryDate < today &&
        m.blockerState === "open"
      )
        add(
          "recovery-overdue",
          m,
          "red",
          `Recovery target ${m.recoveryDate} has passed and the blocker remains open.`,
          [m.sources.recoveryAction, m.sources.recoveryDate, m.sources.blocker],
        );
      if (!m.targetDate) missing.push(`${m.id}: no current target date.`);
      if (m.blockerState === "unknown")
        missing.push(`${m.id}: blocker status has not been stated.`);
      if (!m.nextStep) missing.push(`${m.id}: next step is missing.`);
    }
    if (m.conflict)
      add(
        "conflicting-update",
        m,
        "red",
        m.conflict.reason,
        m.conflict.sources,
      );
  }
  if (p.deliveryDate < today && p.milestones.some((m) => m.status !== "done"))
    add(
      "delivery-overdue",
      null,
      "red",
      `Project delivery date ${p.deliveryDate} has passed with unfinished milestones.`,
    );
  for (const [baseline, actual, label] of [
    ["effortHours", "effortUsed", "effort hours"],
    ["budget", "spent", "budget"],
  ]) {
    if (p.baseline[baseline] === undefined) {
      missing.push(
        `No ${label} baseline supplied; variance is not calculated.`,
      );
      continue;
    }
    if (!p.milestones.every((m) => m[actual] !== null)) {
      missing.push(
        `Cumulative ${label} actuals are incomplete; variance is not calculated.`,
      );
      continue;
    }
    const total = p.milestones.reduce((n, m) => n + m[actual], 0),
      base = p.baseline[baseline];
    if (total > base * (1 + p.thresholds.variancePercent / 100))
      add(
        `${baseline}-variance`,
        null,
        "amber",
        `${label}: cumulative actual ${total} exceeds baseline ${base} by ${base === 0 ? "an amount above the zero baseline" : (((total - base) / base) * 100).toFixed(1) + "%"}.`,
        p.milestones.map((m) => m.sources[actual]),
      );
  }
  for (const q of store
    .rows("questions", p.id)
    .filter((q) => q.state === "open"))
    if (
      daysBetween(today, q.createdAt.slice(0, 10)) >=
      p.thresholds.unansweredDays
    )
      add(
        "unanswered-followup",
        p.milestones.find((m) => m.id === q.milestone),
        "amber",
        `${q.owner} has not answered question ${q.id} within ${p.thresholds.unansweredDays} day(s).`,
        q.sources,
      );
  const old = store.rows("risks", p.id),
    activeIds = new Set(concerns.map((r) => r.id));
  for (const r of concerns) {
    const previous = old.find((x) => x.id === r.id);
    r.firstSeen = previous?.firstSeen || stamp();
    r.assessedAt = at.toISOString();
    r.state = r.recoveryAction ? "mitigation_recorded" : "open";
    store.upsert("risks", r);
    if (!previous || previous.state === "resolved")
      store.event(
        p.id,
        "risk_opened",
        { id: "agent", domain: "system", verified: false },
        { risk: r.id, reason: r.reason, sources: r.sources },
      );
  }
  for (const r of old.filter(
    (r) => r.state !== "resolved" && !activeIds.has(r.id),
  )) {
    r.state = "resolved";
    r.resolvedAt = at.toISOString();
    store.upsert("risks", r);
    store.event(
      p.id,
      "risk_resolved",
      { id: "agent", domain: "system", verified: false },
      { risk: r.id },
    );
  }
  for (const q of store
    .rows("questions", p.id)
    .filter((q) => q.state === "open")) {
    const m = p.milestones.find((m) => m.id === q.milestone);
    if (
      m?.status === "done" ||
      (q.kind === "recovery" &&
        !concerns.some(
          (r) =>
            r.milestone === q.milestone &&
            [
              "blocker",
              "threatened-date",
              "overdue",
              "rollover",
              "recovery-overdue",
            ].includes(r.type),
        ))
    ) {
      q.state = "superseded";
      store.upsert("questions", q);
    }
  }
  const substantiveMissing = missing.filter(
    (x) => !x.startsWith("No ") || !x.includes("baseline"),
  );
  const health = concerns.some((r) => r.severity === "red")
    ? "red"
    : concerns.length
      ? "amber"
      : p.milestones.every((m) => m.status === "unknown")
        ? "unknown"
        : substantiveMissing.length
          ? "amber"
          : "green";
  return {
    project: p,
    health,
    concerns,
    missing,
    asOf: at.toISOString(),
    dueSoon: p.milestones.filter(
      (m) =>
        m.status !== "done" &&
        daysBetween(m.dueDate, today) <= p.thresholds.dueSoonDays,
    ),
  };
}
export function checkin(store, projectId, at = new Date()) {
  const a = assess(store, projectId, at),
    { project: p } = a,
    newQuestions = [];
  for (const m of p.milestones.filter((m) => m.status !== "done" && m.owner)) {
    const existing = store
      .rows("questions", p.id)
      .filter((q) => q.milestone === m.id && q.owner === m.owner);
    const risk = a.concerns.filter(
      (r) =>
        r.milestone === m.id &&
        [
          "blocker",
          "threatened-date",
          "overdue",
          "rollover",
          "recovery-overdue",
        ].includes(r.type),
    );
    let kind = null,
      question = null;
    if (risk.length && !(m.recoveryAction && m.recoveryDate)) {
      kind = "recovery";
      question = `${m.owner}: what specific recovery action will you take for ${m.name}, by what date (YYYY-MM-DD), and what decision or help do you need from the founder?`;
    } else if (
      !m.lastUpdate ||
      daysBetween(at.toISOString().slice(0, 10), m.lastUpdate.slice(0, 10)) >=
        p.cadenceDays
    ) {
      kind = "status";
      question = `${m.owner}: please update ${m.name}: completed work, next step, target date (YYYY-MM-DD), blockers or explicitly none, and help needed or explicitly none.`;
    } else if (
      !m.completed ||
      !m.nextStep ||
      !m.targetDate ||
      m.blockerState === "unknown" ||
      !m.helpNeeded
    ) {
      kind = "missing";
      const fields = [
        !m.completed ? "completed work" : null,
        !m.nextStep ? "next step" : null,
        !m.targetDate ? "target date (YYYY-MM-DD)" : null,
        m.blockerState === "unknown" ? "whether there are blockers" : null,
        !m.helpNeeded ? "help needed, or explicitly none" : null,
      ].filter(Boolean);
      question = `${m.owner}: for ${m.name}, please clarify ${fields.join(", ")}.`;
    }
    if (!kind || existing.some((q) => q.state === "open" && q.kind === kind))
      continue;
    const last = existing.filter((q) => q.kind === kind).at(-1);
    // A completed recovery plan is never repeatedly requested; due-date failure escalates instead.
    if (last?.state === "answered" && kind === "recovery") continue;
    const q = {
      id: uid("question"),
      project: p.id,
      milestone: m.id,
      owner: m.owner,
      kind,
      text: question,
      state: "open",
      createdAt: at.toISOString(),
      sources: risk.flatMap((r) => r.sources),
      sessionKey: p.sessionKey,
    };
    store.upsert("questions", q);
    store.event(
      p.id,
      "question_queued",
      { id: "agent", domain: "system", verified: false },
      { question: q.id, owner: q.owner, milestone: m.id, text: q.text },
    );
    newQuestions.push(q);
  }
  const unanswered = store
    .rows("questions", p.id)
    .filter(
      (q) =>
        q.state === "open" &&
        daysBetween(at.toISOString().slice(0, 10), q.createdAt.slice(0, 10)) >=
          p.thresholds.unansweredDays,
    );
  return {
    newQuestions,
    openQuestions: store
      .rows("questions", p.id)
      .filter((q) => q.state === "open"),
    escalations: [
      ...unanswered.map(
        (q) =>
          `${p.escalationContact}: ${q.owner} has not answered ${q.id}. Please intervene.`,
      ),
      ...a.concerns
        .filter((r) => r.severity === "red")
        .map((r) => `${p.escalationContact}: ${r.reason} [${r.id}]`),
    ],
    health: a.health,
    delivery:
      "Questions are queued for the shared OpenClaw conversation. The agent must include newQuestions in its reply. No external message was sent.",
  };
}
