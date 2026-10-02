# /git-split-commits - Split Uncommitted Changes into N Meaningful Commits

## Purpose
When you have implementation work ready to commit, use this pattern to split logical changes into N separate, meaningful commits rather than one large commit. This helps with code review, history navigation, and project maintainability.

## Syntax
/git-split-commits <number-of-commits> "<optional-message-prefix>"

## How It Works (When Implemented)
When you invoke `/git-split-commits 4` (for example), the process should:

1. **Analyze uncommitted changes** via `git diff --stat` and `git diff --name-only`
2. **Group related files** by logical feature/module based on:
   - Directory structure (e.g., all `backend/src/costing/*` = one commit)
   - Import/dependency relationships
   - File naming conventions
   - Content analysis (if enabled)
3. **Create N commits** with meaningful messages following Conventional Commits format:
   - `feat: ...` for new features
   - `fix: ...` for bug fixes
   - `refactor: ...` for code restructuring
   - `docs: ...` for documentation changes
   - `test: ...` for test additions
   - `chore: ...` for maintenance
4. **Prompt for confirmation** before each commit
5. **Push to GitHub** after all commits are complete (optional, requires permissions)

## Example Usage

### Example 1: Basic Split
/git-split-commits 3
Would analyze all uncommitted changes and create 3 logical commits.

### Example 2: With Prefix
/git-split-commits 4 "costing module"
Would create 4 commits all prefixed/theme around the costing module.

### Example 3: During Implementation Workflow
After completing a feature:
1. Work on costing calculations for S/M/L sizes
2. `/git-split-commits 2 "Add size-specific costing calculations"`
   - Commit 1: Size quantity validation
   - Commit 2: Per-size cost calculation engine

## Recommended Commit Grouping Strategy

Based on the H&K Clothing implementation plan, commits should logically group by:

### By Feature Area:
1. **Costing Engine** - All calculation logic, formulas, size-specific costing
2. **Data Models** - Prisma schemas, entity relationships, database changes
3. **UI Components** - React components, forms, wizard steps
4. **API Endpoints** - Routes, validation, request/response handling
5. **Authentication** - User management, JWT, permissions
6. **Order Workflow** - Status tasks, lifecycle transitions

### By Implementation Phase (from the plan):
1. Phase 0: Project Setup & Authentication
2. Phase 1: Costing Module Core
3. Phase 2: Order Management
4. Phase 3: Status Follow-Up Module
5. Phase 4: Order History & Reporting
6. Phase 5: Mobile Application
7. Phase 6: Security & Performance
8. Phase 7: Testing & QA

## Manual Execution Guide (Until Skill Automation)

Until the `/git-split-commits` automation is fully implemented, follow this pattern:

### Step 1: Check What Changed
```bash
git diff --stat
git diff --name-only

Step 2: Stage Files Interactively for First Commit

git add -p  # Review each hunk and select for commit 1 only

Step 3: Create First Commit

git commit -m "feat: add costing calculation engine
- Implement per-size weight calculation
- Add fabric-to-component mapping
- Support dynamic fabric entries"

Step 4: Stage Remaining Files for Next Commit

git add -p  # Select different hunks for commit 2

Step 5: Create Second Commit

git commit -m "feat: add size-specific measurements
- Support different measurements per size (S, M, L, XL, XXL, XXXL)
- Store measurements per size in CostingRecord
- Backend validation for size-specific entries"

Step 6: Continue Until Complete

Repeat steps 3-4 until all changes are committed.

Step 7: Push to GitHub

git push origin main