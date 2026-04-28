const links = [
  ['OWASP LLM Top 10 v2025', 'https://genai.owasp.org/'],
  ['OWASP Top 10 for Agentic Applications 2026', 'https://owasp.org/www-project-top-10-for-agentic-applications/'],
  ['Simon Willison lethal trifecta (June 16, 2025)', 'https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/'],
  ['Meta and OpenAI Agents Rule of Two (Nov 2025)', 'https://openai.com'],
  ['CVE-2025-6514', 'https://nvd.nist.gov/vuln/detail/CVE-2025-6514'],
  ['CVE-2025-54135', 'https://nvd.nist.gov/vuln/detail/CVE-2025-54135'],
  ['CVE-2025-54136', 'https://nvd.nist.gov/vuln/detail/CVE-2025-54136']
];
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

export default function About() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">About AgentGuard</h1>
      <p>Taxonomy attribution and responsible use references.</p>
      <ul className="list-disc pl-6">
        {links.map(([label, url]) => (
          <li key={url}>
            <a className="underline" href={url}>{label}</a>
          </li>
        ))}
      </ul>

      <h2 className="pt-4 text-2xl font-semibold">What AgentGuard Does NOT Cover</h2>
      <blockquote className="rounded-md border border-slate-700 bg-slate-900/60 p-4 text-sm leading-relaxed">
        AgentGuard is a static text-pattern auditor running entirely in your browser. It cannot detect prompt-injection payloads at runtime, verify that runtime enforcement actually matches config declarations, catch novel social-engineering payloads in plain language, inspect compiled binaries or remote MCP server behavior, or replace human review of agent rule files. Pair AgentGuard with runtime guardrails (NeMo Guardrails, Lakera Guard, Azure AI Content Safety), sandboxing, network policy enforcement, and red-teaming tools (Promptfoo, PyRIT, Garak) for complete defense in depth. Version pin lists require regular updates as new CVEs are published.
      </blockquote>
      <h2 className="pt-4 text-2xl font-semibold">Supported agents</h2>
      <ul className="list-disc pl-6">
        {agents.map(([a, c]) => (
          <li key={a}><strong>{a}:</strong> {c}</li>
        ))}
      </ul>
      <h2 className="pt-4 text-2xl font-semibold">Advanced detection categories</h2>
      <ul className="list-disc pl-6">
        <li>Trust-on-claim privilege escalation.</li>
        <li>Indirect prompt injection via documents and attachments.</li>
        <li>Business email compromise (BEC) and ACH update fraud patterns.</li>
        <li>Scheduled task abuse and permission persistence.</li>
        <li>Log-based data exfiltration channels.</li>
        <li>Cross-domain sensitive data aggregation risks.</li>
      </ul>
      <p className="pt-4 text-sm text-slate-500">
        AgentGuard is provided for informational and educational purposes only. It is not a substitute for professional security advice, auditing, or penetration testing. Results are not guaranteed to be complete, accurate, or exhaustive. The presence or absence of a finding does not constitute a warranty of security. By using AgentGuard you agree that the authors and contributors are not liable for any damages, losses, or security incidents arising from reliance on this tool. Use only on systems and configurations you own or are authorized to assess.
      </p>
    </main>
  );
}
