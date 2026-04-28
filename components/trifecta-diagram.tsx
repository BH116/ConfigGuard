export function TrifectaDiagram({ active }: { active: boolean }) {
  const fill = active ? 'fill-red-500/60' : 'fill-slate-400/30';
  return (
    <svg viewBox="0 0 300 120" className="h-28 w-full">
      <circle cx="100" cy="60" r="40" className={fill} />
      <circle cx="150" cy="60" r="40" className={fill} />
      <circle cx="200" cy="60" r="40" className={fill} />
      <text x="60" y="110" className="fill-current text-xs">Untrusted Input</text>
      <text x="125" y="110" className="fill-current text-xs">Sensitive Data</text>
      <text x="200" y="110" className="fill-current text-xs">External Comms</text>
    </svg>
  );
}
