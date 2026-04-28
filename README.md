# AgentGuard

Audit AI coding-agent configurations for security misconfigurations.

> Free, in-browser, zero data leaves your machine.

![AgentGuard screenshot placeholder](./public/og-image.png)

## What it detects

| Rule ID | Title | Severity |
|---|---|---|
| AGT-001 | Lethal Trifecta | Critical |
| AGT-002 | Hardcoded Secrets | Critical |
| AGT-003 | Untrusted MCP Server | Critical |
| AGT-004 | Auto-Run Without Sandbox | Critical |
| AGT-005 | Invisible Unicode in Instructions | Critical |
| AGT-006..AGT-022 | Additional filesystem, network, workflow, MCP, privacy misconfiguration checks | High/Medium/Low/Info |

## How it works

AgentGuard parses pasted/uploaded configuration text in the browser, normalizes content using zod + YAML/JSON parsing, and runs a deterministic rule engine. No backend, no API route, and no server-side data storage.

## Tech stack

- Next.js 15 + React 19 + TypeScript strict
- Tailwind CSS 4
- shadcn/ui primitives
- zod + yaml parsing
- Vitest + Testing Library

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## Deploy to Vercel

Push this repository to GitHub and import it in Vercel. The app is static-export capable (`output: 'export'`).

## Acknowledgments

- OWASP LLM Top 10 (2025)
- OWASP Top 10 for Agentic Applications (2026)
- Simon Willison's lethal trifecta (June 16, 2025)
- Agents Rule of Two (Nov 2025)
- CVE-2025-6514, CVE-2025-54135, CVE-2025-54136

## Responsible use

AgentGuard audits defensive misconfiguration patterns. Use only on configurations and systems you own or are authorized to assess.

## License

MIT (see `LICENSE`).
