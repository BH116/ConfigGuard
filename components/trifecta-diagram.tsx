export function TrifectaDiagram({
  hasUntrusted,
  hasSensitive,
  hasOutbound
}: {
  hasUntrusted: boolean;
  hasSensitive: boolean;
  hasOutbound: boolean;
}) {
  return (
    <div>
      <svg viewBox="0 0 320 175" className="h-40 w-full">
        <circle cx="100" cy="75" r="50" fill={hasUntrusted ? 'rgba(239,68,68,0.5)' : 'rgba(100,116,139,0.2)'} />
        <circle cx="160" cy="75" r="50" fill={hasSensitive ? 'rgba(239,68,68,0.5)' : 'rgba(100,116,139,0.2)'} />
        <circle cx="220" cy="75" r="50" fill={hasOutbound ? 'rgba(239,68,68,0.5)' : 'rgba(100,116,139,0.2)'} />
        <text x="60" y="140" textAnchor="middle" fontSize="9" className="fill-current">Untrusted</text>
        <text x="60" y="152" textAnchor="middle" fontSize="9" className="fill-current">Input</text>
        <text x="160" y="148" textAnchor="middle" fontSize="9" className="fill-current">Sensitive</text>
        <text x="160" y="160" textAnchor="middle" fontSize="9" className="fill-current">Data</text>
        <text x="260" y="140" textAnchor="middle" fontSize="9" className="fill-current">Outbound</text>
        <text x="260" y="152" textAnchor="middle" fontSize="9" className="fill-current">Exfil</text>
      </svg>
      <p className="mt-1 text-center text-xs text-slate-500">
        When all three overlap, an attacker can steal your secrets through your agent.
      </p>
    </div>
  );
}
