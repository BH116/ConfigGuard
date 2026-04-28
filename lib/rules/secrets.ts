import { Finding, ParsedConfig } from './types';
import { finding, shannonEntropy } from './helpers';

const suppressRx = /^(example|placeholder|dummy|test|fake|redacted|your[_-]?(key|token|password)|<.*>|\$\{.*\})$/i;
const repeatedRunRx = /(.)\1{3,}/;
const genericHighEntropyRx = /(?:api[_-]?key|secret|token|password|credential|bearer)\s*[:=]\s*["']?([A-Za-z0-9_\-./+=]{32,})["']?/gi;

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
  /AKIA[0-9A-Z]{16}/g,
  /ASIA[0-9A-Z]{16}/g,
  /aws_secret_access_key\s*[:=]\s*["']?[A-Za-z0-9/+=]{40}["']?/gi,
  /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/gi,
  /mysql:\/\/[^:\s]+:[^@\s]+@/gi,
  /mongodb(?:\+srv)?:\/\/[^:\s]+:[^@\s]+@/gi,
  /redis:\/\/[^:\s]+:[^@\s]+@/gi,
  /mssql:\/\/[^:\s]+:[^@\s]+@/gi,
  /SG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}/g,
  /AC[a-f0-9]{32}/gi,
  /key-[a-f0-9]{32}/gi,
  /dop_v1_[a-f0-9]{64}/gi,
  /EAACEdEose0cBA[A-Za-z0-9]+/g,
  /ya29\.[A-Za-z0-9_-]+/g,
  /npm_[A-Za-z0-9]{36}/g,
  /SK[0-9a-f]{32}/g,
  /ghp_[A-Za-z0-9]{20,}/g,
  /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9._-]{10,}\.[a-zA-Z0-9._-]{10,}/g,
  /(api_?key|token|secret|password|bearer)\s*[:=]\s*["']?[A-Za-z0-9_\-./+=]{16,}/gi
];

const safeValueRx = /(\$\{\{\s*secrets\.|vault:\/\/|aws-sm:\/\/|op:\/\/)/i;

const shouldSuppressSecret = (value: string): boolean => {
  const normalized = value.trim().replace(/^["']|["']$/g, '');
  if (suppressRx.test(normalized)) return true;
  return repeatedRunRx.test(normalized);
};

export const runSecretsRules = (parsed: ParsedConfig): Finding[] => {
  const findings: Finding[] = [];

  const matchedSecrets = secretRegexes.flatMap((rx) => Array.from(parsed.content.matchAll(rx)).map((m) => m[0])).filter((v) => v && !shouldSuppressSecret(v));
  for (const secret of matchedSecrets) {
    findings.push(finding('AGT-002', secret));
  }

  for (const match of parsed.content.matchAll(genericHighEntropyRx)) {
    const candidate = match[1];
    if (!candidate || shouldSuppressSecret(candidate)) continue;
    if (shannonEntropy(candidate) > 4.0) {
      findings.push(finding('AGT-002', match[0]));
    }
  }

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
