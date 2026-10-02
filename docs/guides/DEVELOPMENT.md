# Development Guide

## Coding Standards

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add costing calculation engine
fix: correct GSM weight formula rounding
docs: update API endpoint documentation
test: add unit tests for auth controller
chore: update dependencies
refactor: extract price calculation to service
```

Use the split-commit script for multi-file commits:
```bash
node scripts/git-split-commits.js 3 "costing module"
node scripts/git-split-commits.js 2 --dry-run   # preview only
node scripts/git-split-commits.js 4 --push       # commit + push
```

### TypeScript
- Enable strict mode everywhere
- Use interfaces for API contracts (in `@hk-clothing/api-types`)
- Use Zod schemas for runtime validation (in `@hk-clothing/validation`)
- Avoid `any` — use `unknown` and narrow types

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Tests: `*.test.ts` / `*.spec.ts`
- Schemas: `*.schema.ts`

### Folder Conventions
```
controllers/  → Route handlers (thin — delegate to services)
services/     → Business logic
middleware/   → Express middleware
routes/       → Route definitions
utils/        → Pure utility functions
```

---

## Monorepo Packages

### `@hk-clothing/validation`
Shared Zod schemas for frontend + backend validation.
```typescript
import { registerSchema, loginSchema } from '@hk-clothing/validation';
```

### `@hk-clothing/api-types`
Shared TypeScript types for API contracts.
```typescript
import { UserDTO, ApiResponse, AuthResponse } from '@hk-clothing/api-types';
```

### `@hk-clothing/utils`
Shared utility functions (date formatting, etc.)

### `@hk-clothing/business-logic`
Shared business logic (costing formulas, order rules)

---

## Workflow

1. **Pick a task** from `docs/phase-tracking/PHASE_CHECKLIST.md`
2. **Implement** in the relevant workspace
3. **Test** locally (unit tests + manual verification)
4. **Commit** using split-commits script
5. **Push** to main branch
6. **Update** progress in `docs/phase-tracking/phase-N/PROGRESS.md`

---

## Testing Strategy

| Type | Tool | Location |
|------|------|----------|
| Unit tests | Jest | `*.test.ts` files |
| Integration | Supertest | `backend/tests/` |
| E2E (Web) | Cypress | `apps/web/cypress/` |
| E2E (Mobile) | Detox | `apps/mobile/e2e/` |

Run tests:
```bash
npm run test                 # all workspaces
cd backend && npm test       # backend only
```

---

*Last Updated: 2026-10-02*