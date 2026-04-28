import { Severity } from '@/lib/rules/types';

const map: Record<Severity, string> = {
  critical: 'bg-red-600',
  high: 'bg-orange-500',
  medium: 'bg-amber-400 text-black',
  low: 'bg-blue-500',
  info: 'bg-slate-400 text-black'
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`rounded px-2 py-1 text-xs font-semibold text-white ${map[severity]}`}>{severity.toUpperCase()}</span>;
}
