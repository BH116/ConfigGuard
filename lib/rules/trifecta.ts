import { Finding, ParsedConfig } from './types';
import { finding, firstMatchingLine, isTestOrFixturePath } from './helpers';

const sensitiveNeedles = ['.env', '.aws', '.ssh', 'id_rsa', 'id_ed25519', 'id_ecdsa', 'secrets', 'private_key'];
const untrustedNeedles = ['fetch any url', 'follow links', 'webfetch', 'httpx', 'aiohttp', 'curl', 'wget', 'mcp__github', 'mcp__slack', 'mcp__jira'];
const outboundNeedles = ['post', 'https://', 'webhook', 'send_email', 'slack_post', 'shell', 'bash(*)', 'ncat', 'socat'];

export const runTrifectaRule = (parsed: ParsedConfig): Finding[] => {
  if (isTestOrFixturePath(parsed.fileName)) return [];
  const t = parsed.content;
  const sensitiveMatch = firstMatchingLine(t, sensitiveNeedles);
  const untrustedMatch = firstMatchingLine(t, untrustedNeedles);
  const outboundMatch = firstMatchingLine(t, outboundNeedles);
  const mcpTrifecta = /mcp__github/i.test(t) && /(mcp__slack|mcp__jira|issues)/i.test(t) && /(webfetch|http|egress|curl|wget)/i.test(t);

  if ((!sensitiveMatch || !untrustedMatch || !outboundMatch) && !mcpTrifecta) return [];

  return [
    finding(
      'AGT-001',
      [`Untrusted Input: ${untrustedMatch ?? 'not detected'}`, `Sensitive Data: ${sensitiveMatch ?? 'not detected'}`, `Outbound Exfil: ${outboundMatch ?? 'not detected'}`].join('\n')
    )
  ];
};
