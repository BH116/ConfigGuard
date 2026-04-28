# AgentGuard

## Project overview
AgentGuard is a Next.js 15 static web app that audits AI coding-agent configuration files entirely client-side in the browser. It detects dangerous misconfigurations, explains risk, and suggests hardening steps. There is no backend service.

## Setup commands
- `pnpm install --frozen-lockfile`
- `pnpm dev` (http://localhost:3000)
- `pnpm build`
- `pnpm start`

## Build / test / lint (run before declaring a task done)
- `pnpm typecheck` (must pass with 0 errors)
- `pnpm lint`
- `pnpm test --run`
- `pnpm build`

## Project structure
- Parsers live under `lib/parsers/`.
- Rules live under `lib/rules/`.
- UI components live under `components/`.
- Fixtures live under `lib/fixtures/`.
- Each parser exports a typed AST; each rule consumes the AST and returns `Finding[]`.

## Conventions
- Server Components by default, add `"use client"` only for state/effects.
- Tailwind only (no inline styles, no CSS modules).
- `components/ui/` primitives are auto-generated; do not hand-edit.
- Validate parser inputs with zod.
- PascalCase for components, camelCase for utilities, and `<file>.test.ts` for tests.

## PR conventions
- Branch: `codex/<short-slug>`.
- PR title: `[area] <imperative summary>`.
- PR body: what changed, why, and test evidence.

<<<<<<< ours
## Boundaries — NEVER
=======
## Boundaries NEVER
>>>>>>> theirs
- **NEVER** commit `.env*` or hardcoded secrets.
- **NEVER** edit `components/ui/*` by hand.
- **NEVER** add a runtime dep without justifying it in the PR description.
- **NEVER** store fixture secret-shaped values that could pass as real credentials.

## Definition of done
- All four verification commands pass with 0 errors.
- New behavior covered by tests.
- Diff confined to files needed for the task.
