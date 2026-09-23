import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import { profileFromCurrentMessage } from "./admission.mjs";
// Compatibility adapter for the pinned OpenClaw 2026.9.5 transcript schema.
// The public tool context exposes channel senders but not Control UI profiles.
// Never read session ownership, infer from names, scan other agents, or write host state.
export function currentProfile(agentDir, sessionId, runId) {
  if (!agentDir || !sessionId || !runId) return null;
  let db;
  try {
    db = new DatabaseSync(join(agentDir, "openclaw-agent.sqlite"), {
      readOnly: true,
    });
    const row = db
      .prepare(
        "SELECT event_json FROM transcript_events WHERE session_id=? AND json_extract(event_json,'$.message.idempotencyKey')=? ORDER BY seq DESC LIMIT 1",
      )
      .get(sessionId, `${runId}:user`);
    if (!row) return null;
    const event = JSON.parse(row.event_json);
    return profileFromCurrentMessage({ messages: [event.message] }, runId);
  } finally {
    db?.close();
  }
}
