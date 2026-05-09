'use client';
import { useState } from 'react';
import { parseConfig } from '@/lib/parsers';
import { runRules } from '@/lib/rules';
import { FileType, Finding } from '@/lib/rules/types';
import { FileTypeTabs } from './file-type-tabs';
import { FindingsList } from './findings-list';
import { lethalTrifectaCodexAgentsMd } from '@/lib/fixtures/lethal-trifecta-codex-agentsmd';
import { untrustedCodexMcp } from '@/lib/fixtures/untrusted-codex-mcp';
import { lethalTrifectaCursorRules } from '@/lib/fixtures/lethal-trifecta-cursorrules';
import { dangerousAider } from '@/lib/fixtures/dangerous-aider';
import { untrustedMcp } from '@/lib/fixtures/untrusted-mcp';
import { invisibleUnicodeCodexAgentsMd } from '@/lib/fixtures/invisible-unicode-codex-agentsmd';
import { goodBaselineCodex } from '@/lib/fixtures/good-baseline-codex';
import { overlyBroadClaudeSettings } from '@/lib/fixtures/overly-broad-claude-settings';
import { goodBaselineClaude } from '@/lib/fixtures/good-baseline-claude';

const samples = [
  { key: 'lethal-trifecta-codex-agentsmd', label: 'Codex AGENTS.md (lethal trifecta)', value: lethalTrifectaCodexAgentsMd },
  { key: 'untrusted-codex-mcp', label: 'Codex MCP (untrusted servers)', value: untrustedCodexMcp },
  { key: 'lethal-trifecta-cursorrules', label: 'Cursor rules (lethal trifecta)', value: lethalTrifectaCursorRules },
  { key: 'dangerous-aider', label: 'Aider config (dangerous)', value: dangerousAider },
  { key: 'untrusted-mcp', label: 'Generic MCP (untrusted)', value: untrustedMcp },
  { key: 'invisible-unicode-codex-agentsmd', label: 'Codex AGENTS.md (invisible unicode)', value: invisibleUnicodeCodexAgentsMd },
  { key: 'good-baseline-codex', label: 'Codex AGENTS.md (clean baseline)', value: goodBaselineCodex },
  { key: 'overly-broad-claude-settings', label: 'Claude settings (overly broad)', value: overlyBroadClaudeSettings },
  { key: 'good-baseline-claude', label: 'Claude settings (clean baseline)', value: goodBaselineClaude }
];

export function Auditor() {
  const [text, setText] = useState('');
  const [type, setType] = useState<FileType>('auto');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  return <section id="auditor" className="grid gap-6 md:grid-cols-2">
    <div className="space-y-3">
      <FileTypeTabs value={type} onChange={setType} />
      <textarea className="h-72 w-full rounded border p-3" value={text} onChange={(e) => { setText(e.target.value); setParseError(null); setSizeError(null); }} placeholder="Paste configuration..." />
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
          <span>Upload config file</span>
          <input
            className="sr-only"
            type="file"
            accept=".json,.yaml,.yml,.md,.mdc,.txt,.cursorrules,.aiderconf.yml"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setParseError(null);
              setSizeError(null);
              const MAX_BYTES = 2 * 1024 * 1024;
              if (file.size > MAX_BYTES) {
                setSizeError('This file is too large to scan (max 2MB). ConfigGuard scans configuration files, not full codebases — paste the relevant section instead.');
                return;
              }
              setSelectedFileName(file.name);
              setText(await file.text());
            }}
          />
        </label>
        {selectedFileName ? <span className="truncate text-sm text-slate-500 dark:text-slate-300">{selectedFileName}</span> : null}
      </div>
      <select className="rounded border border-slate-700 bg-slate-800 p-2 text-white" onChange={(e) => setText(samples.find((s) => s.key === e.target.value)?.value ?? '')}>
        <option className="bg-slate-800 text-white" value="">Try a sample</option>
        {samples.map((s) => <option className="bg-slate-800 text-white" key={s.key} value={s.key}>{s.label}</option>)}
      </select>
      <button className="rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-6 py-2 text-sm font-semibold text-white transition-colors cursor-pointer" onClick={() => {
        setParseError(null);
        setSizeError(null);
        const MAX_BYTES = 2 * 1024 * 1024;
        if (new Blob([text]).size > MAX_BYTES) {
          setSizeError('This file is too large to scan (max 2MB). ConfigGuard scans configuration files, not full codebases — paste the relevant section instead.');
          setFindings([]);
          return;
        }
        const parsed = parseConfig(text, undefined, type);
        if (parsed.parseError) {
          setParseError(parsed.parseError);
          setFindings([]);
          return;
        }
        setFindings(runRules(parsed));
      }}>Audit</button>
    </div>
    <div>
      {sizeError ? <p className="rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{sizeError}</p> :
       parseError ? <p className="rounded border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-400">{parseError}</p> :
       findings.length === 0 ? <p className="rounded border p-6 text-slate-500">Paste a config to begin</p> :
       <FindingsList findings={findings} />}
    </div>
  </section>;
}
