import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

const suppressRx = /(example|placeholder|xxxx|dummy|test|fake|redacted|not.real|\*{4,}|your[-_]key)/i;
const repeatedCharsRx = /^(.)\1+$/;
const secretRegexes = [
  /sk-[a-z0-9-]{16,}/gi,
  /sk-ant-[a-zA-Z0-9-]{20,}/g,
  /sk-proj-[a-zA-Z0-9-]{20,}/g,
  /AIzaSy[A-Za-z0-9_-]{33}/g,
  /hf_[A-Za-z0-9]{20,}/g,
  /pcsk_[A-Za-z0-9_]{50,}/g,
  /glpat-[A-Za-z0-9_-]{20,}/g,
  /ATATT3[A-Za-z0-9]{30,}/g,
  /xapp-[0-9]-[A-Z0-9]{10,}/g,
  /xoxe-[A-Za-z0-9-]{50,}/g,
  /xoxs-[A-Za-z0-9-]{50,}/g,
  /rk_live_[A-Za-z0-9]{20,}/g,
  /ASIA[0-9A-Z]{16}/g,
  /SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}/g,
  /SK[0-9a-f]{32}/g,
  /ghp_[A-Za-z0-9]{20,}/g,
  /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9._-]{10,}\.[a-zA-Z0-9._-]{10,}/g,
  /(api_?key|token|secret|password|bearer)\s*[:=]\s*["']?[A-Za-z0-9_\-./+=]{16,}/gi
];

const safeValueRx = /(\$\{\{\s*secrets\.|vault:\/\/|aws-sm:\/\/|op:\/\/)/i;

export const runSecretsRules = (parsed: ParsedConfig): Finding[] => {
  const findings: Finding[] = [];

  const shouldSuppressSecret = (value: string): boolean => {
    const prefixed = value.match(/^(?:sk-ant-|sk-proj-|hf_|rk_live_|ghp_|glpat-|ATATT3)(.+)$/i)?.[1];
    if (prefixed && prefixed.length >= 20) return repeatedCharsRx.test(prefixed);
    return suppressRx.test(value);
  };

  const matchedSecret = secretRegexes
    .flatMap((rx) => Array.from(parsed.content.matchAll(rx)).map((m) => m[0]))
    .find((v) => v && !shouldSuppressSecret(v));
  if (matchedSecret) findings.push(finding('AGT-002', matchedSecret));

  const envRegex = /([A-Z0-9_]*(KEY|TOKEN|SECRET|PASSWORD|PASSPHRASE|PRIVATE_KEY|CREDENTIAL|AUTH|BEARER|SESSION|WEBHOOK_URL|CONNECTION_STRING))\s*[:=]\s*["']?([^"'\n]+)/g;
  let m: RegExpExecArray | null;
  while ((m = envRegex.exec(parsed.content)) !== null) {
    if (!safeValueRx.test(m[3]) && !m[3].startsWith('${') && !suppressRx.test(m[3])) {
      findings.push(finding('AGT-015', `${m[1]}=${m[3]}`, `${m[1]} has literal value`));
      break;
    }
  }
  return findings;
};
