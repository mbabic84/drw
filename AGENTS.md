# Agent Standards

## Git Commit Standards

### Git Commit Strategy
When preparing git commits, adhere to a **micro-commit** philosophy. Do not create monolithic commits.

### Git Branching Strategy
When making changes, always create a new branch rather than committing directly to the main branch. This ensures proper review and isolation of changes.

**Branch Requirements:**
- Each branch must contain only commits relevant to the specific change being made
- Avoid mixing unrelated changes in a single branch
- Branch names must accurately describe the character of the committed changes

### Branch Naming
Use descriptive branch names with the following format:
- `feat/<short-description>` - for new features
- `fix/<short-description>` - for bug fixes
- `docs/<short-description>` - for documentation
- `refactor/<short-description>` - for refactoring

**Example:** `feat/add-periods-query-endpoint`

---

### Commit Message Structure
All commit messages must be concise and follow this exact template:
`<type>: <short description> (<tag>)`

**Example:** `feat: add periods query API endpoint (#minor)`

### Commit Categorization
Use the following table to determine the correct prefix and tag:

| Change Category | Message Prefix | Required Tag |
| :--- | :--- | :--- |
| **New Features** | `feat:` | `#minor` |
| **Bug Fixes** | `fix:` | `#patch` |
| **Documentation** | `docs:` | `#patch` |
| **Tests/Config** | `test:` or `chore:` | `#patch` |
| **Refactoring** | `refactor:` | `#patch` |

---

**Constraint:** Do not combine multiple categories into one commit. If you fix a bug and add a feature, generate two separate commits.

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
