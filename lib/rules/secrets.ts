import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

const suppressRx = /(example|placeholder|xxxx|dummy|test|fake|redacted|not.real|\*{4,}|your[-_]key)/i;
const secretRegexes = [
  /sk-[a-z0-9-]{16,}/i,
  /sk-ant-[a-zA-Z0-9-]{20,}/,
  /AIzaSy[A-Za-z0-9_-]{33}/,
  /hf_[A-Za-z0-9]{34,}/,
  /pcsk_[A-Za-z0-9_]{50,}/,
  /glpat-[A-Za-z0-9_-]{20,}/,
  /ATATT3[A-Za-z0-9]{50,}/,
  /xapp-[0-9]-[A-Z0-9]{10,}/,
  /xoxe-[A-Za-z0-9-]{50,}/,
  /xoxs-[A-Za-z0-9-]{50,}/,
  /rk_live_[A-Za-z0-9]{20,}/,
  /ASIA[0-9A-Z]{16}/,
  /SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}/,
  /SK[0-9a-f]{32}/,
  /ghp_[a-z0-9]{20,}/i,
  /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9._-]{10,}\.[a-zA-Z0-9._-]{10,}/,
  /(api_?key|token|secret|password|bearer)\s*[:=]\s*["']?[A-Za-z0-9_\-./+=]{16,}/i
];

const safeValueRx = /(\$\{\{\s*secrets\.|vault:\/\/|aws-sm:\/\/|op:\/\/)/i;

export const runSecretsRules = (parsed: ParsedConfig): Finding[] => {
  const findings: Finding[] = [];
  const matchedSecret = secretRegexes.map((rx) => parsed.content.match(rx)?.[0]).find((v) => v && !suppressRx.test(v));
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
