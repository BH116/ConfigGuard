import { Auditor } from '@/components/auditor';
import { ResponsibleUseFooter } from '@/components/responsible-use-footer';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl space-y-10 p-6">
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 140" fill="none" className="h-12 w-auto">
            <g transform="translate(10,10)">
              <path d="M 30 18 L 18 18 L 18 70 L 60 102 L 102 70 L 102 18 L 90 18" stroke="currentColor" strokeWidth="13.2" strokeLinejoin="miter" strokeLinecap="butt" fill="none" />
              <path d="M 42 60 L 55 73 L 80 48" stroke="#1f9d6b" strokeWidth="12.5" strokeLinejoin="miter" strokeLinecap="butt" fill="none" />
            </g>
            <g transform="translate(160,0)" fontFamily="'Inter Tight', Inter, system-ui, sans-serif" fontWeight="600" fontSize="76" letterSpacing="-2.66" dominantBaseline="middle">
              <text x="0" y="76" fill="currentColor">Agent</text>
              <text x="200" y="76" fill="#1f9d6b">Guard</text>
            </g>
          </svg>
          <ThemeToggle />
        </div>
        <p className="text-lg">Audit your AI coding agent setup before it ships.</p>
        <p>Built for OpenAI Codex and AGENTS.md. Works with Cursor, GitHub Copilot, Aider, Continue, Windsurf, Gemini CLI, Claude Code, and any MCP config.</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            OpenAI Codex + AGENTS.md
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            OWASP LLM Top 10
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Lethal Trifecta detection
          </span>
        </div>
        <a
          href="#auditor"
          className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 active:bg-emerald-700 cursor-pointer inline-block"
        >
          Audit a config →
        </a>
      </header>
      <Auditor />
      <footer className="space-y-2 border-t pt-4 text-sm">
        <p>Built by Braxton Hibbs with OpenAI Codex Web for the Handshake and OpenAI Codex Creator Challenge.</p>
        <p><a className="underline" href="/about">About</a> · <a className="underline" href="https://github.com">GitHub</a></p>
        <ResponsibleUseFooter />
        <p>AgentGuard is provided for informational purposes only. Results are not a guarantee of security. Use at your own risk.</p>
      </footer>
    </main>
  );
}
