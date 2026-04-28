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
  const severitySummary = [
    { key: 'critical', label: 'Critical', count: counts.critical, color: 'bg-red-600' },
    { key: 'high', label: 'High', count: counts.high, color: 'bg-orange-500' },
    { key: 'medium', label: 'Medium', count: counts.medium, color: 'bg-amber-400' },
    { key: 'low', label: 'Low', count: counts.low, color: 'bg-blue-500' }
  ].filter((severity) => severity.count > 0);

  return (
    <div className="space-y-3">
      {severitySummary.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {severitySummary.map((severity) => (
            <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-white" key={severity.key}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300">
                <span className={`h-2.5 w-2.5 rounded-full ${severity.color}`} />
                {severity.label}
              </div>
              <p className="text-2xl font-bold leading-tight">{severity.count}</p>
            </div>
          ))}
        </div>
      ) : null}
      <TrifectaDiagram active={sorted.some((f) => f.ruleId === 'AGT-001')} />
      <button className="rounded border px-3 py-1" onClick={() => navigator.clipboard.writeText(report)}>Copy report as Markdown</button>
      <div className="space-y-2">{sorted.map((f) => <FindingCard finding={f} key={f.ruleId} />)}</div>
    </div>
  );
}
