import { DatabaseSync } from "node:sqlite";
import { mkdirSync, chmodSync } from "node:fs";
import { join } from "node:path";
import { randomUUID, createHash } from "node:crypto";
export const stamp = () => new Date().toISOString();
export const uid = (p) => `${p}_${randomUUID().slice(0, 12)}`;
export const hash = (s) => createHash("sha256").update(s).digest("hex");
export const actorKey = (a) => `${a.domain}:${a.id}`;
export function text(v, label, max = 6000) {
  if (typeof v !== "string" || !v.trim() || v.length > max)
    throw Error(`${label}: expected nonempty text, maximum ${max} characters`);
  return v;
}
export function slug(v) {
  if (typeof v !== "string" || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(v))
    throw Error("IDs must use lowercase letters, numbers, and hyphens");
  return v;
}
export function day(v) {
  if (
    typeof v !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(v) ||
    !Number.isFinite(Date.parse(v)) ||
    new Date(v).toISOString().slice(0, 10) !== v
  )
    throw Error("Expected valid YYYY-MM-DD date");
  return v;
}
function number(v, label) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0)
    throw Error(`${label}: expected nonnegative number`);
  return v;
}
const decode = (r) => (r ? JSON.parse(r.body) : null);
export class Store {
  constructor(dir) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(join(dir, "delivery.sqlite"));
    chmodSync(join(dir, "delivery.sqlite"), 0o600);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY,body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sources(id TEXT PRIMARY KEY,project TEXT NOT NULL,receipt TEXT UNIQUE NOT NULL,body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,project TEXT NOT NULL,at TEXT NOT NULL,body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS risks(id TEXT PRIMARY KEY,project TEXT NOT NULL,body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS questions(id TEXT PRIMARY KEY,project TEXT NOT NULL,body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS decisions(id TEXT PRIMARY KEY,project TEXT NOT NULL,body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS cursors(id TEXT PRIMARY KEY,body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS usage(run TEXT PRIMARY KEY,day TEXT NOT NULL,model TEXT NOT NULL,body TEXT NOT NULL);`);
  }
  close() {
    this.db.close();
  }
  tx(fn) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const r = fn();
      this.db.exec("COMMIT");
      return r;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  project(id) {
    const p = decode(
      this.db.prepare("SELECT body FROM projects WHERE id=?").get(id),
    );
    if (!p) throw Error(`Unknown project ${id}`);
    return p;
  }
  save(p) {
    this.db
      .prepare("UPDATE projects SET body=? WHERE id=?")
      .run(JSON.stringify(p), p.id);
  }
  rows(table, project) {
    if (
      !["sources", "events", "risks", "questions", "decisions"].includes(table)
    )
      throw Error("Invalid table");
    return this.db
      .prepare(`SELECT body FROM ${table} WHERE project=? ORDER BY rowid`)
      .all(project)
      .map(decode);
  }
  upsert(table, row) {
    if (!["risks", "questions", "decisions"].includes(table))
      throw Error("Invalid table");
    this.db
      .prepare(
        `INSERT INTO ${table} VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body`,
      )
      .run(row.id, row.project, JSON.stringify(row));
  }
  event(project, kind, actor, detail) {
    const e = { id: uid("event"), at: stamp(), kind, actor, ...detail };
    this.db
      .prepare("INSERT INTO events VALUES (?,?,?,?)")
      .run(e.id, project, e.at, JSON.stringify(e));
    return e;
  }
  create(i, actor, provenance) {
    slug(i.id);
    for (const f of ["name", "customerAlias", "outcome"]) text(i[f], f, 2000);
    day(i.deliveryDate);
    if (typeof i.sample !== "boolean")
      throw Error("Explicit sample flag required");
    if (!Array.isArray(i.owners) || i.owners.length < 1 || i.owners.length > 20)
      throw Error("Provide 1–20 owner aliases, including founder");
    const owners = i.owners.map((o) => ({
      id: slug(o.id),
      name: text(o.name, "owner name", 100),
      actor: o.id === "founder" ? actor : null,
    }));
    if (
      new Set(owners.map((o) => o.id)).size !== owners.length ||
      !owners.some((o) => o.id === "founder")
    )
      throw Error("Unique owner aliases must include founder");
    if (
      !Array.isArray(i.milestones) ||
      i.milestones.length < 1 ||
      i.milestones.length > 30
    )
      throw Error("Provide 1–30 milestones");
    const milestones = i.milestones.map((m) => {
      slug(m.id);
      text(m.name, "milestone name", 200);
      day(m.dueDate);
      if (m.owner !== null && !owners.some((o) => o.id === m.owner))
        throw Error("Unknown owner alias");
      return {
        id: m.id,
        name: m.name,
        owner: m.owner,
        dueDate: m.dueDate,
        targetDate: null,
        status: "unknown",
        completed: null,
        nextStep: null,
        blocker: null,
        blockerState: "unknown",
        helpNeeded: null,
        recoveryAction: null,
        recoveryDate: null,
        effortUsed: null,
        spent: null,
        revision: 1,
        rollovers: 0,
        lastUpdate: null,
        sources: {},
        conflict: null,
      };
    });
    if (new Set(milestones.map((m) => m.id)).size !== milestones.length)
      throw Error("Duplicate milestone id");
    const cadence = i.cadenceDays ?? 7;
    if (!Number.isInteger(cadence) || cadence < 1 || cadence > 30)
      throw Error("cadenceDays must be 1–30");
    const thresholds = {
      dueSoonDays: i.thresholds?.dueSoonDays ?? 3,
      rollovers: i.thresholds?.rollovers ?? 2,
      variancePercent: i.thresholds?.variancePercent ?? 15,
      unansweredDays: i.thresholds?.unansweredDays ?? 2,
    };
    for (const [k, v] of Object.entries(thresholds)) {
      number(v, k);
      if (v > 1000) throw Error("Threshold too large");
    }
    const baseline = i.baseline ?? {};
    if (baseline.effortHours !== undefined)
      number(baseline.effortHours, "effortHours");
    if (baseline.budget !== undefined) {
      number(baseline.budget, "budget");
      text(baseline.currency, "currency", 12);
    }
    if (!owners.some((o) => o.id === i.escalationContact))
      throw Error("Escalation contact must be an owner alias");
    const p = {
      id: i.id,
      name: i.name,
      customerAlias: i.customerAlias,
      outcome: i.outcome,
      deliveryDate: i.deliveryDate,
      sample: i.sample,
      owners,
      milestones,
      cadenceDays: cadence,
      thresholds,
      baseline,
      escalationContact: i.escalationContact,
      founder: actor,
      sessionKey: provenance.sessionKey,
      createdAt: stamp(),
    };
    return this.tx(() => {
      if (this.db.prepare("SELECT id FROM projects WHERE id=?").get(p.id))
        throw Error("Project already exists");
      this.db
        .prepare("INSERT INTO projects VALUES (?,?)")
        .run(p.id, JSON.stringify(p));
      this.event(p.id, "project_created", actor, {
        name: p.name,
        source: provenance.receipt,
      });
      return p;
    });
  }
  join(project, alias, actor) {
    return this.tx(() => {
      const p = this.project(project),
        owner = p.owners.find((o) => o.id === alias);
      if (!owner) throw Error("Unknown owner alias");
      if (owner.actor && actorKey(owner.actor) !== actorKey(actor))
        throw Error(
          "Owner alias already linked to another identity. Founder must correct the owner assignment.",
        );
      if (
        p.owners.some(
          (o) =>
            o.id !== alias && o.actor && actorKey(o.actor) === actorKey(actor),
        )
      )
        throw Error(
          "This identity is already linked to another alias; a second alias is not a second person",
        );
      owner.actor = actor;
      this.save(p);
      this.event(project, "owner_joined", actor, { owner: alias });
      return owner;
    });
  }
  owner(p, actor) {
    return p.owners.find(
      (o) => o.actor && actorKey(o.actor) === actorKey(actor),
    );
  }
  source(id) {
    const s = decode(
      this.db.prepare("SELECT body FROM sources WHERE id=?").get(id),
    );
    if (!s) throw Error("Unknown source");
    return s;
  }
  capture(project, milestone, raw, kind, actor, provenance) {
    text(raw, "update", 24000);
    return this.tx(() => {
      const p = this.project(project),
        m = p.milestones.find((m) => m.id === milestone),
        owner = this.owner(p, actor);
      if (!m) throw Error("Unknown milestone");
      if (!owner)
        throw Error(
          `Join an assigned owner alias first with DELIVERY JOIN ${project} <alias>`,
        );
      if (owner.id !== m.owner && owner.id !== "founder")
        throw Error(
          "Only the assigned owner or founder may update this milestone",
        );
      const existing = decode(
        this.db
          .prepare("SELECT body FROM sources WHERE receipt=?")
          .get(provenance.receipt),
      );
      if (existing) return existing;
      const s = {
        id: uid("source"),
        project,
        milestone,
        kind,
        raw,
        actor,
        owner: owner.id,
        provenance,
        sha256: hash(raw),
        at: stamp(),
        extracted: false,
      };
      this.db
        .prepare("INSERT INTO sources VALUES (?,?,?,?)")
        .run(s.id, project, provenance.receipt, JSON.stringify(s));
      this.event(project, "update_received", actor, {
        milestone,
        source: s.id,
        owner: owner.id,
      });
      return s;
    });
  }
  extract(sourceId, input, allowedSource) {
    if (sourceId !== allowedSource)
      throw Error("Can only extract the source admitted for this turn");
    const source = this.source(sourceId);
    if (source.extracted) return source.extraction;
    const fields = [
      "completed",
      "nextStep",
      "blocker",
      "helpNeeded",
      "recoveryAction",
    ];
    for (const f of fields) {
      if (
        input[f] !== null &&
        (typeof input[f] !== "string" ||
          !input[f].trim() ||
          !source.raw.includes(input[f]))
      )
        throw Error(`${f} must be null or an exact source span`);
    }
    for (const f of ["targetDate", "recoveryDate"])
      if (input[f] !== null) {
        day(input[f]);
        if (!source.raw.includes(input[f]))
          throw Error(
            `${f} must occur as YYYY-MM-DD in the source; ask the owner to clarify`,
          );
      }
    if (
      !["unknown", "not_started", "in_progress", "blocked", "done"].includes(
        input.status,
      )
    )
      throw Error("Invalid status");
    if (!["unknown", "open", "none"].includes(input.blockerState))
      throw Error("Invalid blocker state");
    if (
      input.status !== "unknown" &&
      (!input.statusEvidence || !source.raw.includes(input.statusEvidence))
    )
      throw Error("Status interpretation needs an exact supporting span");
    if (input.blockerState === "open" && !input.blocker)
      throw Error("Open blocker requires evidence");
    if (
      input.blockerState === "none" &&
      (!input.blockerEvidence || !source.raw.includes(input.blockerEvidence))
    )
      throw Error("Clearing a blocker needs an explicit source span");
    for (const [field, evidenceField, unit] of [
      ["effortUsed", "effortEvidence", "hours"],
      ["spent", "spentEvidence", null],
    ])
      if (input[field] !== null) {
        number(input[field], field);
        const q = input[evidenceField];
        if (
          !q ||
          !source.raw.includes(q) ||
          !new RegExp(
            `(^|[^0-9.])${String(input[field]).replace(".", "\\.")}([^0-9.]|$)`,
          ).test(q)
        )
          throw Error(`${field} requires matching numeric evidence`);
        if (unit && !/\bhours?\b/i.test(q))
          throw Error("Effort must be cumulative hours for this milestone");
        if (field === "spent") {
          const p = this.project(source.project);
          if (!p.baseline.currency || !q.includes(p.baseline.currency))
            throw Error("Spend needs the configured currency in its evidence");
        }
      }
    text(input.interpretation, "interpretation", 2000);
    return this.tx(() => {
      const p = this.project(source.project),
        m = p.milestones.find((m) => m.id === source.milestone);
      const prior = { ...m };
      if (input.status !== "unknown") {
        if (
          prior.status !== "unknown" &&
          prior.status !== input.status &&
          prior.lastActor &&
          actorKey(prior.lastActor) !== actorKey(source.actor) &&
          [prior.status, input.status].includes("done")
        )
          m.conflict = {
            reason: "Different contributors disagree about completion",
            sources: [prior.sources.status, source.id],
          };
        m.status = input.status;
        m.sources.status = source.id;
      }
      for (const f of [
        ...fields,
        "targetDate",
        "recoveryDate",
        "effortUsed",
        "spent",
      ])
        if (input[f] !== null) {
          if (f === "targetDate" && m.targetDate && input[f] > m.targetDate)
            m.rollovers++;
          m[f] = input[f];
          m.sources[f] = source.id;
        }
      if (input.blockerState !== "unknown") {
        m.blockerState = input.blockerState;
        m.sources.blocker = source.id;
        if (input.blockerState === "none") m.blocker = null;
      }
      m.lastUpdate = source.at;
      m.lastActor = source.actor;
      m.interpretation = input.interpretation;
      m.revision++;
      this.save(p);
      source.extracted = true;
      source.extraction = { ...input, sourceId };
      this.db
        .prepare("UPDATE sources SET body=? WHERE id=?")
        .run(JSON.stringify(source), source.id);
      for (const q of this.rows("questions", p.id).filter(
        (q) =>
          q.milestone === m.id &&
          q.owner === source.owner &&
          q.state === "open",
      )) {
        const answered =
          q.kind === "recovery"
            ? Boolean(input.recoveryAction && input.recoveryDate)
            : Boolean(
                input.completed &&
                  input.nextStep &&
                  input.targetDate &&
                  input.blockerState !== "unknown" &&
                  input.helpNeeded,
              );
        if (answered) {
          q.state = "answered";
          q.answerSource = source.id;
          q.answeredAt = stamp();
          this.upsert("questions", q);
        }
      }
      if (
        input.helpNeeded &&
        !/^(none|no help needed|no help|nothing)\.?$/i.test(
          input.helpNeeded.trim(),
        )
      ) {
        const decision = {
          id: `decision:${p.id}:${m.id}:${hash(input.helpNeeded).slice(0, 10)}`,
          project: p.id,
          milestone: m.id,
          owner: p.escalationContact,
          request: input.helpNeeded,
          source: source.id,
          state: "open",
          at: stamp(),
        };
        if (!this.rows("decisions", p.id).some((d) => d.id === decision.id))
          this.upsert("decisions", decision);
      }
      this.event(p.id, "update_extracted", source.actor, {
        milestone: m.id,
        source: source.id,
        revision: m.revision,
      });
      return { milestone: m, sourceId: source.id };
    });
  }
  correct(i, actor, provenance) {
    return this.tx(() => {
      const p = this.project(i.project),
        m = p.milestones.find((m) => m.id === i.milestone),
        o = this.owner(p, actor);
      if (!m || !o) throw Error("Unknown milestone or contributor");
      if (o.id !== "founder" && o.id !== m.owner)
        throw Error(
          "Only founder or assigned owner may correct this milestone",
        );
      if (i.expectedRevision !== m.revision)
        throw Error("Stale revision. Read the current record first.");
      text(i.reason, "correction reason", 4000);
      if (
        ![
          "dueDate",
          "targetDate",
          "owner",
          "status",
          "blocker",
          "recoveryDate",
        ].includes(i.field)
      )
        throw Error(
          "Correct dueDate, targetDate, owner, status, blocker, or recoveryDate",
        );
      if (["dueDate", "targetDate", "recoveryDate"].includes(i.field))
        day(i.value);
      if (i.field === "owner") {
        if (o.id !== "founder") throw Error("Founder must reassign owners");
        if (!p.owners.some((o) => o.id === i.value))
          throw Error("Unknown owner alias");
      }
      if (
        i.field === "status" &&
        !["unknown", "not_started", "in_progress", "blocked", "done"].includes(
          i.value,
        )
      )
        throw Error("Invalid status");
      if (i.field === "blocker" && i.value !== null)
        text(i.value, "blocker", 2000);
      const source = {
        id: uid("correction"),
        project: p.id,
        milestone: m.id,
        kind: "correction",
        raw: JSON.stringify(i),
        actor,
        owner: o.id,
        provenance,
        at: stamp(),
        sha256: hash(JSON.stringify(i)),
        extracted: true,
      };
      this.db
        .prepare("INSERT INTO sources VALUES (?,?,?,?)")
        .run(source.id, p.id, provenance.receipt, JSON.stringify(source));
      const before = m[i.field];
      m[i.field] = i.value;
      m.sources[i.field] = source.id;
      m.revision++;
      m.interpretation =
        "Prior interpretation withdrawn after correction. Assess the corrected record.";
      if (i.field === "status") m.conflict = null;
      if (i.field === "targetDate") m.rollovers = 0;
      if (i.field === "blocker")
        m.blockerState = i.value === null ? "none" : "open";
      if (i.field === "owner")
        for (const q of this.rows("questions", p.id).filter(
          (q) => q.milestone === m.id && q.state === "open",
        )) {
          q.state = "superseded";
          this.upsert("questions", q);
        }
      this.save(p);
      this.event(p.id, "fact_corrected", actor, {
        milestone: m.id,
        field: i.field,
        before,
        after: i.value,
        reason: i.reason,
        source: source.id,
        revision: m.revision,
      });
      return m;
    });
  }
  decide(i, actor, provenance) {
    return this.tx(() => {
      const p = this.project(i.project);
      if (actorKey(actor) !== actorKey(p.founder))
        throw Error("Founder must record decisions");
      const d = this.rows("decisions", p.id).find((d) => d.id === i.decisionId);
      if (!d) throw Error("Unknown decision");
      text(i.resolution, "resolution", 4000);
      d.state = "decided";
      d.resolution = i.resolution;
      d.decidedAt = stamp();
      d.decidedBy = actor;
      d.receipt = provenance.receipt;
      this.upsert("decisions", d);
      this.event(p.id, "decision_recorded", actor, {
        decision: d.id,
        resolution: i.resolution,
        source: provenance.receipt,
      });
      return d;
    });
  }
  record(id) {
    return {
      project: this.project(id),
      sources: this.rows("sources", id),
      events: this.rows("events", id),
      risks: this.rows("risks", id),
      questions: this.rows("questions", id),
      decisions: this.rows("decisions", id),
    };
  }
  projects() {
    return this.db
      .prepare("SELECT body FROM projects ORDER BY id")
      .all()
      .map(decode);
  }
  usage(e) {
    if (!e.usage) return;
    const c = {};
    for (const [k, v] of Object.entries({
      input: "input",
      output: "output",
      cache_read: "cacheRead",
      cache_write: "cacheWrite",
    })) {
      c[k] = e.usage[v] ?? 0;
      if (!Number.isSafeInteger(c[k]) || c[k] < 0)
        throw Error("Invalid provider usage");
    }
    if (!Object.values(c).some(Boolean)) return;
    this.db
      .prepare(
        "INSERT INTO usage VALUES (?,?,?,?) ON CONFLICT(run) DO UPDATE SET body=excluded.body",
      )
      .run(
        `${e.sessionId}:${e.runId}`,
        stamp().slice(0, 10),
        e.resolvedRef || `${e.provider}/${e.model}`,
        JSON.stringify(c),
      );
  }
}
