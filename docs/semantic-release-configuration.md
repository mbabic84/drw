# Semantic Release Configuration Guide

This document captures the lessons learned and required configuration for setting up semantic-release with GitHub Actions, npm trusted publishing, and protected branches.

## Overview

The release workflow uses [semantic-release](https://semantic-release.gitbook.io/) to:
- Analyze conventional commits since last release
- Determine version bump (patch/minor/major)
- Update CHANGELOG.md and package.json
- Create git tags
- Publish to npm via OIDC trusted publishing
- Create GitHub releases with binary assets

## Key Lessons Learned

### 1. Repository URL Must Use SSH Format

**Problem:** `@semantic-release/git` reads the repository URL from `package.json`, not from git remote configuration.

**Wrong:**
```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/owner/repo.git"
}
```

**Correct:**
```json
"repository": {
  "type": "git",
  "url": "git@github.com:owner/repo.git"
}
```

### 2. SSH Deploy Key Format Must Be PEM

**Problem:** `webfactory/ssh-agent` action requires keys in PEM format. Ed25519 keys fail with "error in libcrypto".

**Solution:** Generate RSA key in PEM format:
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@github.com" -N "" -f deploy_key -m PEM
```

### 3. Branch Protection Requires Bypass Configuration

**Problem:** Semantic-release pushes version bumps directly to main, which violates branch protection rules.

**Solution:** Use deploy keys with bypass permissions:
1. Add deploy key to Settings → Security → Deploy keys (with write access)
2. Add `DEPLOY_KEY` secret with private key
3. Add "Deploy keys" to ruleset bypass list

### 4. semantic-release Skips Publishing on PR Events

**Problem:** semantic-release explicitly refuses to publish when triggered by pull_request events.

**Solution:** Use `push` trigger instead:
```yaml
on:
  push:
    branches:
      - main
```

### 5. Trusted Publisher Requires Correct Workflow Filename

**Problem:** OIDC token exchange fails if workflow filename doesn't match.

**Solution:** Ensure npm Trusted Publisher configuration matches the exact workflow filename (e.g., `release.yml`).

### 6. npm Requires Latest Version for Trusted Publishing

**Problem:** Trusted publishing requires npm CLI v11.5.1 or later.

**Solution:**
```yaml
- name: Install latest npm
  run: npm install -g npm@latest
```

## Configuration Files

### .releaserc

```json
{
  "branches": ["main"],
  "tagFormat": "v${version}",
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/exec",
      {
        "prepareCmd": "bun install && bun run build"
      }
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/github",
      {
        "assets": [
          {
            "path": "dist/drw",
            "label": "Binary"
          }
        ],
        "failComment": false,
        "successComment": false,
        "releasedLabels": false
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
}
```

### .github/workflows/release.yml

```yaml
name: Tests and Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  issues: write
  pull-requests: write
  id-token: write

jobs:
  test:
    uses: ./.github/workflows/test.reusable.yml

  release:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Setup SSH deploy key
        uses: webfactory/ssh-agent@v0.9.1
        with:
          ssh-private-key: ${{ secrets.DEPLOY_KEY }}

      - name: Add GitHub to known hosts
        run: ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "lts/*"

      - name: Install latest npm
        run: npm install -g npm@latest

      - name: Install dependencies
        run: bun install

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git remote set-url origin git@github.com:${{ github.repository }}.git

      - name: Verify SSH connection
        run: ssh -T git@github.com || true

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GIT_AUTHOR_NAME: github-actions[bot]
          GIT_AUTHOR_EMAIL: 41898282+github-actions[bot]@users.noreply.github.com
          GIT_COMMITTER_NAME: github-actions[bot]
          GIT_COMMITTER_EMAIL: 41898282+github-actions[bot]@users.noreply.github.com
        run: npx semantic-release
```

### package.json DevDependencies

```json
{
  "devDependencies": {
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/commit-analyzer": "^13.0.1",
    "@semantic-release/exec": "^7.1.0",
    "@semantic-release/git": "^10.0.1",
    "@semantic-release/github": "^12.0.6",
    "@semantic-release/npm": "^13.1.4",
    "@semantic-release/release-notes-generator": "^14.1.0",
    "semantic-release": "^25.0.3"
  }
}
```

## Setup Checklist

### 1. Generate Deploy Key

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@github.com" -N "" -f deploy_key -m PEM
```

This creates:
- `deploy_key` - private key (add to secrets)
- `deploy_key.pub` - public key (add to deploy keys)

### 2. GitHub Repository Configuration

**Deploy Keys:**
1. Settings → Security → Deploy keys
2. Add new key with:
   - Title: `github-actions`
   - Key: contents of `deploy_key.pub`
   - ✅ Allow write access

**Secrets:**
1. Settings → Secrets and variables → Actions
2. Add `DEPLOY_KEY` secret with contents of `deploy_key` (private key)

**Ruleset Bypass:**
1. Settings → Rules → Rulesets
2. Edit ruleset for `main` branch
3. Under "Bypass list", add "Deploy keys"

### 3. npm Trusted Publisher Configuration

1. Go to https://www.npmjs.com/package/YOUR-PACKAGE/settings
2. Under "Trusted Publisher", add GitHub Actions:
   - Repository: `owner/repo`
   - Workflow filename: `release.yml`
3. Recommended: Enable "Require two-factor authentication and disallow tokens"

### 4. Branch Protection

Ensure ruleset allows bypass for deploy keys:
- "Allow specified actors to bypass required pull requests" → add Deploy keys

## How It Works

1. **Trigger:** Push to `main` branch
2. **Test:** Run tests via reusable workflow
3. **Analyze:** semantic-release analyzes commits since last tag
4. **Version:** Determines bump based on conventional commits:
   - `fix:` → patch (0.0.x)
   - `feat:` → minor (0.x.0)
   - `BREAKING CHANGE:` → major (x.0.0)
5. **Prepare:**
   - Update CHANGELOG.md
   - Run build (`bun install && bun run build`)
   - Update package.json version
   - Commit changes via SSH deploy key
6. **Publish:**
   - Push commit and tag to main (bypasses branch protection)
   - Publish to npm via OIDC trusted publishing
   - Create GitHub release with binary asset

## Common Issues

### "Error loading key: error in libcrypto"

**Cause:** SSH key not in PEM format

**Solution:** Regenerate key with `-m PEM` flag:
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f deploy_key
```

### "Repository rule violations found"

**Cause:** Deploy key not in bypass list

**Solution:** Add "Deploy keys" to ruleset bypass list

### "OIDC token exchange error - package not found"

**Cause:** Trusted publisher workflow filename mismatch

**Solution:** Verify npm Trusted Publisher workflow filename matches actual filename

### "This run was triggered by a pull request"

**Cause:** semantic-release triggered on PR event

**Solution:** Use `push` trigger, not `pull_request`

### Git push uses HTTPS instead of SSH

**Cause:** package.json repository URL uses HTTPS format

**Solution:** Change to SSH format:
```json
"repository": {
  "url": "git@github.com:owner/repo.git"
}
```

## Plugin Order

The plugin order in `.releaserc` matters:

1. `@semantic-release/commit-analyzer` - analyze commits
2. `@semantic-release/release-notes-generator` - generate notes
3. `@semantic-release/changelog` - update CHANGELOG.md
4. `@semantic-release/exec` - run build
5. `@semantic-release/npm` - update package.json, publish
6. `@semantic-release/github` - create GitHub release
7. `@semantic-release/git` - commit and push changes

## References

- [semantic-release documentation](https://semantic-release.gitbook.io/)
- [webfactory/ssh-agent action](https://github.com/webfactory/ssh-agent)
- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)
- [GitHub Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [Conventional Commits](https://www.conventionalcommits.org/)
