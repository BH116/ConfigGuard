'use client';
import { Finding } from '@/lib/rules/types';
import { SeverityBadge } from './severity-badge';

export function FindingCard({ finding }: { finding: Finding }) {
  return (
    <details className="rounded border p-3">
      <summary className="flex cursor-pointer items-center gap-2">
        <SeverityBadge severity={finding.severity} />
<<<<<<< ours
        <span className="font-semibold">{finding.ruleId} — {finding.title}</span>
=======
        <span className="font-semibold">{finding.ruleId}: {finding.title}</span>
>>>>>>> theirs
      </summary>
      <p className="mt-2 text-sm">{finding.description}</p>
      <pre className="mt-2 overflow-auto rounded bg-slate-900 p-2 text-xs text-slate-100">{finding.excerpt}</pre>
      <p className="mt-2 text-sm whitespace-pre-wrap">{finding.remediation}</p>
      <ul className="mt-2 list-disc pl-5 text-xs">
        {finding.references.map((r) => <li key={r.url}><a className="underline" href={r.url} target="_blank">{r.label}</a></li>)}
      </ul>
    </details>
  );
}
