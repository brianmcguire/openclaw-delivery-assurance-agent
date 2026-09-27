# Persistent reporting on macOS

The demo installation uses a dedicated user LaunchAgent named `studio.activa.delivery-lens.agent-index`. It runs `/usr/bin/python3 -u scripts/agent-index.py --agent delivery-assurance-agent` with an absolute script path, the installation as its working directory, `StartInterval: 300`, and `RunAtLoad: true`. It uses the existing report key under `.local/agent-index`; never duplicate or reset the install identity. No key belongs in the plist.

Logs are `.local/agent-index/logs/reporter.out.log` and `reporter.err.log`. The job runs a single report and exits; `state = not running` between reports is expected. Check `last exit code`, `runs`, and recent log responses. A failed request remains visible in the logs; the scheduler tries again at its next interval. No model turn is invoked.

```bash
launchctl print "gui/$(id -u)/studio.activa.delivery-lens.agent-index"
tail -n 10 .local/agent-index/logs/reporter.out.log
tail -n 10 .local/agent-index/logs/reporter.err.log
```

A user LaunchAgent resumes after the operator logs in. Keep the host awake and connected for five-minute reporting; sleep is not a guaranteed reporting cadence. Reboot recovery has not been tested. For another installation, configure its own supervisor and paths after explicitly registering with its own persistent identity.

To stop this reporter without changing the gateway or deleting credentials:

```bash
launchctl bootout "gui/$(id -u)/studio.activa.delivery-lens.agent-index"
```

To reload the existing saved job:

```bash
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/studio.activa.delivery-lens.agent-index.plist"
```
