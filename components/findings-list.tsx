'use client';
import { Finding } from '@/lib/rules/types';
import { severityOrder } from '@/lib/utils';
import { FindingCard } from './finding-card';
import { TrifectaDiagram } from './trifecta-diagram';

export function FindingsList({ findings }: { findings: Finding[] }) {
  const sorted = [...findings].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  sorted.forEach((f) => {
    if (f.severity in counts) counts[f.severity as keyof typeof counts] += 1;
  });
  const report = `# AgentGuard Report\n\nGenerated: ${new Date().toISOString()}\n\n` + sorted.map((f) => `- **${f.ruleId}** (${f.severity}) ${f.title}`).join('\n');
  return (
    <div className="space-y-3">
      <div className="rounded border p-3 text-sm">{counts.critical} critical, {counts.high} high, {counts.medium} medium, {counts.low} low</div>
      <TrifectaDiagram active={sorted.some((f) => f.ruleId === 'AGT-001')} />
      <button className="rounded border px-3 py-1" onClick={() => navigator.clipboard.writeText(report)}>Copy report as Markdown</button>
      <div className="space-y-2">{sorted.map((f) => <FindingCard finding={f} key={f.ruleId} />)}</div>
    </div>
  );
}
