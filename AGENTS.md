# Agent Standards

## Git Commit Standards

### Git Commit Strategy
When preparing git commits, adhere to a **micro-commit** philosophy. Do not create monolithic commits.

### Git Branching Strategy
**⚠️ MANDATORY - NEVER COMMIT TO DEFAULT BRANCH ⚠️**

- **ALWAYS create a new branch** for any changes. Never commit directly to the main branch.
- Each branch must contain only commits relevant to the specific change being made
- Avoid mixing unrelated changes in a single branch
- Branch names must accurately describe the character of the committed changes

**Branch Naming**
Use descriptive branch names with the following format:
- `feat/<short-description>` - for new features
- `fix/<short-description>` - for bug fixes
- `docs/<short-description>` - for documentation
- `refactor/<short-description>` - for refactoring

**Example:** `feat/add-periods-query-endpoint`

---

### Commit and Pull Request Workflow
1. Create a new branch from the default branch
2. Make commits to the feature branch
3. Push the branch and **create a pull request** before requesting review or merge
4. Never push directly to the default branch

**This ensures proper review, CI validation, and change isolation.**

### Commit Message Structure
All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types:
- `feat:` - new feature (triggers minor version bump)
- `fix:` - bug fix (triggers patch version bump)
- `BREAKING CHANGE:` or `!` suffix - breaking change (triggers major version bump)
- `docs:`, `test:`, `refactor:`, `chore:` - other changes (no version bump)

**Example:** `feat: add periods query API endpoint`

**Note:** The `release-please-action` uses these commit messages to automatically determine version bumps. Do NOT add custom tags like `(#minor)`.

---

## Agent Workflow Standards

### 1. Execution Protocol
To ensure accuracy and user control, follow a sequential execution model:
- **One Action at a Time:** Do not attempt to multitask. Execute exactly one discrete task per turn.
- **Forward Planning:** At the end of every response, explicitly state the next step you intend to take.
- **Consent:** Wait for user confirmation before proceeding to the next step if the action involves complex logic.

### 2. File Modification Standards
Before applying changes to any existing file, provide a brief summary using the following format:
- **Target File:** [Path to file]
- **Change Summary:** [Brief description of the logic being updated]
- **Rationale:** [Technical reason why this change is necessary]

### 3. Commit and Push Confirmation
**⚠️ MANDATORY - NEVER SKIP THIS STEP ⚠️**

- **ALWAYS ask for confirmation before committing.** This is non-negotiable. Present the user with:
  - Files that will be committed
  - The proposed commit message
  - Diff summary (optional)
- **ALWAYS ask for confirmation before pushing.** This is non-negotiable. Never push without explicit user approval.
- **Never force push** unless explicitly requested by the user.
- **Never commit secrets, credentials, or tokens** to the repository.

**Failure to follow this rule will result in immediate task termination.**

### 4. File Deletion Confirmation
**⚠️ MANDATORY - ALWAYS ASK BEFORE DELETING ⚠️**

- **NEVER delete files without explicit user permission.** This applies to all file deletion operations, including:
  - Removing project files
  - Deleting configuration files
  - Cleaning up build artifacts
  - Any other destructive file operations
- When deletion is necessary, clearly explain:
  - What file(s) will be deleted
  - Why deletion is required
  - Any potential impacts
- Await user confirmation before executing any delete operation

**Violation of this rule will result in immediate task termination.**

---

## Common Agent Standards

### Current Date Awareness
- **Always check the current date** before performing time-sensitive tasks (e.g., searching for recent information, checking version updates, etc.)
- When asked about "latest", "recent", or time-sensitive information, verify the current date

### Context7 MCP Usage
- **Use Context7** (context7_resolve_library_id and context7_query_docs tools) when looking up documentation or library references
- If Context7 is available, prefer it over web search for technical documentation queries
- If Context7 is NOT available on session start, **suggest adding it** to the user

### Context7 MCP Configuration
If Context7 MCP is not configured, suggest adding this to your opencode.json or MCP configuration:

```json
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/github-mcp-server"
    }
  }
}
```

Or add via the CLI command:
```bash
opencode mcp add context7 https://mcp.context7.com/github-mcp-server
```
