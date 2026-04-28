# AgentGuard

<<<<<<< ours
Audit AI coding-agent configurations for security misconfigurations.

> Free, in-browser, zero data leaves your machine.

![AgentGuard screenshot placeholder](./public/og-image.png)

## What it detects

=======
AgentGuard is built for OpenAI Codex and the AGENTS.md workflow, and it also audits other AI coding-agent configurations before they ship.

> Screenshot placeholder: AgentGuard auditing a Codex AGENTS.md config locally in the browser.

![AgentGuard screenshot placeholder](./public/og-image.png)

## Supported agents

Codex, Cursor, GitHub Copilot, Aider, Continue, Windsurf, Gemini CLI, Claude Code, plus generic MCP configuration files.

## What it detects

AgentGuard uses a deterministic client-side rule engine with 22 checks mapped to OWASP and CWE style references. Codex and AGENTS.md are first-class inputs, with the same defensive checks applied to all supported agents.

>>>>>>> theirs
| Rule ID | Title | Severity |
|---|---|---|
| AGT-001 | Lethal Trifecta | Critical |
| AGT-002 | Hardcoded Secrets | Critical |
| AGT-003 | Untrusted MCP Server | Critical |
| AGT-004 | Auto-Run Without Sandbox | Critical |
| AGT-005 | Invisible Unicode in Instructions | Critical |
<<<<<<< ours
| AGT-006..AGT-022 | Additional filesystem, network, workflow, MCP, privacy misconfiguration checks | High/Medium/Low/Info |

## How it works

AgentGuard parses pasted/uploaded configuration text in the browser, normalizes content using zod + YAML/JSON parsing, and runs a deterministic rule engine. No backend, no API route, and no server-side data storage.
=======
| AGT-006..AGT-022 | Filesystem, network, workflow, MCP, and privacy misconfiguration checks | High, Medium, Low, Info |

## How it works

AgentGuard parses pasted or uploaded configuration text in the browser, normalizes content using zod plus YAML and JSON parsing, and runs a deterministic rule engine. No backend, no API route, and no server-side data storage.
>>>>>>> theirs

## Tech stack

- Next.js 15 + React 19 + TypeScript strict
- Tailwind CSS 4
- shadcn/ui primitives
- zod + yaml parsing
- Vitest + Testing Library

## Run locally

```bash
<<<<<<< ours
pnpm install --frozen-lockfile
=======
pnpm install
>>>>>>> theirs
pnpm dev
```

## Deploy to Vercel

Push this repository to GitHub and import it in Vercel. The app is static-export capable (`output: 'export'`).

## Acknowledgments

- OWASP LLM Top 10 (2025)
- OWASP Top 10 for Agentic Applications (2026)
<<<<<<< ours
- Simon Willison's lethal trifecta (June 16, 2025)
=======
- Simon Willison lethal trifecta (June 16, 2025)
>>>>>>> theirs
- Agents Rule of Two (Nov 2025)
- CVE-2025-6514, CVE-2025-54135, CVE-2025-54136

## Responsible use

AgentGuard audits defensive misconfiguration patterns. Use only on configurations and systems you own or are authorized to assess.

## License

MIT (see `LICENSE`).
