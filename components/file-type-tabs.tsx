'use client';
import { FileType } from '@/lib/rules/types';

<<<<<<< ours
const types: FileType[] = ['auto', 'cursor', 'claude', 'agents-md', 'aider', 'mcp'];

export function FileTypeTabs({ value, onChange }: { value: FileType; onChange: (f: FileType) => void }) {
  return <div className="flex flex-wrap gap-2">{types.map((t) => <button className={`rounded border px-2 py-1 text-sm ${value===t ? 'bg-slate-200 dark:bg-slate-700' : ''}`} key={t} onClick={() => onChange(t)}>{t}</button>)}</div>;
=======
const types: FileType[] = ['auto', 'codex', 'cursor', 'copilot', 'aider', 'continue', 'windsurf', 'gemini', 'claude', 'mcp'];
const labels: Record<FileType, string> = {
  auto: 'Auto-detect',
  codex: 'Codex / AGENTS.md',
  cursor: 'Cursor',
  copilot: 'GitHub Copilot',
  aider: 'Aider',
  continue: 'Continue',
  windsurf: 'Windsurf',
  gemini: 'Gemini CLI',
  claude: 'Claude Code',
  mcp: 'Generic MCP'
};

export function FileTypeTabs({ value, onChange }: { value: FileType; onChange: (f: FileType) => void }) {
  return <div className="flex flex-wrap gap-2">{types.map((t) => <button className={`rounded border px-2 py-1 text-sm ${value===t ? 'bg-slate-200 dark:bg-slate-700' : ''}`} key={t} onClick={() => onChange(t)}>{labels[t]}</button>)}</div>;
>>>>>>> theirs
}
