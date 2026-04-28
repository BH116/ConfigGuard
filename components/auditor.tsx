'use client';
import { useState } from 'react';
import { parseConfig } from '@/lib/parsers';
import { runRules } from '@/lib/rules';
import { FileType, Finding } from '@/lib/rules/types';
import { FileTypeTabs } from './file-type-tabs';
import { FindingsList } from './findings-list';
import { CapabilityGraph } from './capability-graph';
import { lethalTrifectaCursorRules } from '@/lib/fixtures/lethal-trifecta-cursorrules';
import { invisibleUnicodeAgentsMd } from '@/lib/fixtures/invisible-unicode-agentsmd';
import { overlyBroadClaudeSettings } from '@/lib/fixtures/overly-broad-claude-settings';
import { untrustedMcp } from '@/lib/fixtures/untrusted-mcp';
import { dangerousAider } from '@/lib/fixtures/dangerous-aider';
import { goodBaselineClaude } from '@/lib/fixtures/good-baseline-claude';

const samples: Record<string, string> = {
  'lethal-trifecta-cursorrules': lethalTrifectaCursorRules,
  'invisible-unicode-agentsmd': invisibleUnicodeAgentsMd,
  'overly-broad-claude-settings': overlyBroadClaudeSettings,
  'untrusted-mcp': untrustedMcp,
  'dangerous-aider': dangerousAider,
  'good-baseline-claude': goodBaselineClaude
};

export function Auditor() {
  const [text, setText] = useState('');
  const [type, setType] = useState<FileType>('auto');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [showGraph, setShowGraph] = useState(false);

  return <section id="auditor" className="grid gap-6 md:grid-cols-2">
    <div className="space-y-3">
      <FileTypeTabs value={type} onChange={setType} />
      <textarea className="h-72 w-full rounded border p-3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste configuration..." />
      <input type="file" accept=".json,.yaml,.yml,.md,.mdc,.txt,.cursorrules,.aiderconf.yml" onChange={async (e) => { const file=e.target.files?.[0]; if(!file) return; if(file.size > 1024*1024) alert('Warning: file over 1MB'); setText(await file.text()); }} />
      <select className="rounded border p-2" onChange={(e) => setText(samples[e.target.value] ?? '')}><option>Try a sample</option>{Object.keys(samples).map((k)=><option key={k} value={k}>{k}</option>)}</select>
      <button className="rounded bg-black px-4 py-2 text-white" onClick={() => setFindings(runRules(parseConfig(text, undefined, type)))}>Audit</button>
    </div>
    <div>{findings.length===0 ? <p className="rounded border p-6 text-slate-500">Paste a config to begin</p> : <FindingsList findings={findings} />}<div className="mt-4"><label className="text-sm"><input type="checkbox" checked={showGraph} onChange={(e)=>setShowGraph(e.target.checked)} /> Visualize agent capability graph</label>{showGraph && <CapabilityGraph danger={findings.some((f)=>f.ruleId==='AGT-001')} />}</div></div>
  </section>;
}
