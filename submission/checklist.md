# Submission checklist

Rules checked against the [official event](https://luma.com/zhkhsnpa), [Agent Index publishing page](https://aiworthusing.com/agent-index/publish), [official client](https://github.com/plow-pbc/agent-index-client), and [OpenClaw multi-user guidance](https://docs.openclaw.ai/concepts/multi-user) on September 25, 2026 Eastern time.

**Submission:** September 28, 2026, 11:59 p.m. Pacific. **Leaderboard snapshot:** September 30, 2026, 11:59 p.m. Pacific. The requested deadline, multiplayer, MIT, client, and 60+ second video requirements remained present when checked. The publishing guide additionally says prize qualification requires a verified entry. Ask organizers about any ambiguity before submission; the event page's travel language is internally inconsistent and is not a product requirement.

| Requirement | Current evidence / remaining action |
|---|---|
| OpenClaw 2.0 | Pinned OpenClaw 2026.9.5; actual Control UI/tool verification described in `docs/verification.md`. |
| Multiplayer and other people interact | Isolated Nexus gateway is healthy behind tailnet Serve; identity-aware proxy mode configured for one allowed login. Browser identity and a real second-person run remain unverified. Follow `demo-script.md`. |
| Real startup role | Delivery lead for customer pilots/projects; owner collection, recovery, escalation and founder decisions. |
| Public open-source MIT repository | Published at [openclaw-delivery-assurance-agent](https://github.com/brianmcguire/openclaw-delivery-assurance-agent); GitHub recognizes MIT. Upstream client retains Apache-2.0 notices. |
| Agent Index listing | Account credential and registration pending; exact command in `docs/agent-index.md`. |
| Required client reports genuine usage | Current unmodified official client pinned September 25, with an installation-scoped collector. Offline tests/preview do not establish server acceptance. Perform and verify live report. |
| 60+ second real demo video | 80–90 second shot list prepared. Two people must record real interactions and upload the actual video. |
| No artificial usage/spam | Reporter only reads genuine completed-run counters. No installs, people, messages or video fabricated. |
| Privacy and permissions | Public sample fictional; separate private state; four-tool allowlist; no external-send capability. Review package again before uploading evidence. |
| Verified entry for prizes | Complete organizer verification via the publishing page/community instructions after registration. |
| Final links and submission | Fill video/Index URLs; check all public links; submit before deadline. |

## Agent Index steps, in order

1. Install the official [plow-agents CLI](https://github.com/plow-pbc/plow-agents) and personally run `plow-agents login`.
2. Obtain the supported Plow token. The publish page shows the local login-token path while the client README specifies agent-scoped credentials; see the caveat in `docs/agent-index.md`. Never use a GitHub token as a substitute.
3. Inspect `python3 scripts/agent-index.py status` and `--preview`. Stop if stored registration is unreadable.
4. Run the `--register` command from `docs/agent-index.md` with the real public repo/install URL. Add the YouTube video ID later by rerunning it with the same slug.
5. Run registered `--dry-run`, then one genuine report. Check success and public Index state.
6. Start `scripts/report-usage.sh` under a supervisor for five-minute reports during real use. Keep its persistent identity directory.
7. Verify the entry with organizers, fill `links.json`, and complete the event submission. Continue genuine use through the leaderboard snapshot; do not generate traffic for ranking.

Do not mark pending items complete based on this checklist alone.
