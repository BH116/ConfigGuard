import { Finding, ParsedConfig } from './types';
import { finding, firstMatchingLine, isTestOrFixturePath } from './helpers';

const sensitiveNeedles = ['.env', '.aws', '.ssh', 'id_rsa', 'id_ed25519', 'id_ecdsa', 'secrets', 'private_key'];
const untrustedNeedles = ['fetch any url', 'follow links', 'webfetch', 'httpx', 'aiohttp', 'curl', 'wget', 'mcp__github', 'mcp__slack', 'mcp__jira'];
const outboundNeedles = ['post', 'https://', 'webhook', 'send_email', 'slack_post', 'shell', 'bash(*)', 'ncat', 'socat'];
const agt097Patterns = [
  /(instructions?|directives?|commands?)\s+(inside|within|in)\s+(documents?|attachments?|pdfs?|invoices?|tickets?|emails?)/i,
  /(attachment|document|pdf|invoice|email)\s+text\s+.*used\s+as\s+instructions/i,
  /follow\s+(embedded|attached|document)\s+(links?|instructions?|directives?)/i
];
const agt098or38or39Patterns = [
  /(combin\w+|aggregat\w+|merg\w+|join\w+|consolidat\w+)\s+.{0,40}(customer|vendor|employee|patient|billing|financial|medical|hr)\s+.{0,40}(data|records|information)/i,
  /(include|export|combine).{0,40}(customer|vendor|employee).{0,40}(billing|payment|financial|medical|hr|salary)/i,
  /(select\s+\*|full\s+record|return\s+everything|all\s+fields)/i
];
const agt008or86or102Patterns = [
  /(fetch|retrieve|download)\s+(.{0,40})?(url|script|content|payload)\s+.{0,80}(execute|run|eval|exec)/i,
  /(may|can|allowed to|permitted to)\s+(send|make)\s+(http|https|web|network)\s+requests?\s+to\s+any/i,
  /(curl|wget|fetch).{0,80}(\|\s*(bash|sh|zsh|python|node)|>\s*\/tmp|exec)/i
];

export const runTrifectaRule = (parsed: ParsedConfig): Finding[] => {
  if (isTestOrFixturePath(parsed.fileName)) return [];
  const t = parsed.content;
  const sensitiveMatch = firstMatchingLine(t, sensitiveNeedles);
  const untrustedMatch = firstMatchingLine(t, untrustedNeedles);
  const outboundMatch = firstMatchingLine(t, outboundNeedles);
  const mcpTrifecta = /mcp__github/i.test(t) && /(mcp__slack|mcp__jira|issues)/i.test(t) && /(webfetch|http|egress|curl|wget)/i.test(t);
  const hasNlIngestionLeg = agt097Patterns.some((pattern) => pattern.test(t));
  const hasNlSensitiveLeg = agt098or38or39Patterns.some((pattern) => pattern.test(t));
  const hasNlOutboundLeg = agt008or86or102Patterns.some((pattern) => pattern.test(t));
  if (hasNlIngestionLeg && hasNlSensitiveLeg && hasNlOutboundLeg) {
    return [
      finding(
        'AGT-001',
        'Lethal trifecta detected via natural language patterns: untrusted document ingestion + sensitive data access + outbound channel.'
      )
    ];
  }
  if ((!sensitiveMatch || !untrustedMatch || !outboundMatch) && !mcpTrifecta) return [];

  return [
    finding(
      'AGT-001',
      [`Untrusted Input: ${untrustedMatch ?? 'not detected'}`, `Sensitive Data: ${sensitiveMatch ?? 'not detected'}`, `Outbound Exfil: ${outboundMatch ?? 'not detected'}`].join('\n')
    )
  ];
};
