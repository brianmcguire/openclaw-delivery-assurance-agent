# Submission checklist

Rules checked against the [official event](https://luma.com/zhkhsnpa), [Agent Index publishing page](https://aiworthusing.com/agent-index/publish), [official client](https://github.com/plow-pbc/agent-index-client), and [OpenClaw multi-user guidance](https://docs.openclaw.ai/concepts/multi-user) on September 25, 2026 Eastern time.

**Submission:** September 28, 2026, 11:59 p.m. Pacific. **Leaderboard snapshot:** September 30, 2026, 11:59 p.m. Pacific. The requested deadline, multiplayer, MIT, client, and 60+ second video requirements remained present when checked. The publishing guide additionally says prize qualification requires a verified entry. Ask organizers about any ambiguity before submission; the event page's travel language is internally inconsistent and is not a product requirement.

| Requirement | Current evidence / remaining action |
|---|---|
| OpenClaw 2.0 | Pinned OpenClaw 2026.9.5; actual Control UI/tool verification described in `docs/verification.md`. |
| Multiplayer and other people interact | Real founder and distinct verified project owner completed the live seven-step fictional pilot on September 27: enrollment, blocker, recovery, founder brief, correction and updated brief. See `docs/verification.md`. The organizer's September 27 verification reply says they tested the published BYO setup through its native Codex route and confirmed the project workflow. |
| Real startup role | Delivery lead for customer pilots/projects; owner collection, recovery, escalation and founder decisions. |
| Public open-source MIT repository | Published at [openclaw-delivery-assurance-agent](https://github.com/brianmcguire/openclaw-delivery-assurance-agent); GitHub recognizes MIT. Upstream client retains Apache-2.0 notices. |
| Agent Index listing | [Delivery Lens](https://aiworthusing.com/agent-index/delivery-assurance-agent) is publicly accessible and shows the organizer's Verified label. |
| Finished listing media and install link | On September 29, `plow-agents image set` accepted the [88-second video](https://youtu.be/yOk-3M2gTH0), three [authentic pilot screenshots](screenshots/README.md), and the [installation link](https://github.com/brianmcguire/openclaw-delivery-assurance-agent#installation). The public page rendered the video and screenshot thumbnails; the Index API returned all three image URLs. The captures predate the new agent icon. |
| Required client reports genuine usage | Official client first genuine report accepted September 27: HTTP 200, ok=true, three days / three rows. Dedicated Mac mini launchd job configured at 300 seconds; first automatic run accepted with HTTP 200 / ok=true. Host must be awake, online, and logged in. |
| 60+ second real demo video | [88-second Delivery Lens demo](https://youtu.be/yOk-3M2gTH0) uploaded unlisted. Actual two-person pilot captures with Cedar narration; labeled completed-pilot replay, not a live screen recording. The organizer verified the listing after the video was supplied; their reply did not separately discuss video format. |
| No artificial usage/spam | Reporter only reads genuine completed-run counters. No installs, people, messages or video fabricated. |
| Privacy and permissions | Public sample fictional; separate private state; six delivery tools plus the core widget renderer; no external-send capability. The three pilot captures were visually reviewed before publication for credentials, customer records, and network addresses. |
| Verified entry for prizes | Organizer replied on September 27: “Delivery Lens is now Verified”; they confirmed the BYO project workflow and separate-installer usage reporting. This is user-provided organizer correspondence, not an independent public-page check. |
| Final links and submission | Repository, video, screenshots, install link, and Index links are filled. Organizer verification is confirmed by their reply and the public page. No cloud image or one-click deployment is required for this accepted BYO release; one-click remains off by design. |

## Agent Index steps, in order

1. Install the official [plow-agents CLI](https://github.com/plow-pbc/plow-agents) and personally run `plow-agents login`.
2. Obtain the supported Plow token. The publish page shows the local login-token path while the client README specifies agent-scoped credentials; see the caveat in `docs/agent-index.md`. Never use a GitHub token as a substitute.
3. Inspect `python3 scripts/agent-index.py status` and `--preview`. Stop if stored registration is unreadable.
4. Run the `--register` command from `docs/agent-index.md` with the real public repo/install URL. Add the YouTube video ID later by rerunning it with the same slug.
5. Run registered `--dry-run`, then one genuine report. Check success and public Index state.
6. Start `scripts/report-usage.sh` under a supervisor for five-minute reports during real use. Keep its persistent identity directory.
7. Organizer verification was confirmed by their September 27 reply, and `links.json` is filled. Continue genuine use through the leaderboard snapshot; do not generate traffic for ranking.

Do not mark pending items complete based on this checklist alone.
