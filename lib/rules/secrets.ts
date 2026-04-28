import { ParsedConfig, Finding } from './types';
import { finding } from './helpers';

const secretRegexes = [
  /sk-[a-z0-9-]{16,}/i,
  /ghp_[a-z0-9]{20,}/i,
  /xox[baprs]-[a-z0-9-]{10,}/i,
  /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9._-]{10,}\.[a-zA-Z0-9._-]{10,}/,
  /(api_?key|token|secret|password|bearer)\s*[:=]\s*["']?[A-Za-z0-9_\-./+=]{16,}/i
];

export const runSecretsRules = (parsed: ParsedConfig): Finding[] => {
  const findings: Finding[] = [];
  const matchedSecret = secretRegexes
    .map((rx) => parsed.content.match(rx)?.[0])
    .find(Boolean);

  if (matchedSecret) findings.push(finding('AGT-002', matchedSecret));

  const envRegex = /"([A-Z0-9_]*(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL|DSN|URI))"\s*:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = envRegex.exec(parsed.content)) !== null) {
    if (!m[3].startsWith('${')) findings.push(finding('AGT-015', `${m[1]}: "${m[3]}"`, `${m[1]} has literal value`));
  }
  return findings;
};
