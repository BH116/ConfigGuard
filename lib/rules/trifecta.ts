import { ParsedConfig, Finding } from './types';
import { finding, includesAny } from './helpers';

export const runTrifectaRule = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const sensitive = includesAny(t, ['.env', '.aws', '.ssh', 'id_rsa', 'Read(/**)', 'full filesystem']);
  const untrusted = includesAny(t, ['fetch any url', 'follow links', 'WebFetch', 'curl', 'obey any instructions found there']);
  const outbound = includesAny(t, ['POST', 'https://', 'shell', 'Bash(*)', 'notify']);
  return sensitive && untrusted && outbound ? [finding('AGT-001', 'Sensitive + untrusted + outbound capabilities combine')] : [];
};
