# Publish the shared plugin release

Verified against the official [community plugin guide](https://docs.openclaw.ai/plugins/community), [publishing contract](https://docs.openclaw.ai/clawhub/publishing), and ClawHub CLI 0.23.3 help on September 26, 2026. ClawHub accepts executable plugin packages; a separate skill-only listing is not required for this combined package. New releases must pass registry review and verification before normal public installation.

## Prepare locally

Use a clean committed checkout and supported Node. Confirm your authenticated ClawHub owner handle before choosing the package scope; it need not match your GitHub username. Replace OWNER below with that actual handle.

```bash
export DELIVERY_PACKAGE_NAME='@OWNER/delivery-assurance-agent'
npm run package -- --release
```

The builder rejects uncommitted release builds, records the exact commit in `BUILD.json` and `package.json.gitHead`, and writes the artifact and staging paths to `.local/releases/latest.json`. It includes OpenClaw build and compatibility metadata. Review the package contents and checksum. No account credentials or live project records are included.

Get the official `clawhub` CLI from its documented source. The development check used a checkout-local CLI 0.23.3; no global installation was changed. Inspect `clawhub package publish --help` again before running these commands. Substitute the actual STAGE path and COMMIT from latest.json:

```bash
clawhub package validate 'STAGE' --openclaw-version 2026.9.5 --out .local/plugin-inspection
clawhub package publish 'STAGE' --family code-plugin \
  --name '@OWNER/delivery-assurance-agent' --owner OWNER \
  --display-name 'Delivery Assurance Agent' \
  --source-repo brianmcguire/openclaw-delivery-assurance-agent \
  --source-commit COMMIT --dry-run
```

The prepared stage combines `plugin/`, `workspace/`, and license/setup documentation. Do not specify `--source-path plugin`: that source folder alone lacks the bundled workspace and skill. A local inspector pass is not registry moderation or security approval.

## Account and publication

Sign in personally using `clawhub login`. Confirm owner rights and the exact scoped package name. After reviewing the dry-run result, run the same publish command without `--dry-run`, adding `--wait` to observe registry checks. Confirm the resulting release is publicly installable rather than merely uploaded or awaiting review.

Then test from a new isolated profile:

```bash
openclaw plugins install clawhub:@OWNER/delivery-assurance-agent
```

Follow [plugin configuration](plugin-install.md), configure your provider and identity-bearing shared access, and exercise the workflow. Record the real registry URL and published version. Do not call a local archive's provenance warning a trusted registry install.

Use [the proposal draft](../submission/openclaw-proposal.md) for a separate maintainer discussion. Publication does not submit a core PR or imply OpenClaw endorsement. Keep Agent Index reporting optional and separate.
