export function TrifectaDiagram({ active }: { active: boolean }) {
  const fill = active ? 'fill-red-500/60' : 'fill-slate-400/30';
  return (
    <svg viewBox="0 0 300 140" className="h-32 w-full">
      <circle cx="100" cy="60" r="40" className={fill} />
      <circle cx="150" cy="60" r="40" className={fill} />
      <circle cx="200" cy="60" r="40" className={fill} />
      <text x="50" y="125" className="fill-current text-[10px]">Untrusted Input</text>
      <text x="150" y="125" className="fill-current text-[10px]" textAnchor="middle">Sensitive Data</text>
      <text x="250" y="125" className="fill-current text-[10px]" textAnchor="end">External Comms</text>
    </svg>
  );
}
