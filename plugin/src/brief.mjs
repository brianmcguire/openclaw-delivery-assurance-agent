import { assess } from "./assessment.mjs";
import { actorKey } from "./store.mjs";
const clean = (v) => String(v ?? "unknown").replaceAll("\n", " ");
export function brief(store, projectId, actor, at = new Date()) {
  const a = assess(store, projectId, at),
    p = a.project,
    r = store.record(projectId),
    key = `brief:${projectId}:${actorKey(actor)}`;
  const cursor = store.db
    .prepare("SELECT body FROM cursors WHERE id=?")
    .get(key);
  const last = cursor ? JSON.parse(cursor.body).event : null;
  const start = last ? r.events.findIndex((e) => e.id === last) + 1 : 0,
    changes = r.events.slice(start);
  const lines = [
    `# ${p.name}: founder brief`,
    p.sample
      ? "**FICTIONAL SAMPLE PROJECT. No real customer or delivery commitment.**"
      : "Private project record for the trusted project team.",
    `Health: **${a.health.toUpperCase()}**. Assessed ${a.asOf}.`,
    `Customer alias: ${clean(p.customerAlias)}. Outcome: ${clean(p.outcome)}. Delivery date: ${p.deliveryDate}.`,
    "\n## Why this health",
    ...(a.concerns.length
      ? a.concerns.map(
          (c) =>
            `- ${c.reason} [${c.id}; ${c.sources.join(", ") || "project baseline"}]`,
        )
      : [
          a.health === "unknown"
            ? "- There is not enough reported progress to assess delivery."
            : "- No current rule-triggered delivery concern. Review the missing information below.",
        ]),
    "\n## What changed since your last brief",
  ];
  if (!changes.length) lines.push("No recorded changes.");
  for (const e of changes.slice(-20)) {
    if (e.kind === "fact_corrected")
      lines.push(
        `- Corrected ${e.milestone}.${e.field} to ${JSON.stringify(e.after)}. Reason: ${clean(e.reason)} [${e.source}]. Original retained in audit history.`,
      );
    else if (e.kind === "update_extracted")
      lines.push(
        `- ${e.milestone} updated to revision ${e.revision} [${e.source}].`,
      );
    else if (e.kind === "question_queued")
      lines.push(`- Asked ${e.owner} about ${e.milestone} [${e.question}].`);
    else if (e.kind === "risk_opened" || e.kind === "risk_resolved")
      lines.push(`- ${e.kind.replaceAll("_", " ")}: ${e.risk}.`);
    else if (e.kind === "decision_recorded")
      lines.push(
        `- Founder decision recorded: ${clean(e.resolution)} [${e.decision}].`,
      );
    else
      lines.push(
        `- ${e.kind.replaceAll("_", " ")}${e.milestone ? " for " + e.milestone : ""} [${e.source || e.id}].`,
      );
  }
  if (changes.length > 20)
    lines.push(
      `${changes.length - 20} older changes omitted here; the full event history is in delivery_record.`,
    );
  lines.push("\n## Milestones due soon or overdue");
  for (const m of a.dueSoon)
    lines.push(
      `- ${m.name} (${m.id}), owner ${m.owner || "UNASSIGNED"}, baseline ${m.dueDate}, latest target ${m.targetDate || "unknown"}, status ${m.status}, revision ${m.revision}. [${m.sources.targetDate || m.sources.status || "project baseline"}]`,
    );
  if (!a.dueSoon.length)
    lines.push("None within the configured due-soon window.");
  lines.push("\n## Top risks and issues");
  for (const c of a.concerns.sort(
    (x, y) => (x.severity === "red" ? -1 : 1) - (y.severity === "red" ? -1 : 1),
  ))
    lines.push(
      `- ${c.severity}: ${c.reason} Owner ${c.owner || "UNASSIGNED"}. ${c.state === "mitigation_recorded" ? "A recovery plan is recorded; resolution is not yet confirmed." : ""} [${c.id}; ${c.sources.join(", ") || "project baseline"}]`,
    );
  if (!a.concerns.length) lines.push("No active concerns.");
  lines.push("\n## Recovery actions and follow-up");
  for (const m of p.milestones.filter((m) => m.recoveryAction))
    lines.push(
      `- ${m.owner}: ${clean(m.recoveryAction)} by ${m.recoveryDate || "UNKNOWN DATE"}. [${m.sources.recoveryAction}]`,
    );
  for (const q of r.questions.filter((q) => q.state === "open"))
    lines.push(`- Awaiting ${q.owner}: ${clean(q.text)} [${q.id}]`);
  for (const q of r.questions.filter((q) => q.state === "answered"))
    lines.push(
      `- ${q.owner} answered ${q.kind} question ${q.id}. No repeat request. [${q.answerSource}]`,
    );
  if (!r.questions.length && !p.milestones.some((m) => m.recoveryAction))
    lines.push("No recovery actions or questions recorded yet.");
  lines.push("\n## Decisions needed from the founder");
  for (const d of r.decisions.filter((d) => d.state === "open"))
    lines.push(
      `- ${clean(d.request)} For ${d.milestone}; escalation contact ${d.owner}. [${d.id}; ${d.source}]`,
    );
  if (!r.decisions.some((d) => d.state === "open"))
    lines.push("No explicit decision request recorded.");
  for (const c of a.concerns.filter((c) => c.severity === "red"))
    lines.push(
      `- Intervention: agree an accountable recovery or scope decision for ${c.milestone || "the project"}. [${c.id}]`,
    );
  lines.push("\n## Missing information");
  lines.push(
    ...(a.missing.length
      ? a.missing.map((m) => "- " + m)
      : ["No critical field gaps detected by the current rules."]),
  );
  lines.push("\n## Current record and evidence");
  for (const m of p.milestones) {
    lines.push(
      `- ${m.id}: ${m.status}; owner ${m.owner || "unassigned"}; target ${m.targetDate || "unknown"}; blocker ${clean(m.blockerState === "none" ? "explicitly none" : m.blocker)}.`,
    );
    if (m.interpretation)
      lines.push(`  Agent interpretation: ${clean(m.interpretation)}`);
  }
  for (const s of r.sources)
    lines.push(
      `- ${s.id}: supplied by ${s.owner} (${s.actor.verified ? "runtime-attributed" : "UNVERIFIED LOCAL TEST"}), ${s.at}; ${s.kind}; session ${s.provenance.sessionKey || "unknown"}; receipt ${s.provenance.receipt}.`,
    );
  lines.push(
    "\nAll outreach and commitments require explicit founder authorization. This agent only replies inside the shared OpenClaw session.",
  );
  store.db
    .prepare(
      "INSERT INTO cursors VALUES (?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body",
    )
    .run(
      key,
      JSON.stringify({ event: r.events.at(-1)?.id || null, at: a.asOf }),
    );
  return lines.join("\n") + "\n";
}
