# AgentGuard

AgentGuard is built for OpenAI Codex and the AGENTS.md workflow, and it also audits other AI coding-agent configurations before they ship.

> Screenshot placeholder: AgentGuard auditing a Codex AGENTS.md config locally in the browser.

![AgentGuard screenshot placeholder](./public/og-image.png)

## Supported agents

Codex, Cursor, GitHub Copilot, Aider, Continue, Windsurf, Gemini CLI, Claude Code, plus generic MCP configuration files.

## What it detects

AgentGuard uses a deterministic client-side rule engine with 132 detection rules mapped to OWASP, NIST, and CVE references. Codex and AGENTS.md are first-class inputs, with the same defensive checks applied to all supported agents. It also detects high-risk misconfigurations described in natural-language prose (for example AGENTS.md policy text), not only structured key-value settings.

AgentGuard now detects sophisticated attack patterns including business email compromise, document prompt injection, cross-domain data aggregation, scheduled task privilege persistence, log-based exfiltration channels, and multi-tool attack chains (for example impersonation + credential reset + external send pipelines).

| Rule ID | Title | Severity |
|---|---|---|
| AGT-001..AGT-132 | Full catalog across trifecta, secrets, MCP, permissions, network, workflow, authorization, rate limiting, audit, data privacy, prompt injection, tool poisoning, memory, multi-agent, sandbox, supply chain, output handling, governance, CVE-specific checks, advanced natural-language detections, and multi-tool combo-chain checks | Critical, High, Medium, Low, Info |

Full canonical metadata is defined in `lib/rules/catalog.ts`.

## How it works

AgentGuard parses pasted or uploaded configuration text in the browser, normalizes content using zod plus YAML and JSON parsing, and runs a deterministic rule engine. No backend, no API route, and no server-side data storage.

## Tech stack

- Next.js 15 + React 19 + TypeScript strict
- Tailwind CSS 4
- shadcn/ui primitives
- zod + yaml parsing
- Vitest + Testing Library

## Run locally

```bash
pnpm install
pnpm dev
```

## Deploy to Vercel

Push this repository to GitHub and import it in Vercel. The app is static-export capable (`output: 'export'`).

## Acknowledgments

- OWASP LLM Top 10 (2025)
- OWASP Top 10 for Agentic Applications (2026)
- Simon Willison lethal trifecta (June 16, 2025)
- Agents Rule of Two (Nov 2025)
- CVE-2025-6514, CVE-2025-54135, CVE-2025-54136

## Responsible use

AgentGuard audits defensive misconfiguration patterns. Use only on configurations and systems you own or are authorized to assess.

## License

MIT (see `LICENSE`).
