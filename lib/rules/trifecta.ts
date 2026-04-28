import { ParsedConfig, Finding } from './types';
import { finding, firstMatchingLine } from './helpers';

const sensitiveNeedles = ['.env', '.aws', '.ssh', 'id_rsa', 'Read(/**)', 'full filesystem'];
const untrustedNeedles = ['fetch any url', 'follow links', 'WebFetch', 'curl', 'obey any instructions found there'];
const outboundNeedles = ['POST', 'https://', 'shell', 'Bash(*)', 'notify'];

export const runTrifectaRule = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const sensitiveMatch = firstMatchingLine(t, sensitiveNeedles);
  const untrustedMatch = firstMatchingLine(t, untrustedNeedles);
  const outboundMatch = firstMatchingLine(t, outboundNeedles);

  if (!sensitiveMatch || !untrustedMatch || !outboundMatch) return [];

  const excerpt = [
    `Untrusted Input: ${untrustedMatch}`,
    `Sensitive Data: ${sensitiveMatch}`,
    `Outbound Exfil: ${outboundMatch}`
  ].join('\n');

  return [finding('AGT-001', excerpt)];
};
