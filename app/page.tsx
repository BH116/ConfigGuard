import { Auditor } from '@/components/auditor';
import { ResponsibleUseFooter } from '@/components/responsible-use-footer';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl space-y-10 p-6">
      <header className="space-y-4">
        <div className="flex justify-between"><h1 className="text-4xl font-bold">AgentGuard</h1><ThemeToggle /></div>
<<<<<<< ours
        <p className="text-lg">Audit AI coding-agent configurations for security misconfigurations.</p>
        <p>Free, in-browser, zero data leaves your machine.</p>
        <div className="flex gap-2 text-xs"><span className="rounded-full border px-3 py-1">OWASP LLM Top 10</span><span className="rounded-full border px-3 py-1">OWASP Agentic Top 10 (2026)</span><span className="rounded-full border px-3 py-1">Lethal Trifecta detection</span></div>
=======
        <p className="text-lg">Audit your AI coding agent setup before it ships.</p>
        <p>Built for OpenAI Codex and AGENTS.md. Works with Cursor, GitHub Copilot, Aider, Continue, Windsurf, Gemini CLI, Claude Code, and any MCP config.</p>
        <div className="flex gap-2 text-xs"><span className="rounded-full border px-3 py-1">OpenAI Codex + AGENTS.md</span><span className="rounded-full border px-3 py-1">OWASP LLM Top 10</span><span className="rounded-full border px-3 py-1">Lethal Trifecta detection</span></div>
>>>>>>> theirs
        <a href="#auditor" className="inline-block rounded bg-black px-4 py-2 text-white">Audit a config →</a>
      </header>
      <Auditor />
      <footer className="space-y-2 border-t pt-4 text-sm">
<<<<<<< ours
        <p>Built with OpenAI Codex Web for the Handshake × OpenAI Codex Creator Challenge.</p>
=======
        <p>Built with OpenAI Codex Web for the Handshake and OpenAI Codex Creator Challenge.</p>
>>>>>>> theirs
        <p><a className="underline" href="/about">About</a> · <a className="underline" href="https://github.com">GitHub</a></p>
        <ResponsibleUseFooter />
      </footer>
    </main>
  );
}
