const links = [
  ['OWASP LLM Top 10 v2025','https://genai.owasp.org/'],
  ['OWASP Top 10 for Agentic Applications 2026','https://owasp.org/www-project-top-10-for-agentic-applications/'],
<<<<<<< ours
  ["Simon Willison's lethal trifecta (Jun 16, 2025)",'https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/'],
  ['Meta/OpenAI Agents Rule of Two (Nov 2025)','https://openai.com'],
=======
  ["Simon Willison lethal trifecta (June 16, 2025)",'https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/'],
  ['Meta and OpenAI Agents Rule of Two (Nov 2025)','https://openai.com'],
>>>>>>> theirs
  ['CVE-2025-6514','https://nvd.nist.gov/vuln/detail/CVE-2025-6514'],
  ['CVE-2025-54135','https://nvd.nist.gov/vuln/detail/CVE-2025-54135'],
  ['CVE-2025-54136','https://nvd.nist.gov/vuln/detail/CVE-2025-54136']
];
<<<<<<< ours
export default function About() { return <main className="mx-auto max-w-3xl space-y-4 p-6"><h1 className="text-3xl font-bold">About AgentGuard</h1><p>Taxonomy attribution and responsible use references.</p><ul className="list-disc pl-6">{links.map(([label,url])=><li key={url}><a className="underline" href={url}>{label}</a></li>)}</ul></main>; }
=======
const agents = [
  ['Codex', 'AGENTS.md, codex settings and MCP configs'],
  ['Cursor', '.cursorrules, .cursor/rules/*.mdc, .cursor/mcp.json'],
  ['GitHub Copilot', '.github/copilot-instructions.md, .vscode/settings.json, .github/instructions/*.instructions.md'],
  ['Aider', '.aider.conf.yml'],
  ['Continue', '~/.continue/config.json, .continuerc.json, config.yaml models and mcpServers'],
  ['Windsurf', '.windsurfrules, .windsurf/mcp.json, global_rules.md'],
  ['Gemini CLI', 'GEMINI.md, ~/.gemini/settings.json, .gemini/config.yaml'],
  ['Claude Code', '.claude/settings.json, CLAUDE.md, .mcp.json']
];
export default function About() { return <main className="mx-auto max-w-3xl space-y-4 p-6"><h1 className="text-3xl font-bold">About AgentGuard</h1><p>Taxonomy attribution and responsible use references.</p><ul className="list-disc pl-6">{links.map(([label,url])=><li key={url}><a className="underline" href={url}>{label}</a></li>)}</ul><h2 className="pt-4 text-2xl font-semibold">Supported agents</h2><ul className="list-disc pl-6">{agents.map(([a,c])=><li key={a}><strong>{a}:</strong> {c}</li>)}</ul></main>; }
>>>>>>> theirs
