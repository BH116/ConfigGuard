# AGENTS.md

Agent configuration for contributors using AI coding agents on the ConfigGuard codebase.

## Project overview

ConfigGuard is a client-side AI agent configuration security scanner built with Next.js 16, React 19, TypeScript strict, Tailwind 4, zod, yaml, and Vitest. All scanning runs in the browser; there is no backend and no API route.

## Scope

Work only inside this repository checkout. Relevant directories: ./app, ./components, ./lib, ./tests, ./test.

The following are strictly off limits: .env files, secrets directories, .ssh, .aws, *.pem, and any credential material. None is needed for this project.

## Permitted commands

- Bash(pnpm install)
- Bash(pnpm test --run)
- Bash(pnpm exec tsc --noEmit)
- Bash(pnpm exec eslint .)
- Bash(pnpm build)
- Bash(pnpm build:lib)

No other shell commands are configured. No outbound network access is configured beyond package installation from the npm registry.

## Limits

- rate_limit: 60
- token_budget: 16000
- tool_timeout_sec: 120
- max_iterations: 25

## Conventions

- TypeScript strict mode stays enabled. Do not add ts-ignore comments.
- Every new detection rule needs: a catalog entry, a taxonomy mapping, a positive test, and a negative test.
- Remediation text starts with an imperative verb and contains forty or more words.
- Findings must carry a real evidence excerpt, never an empty string.
- sanitize_output: true. Render all finding text through React default escaping only.

## Oversight

requires_approval: true for any destructive action, including file deletion, dependency removal, force pushes, and changes to CI workflows. Commit only when the maintainer asks.
