import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

export const runMultiAgentRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const multi = /(sub_agents:|agent_bus:|connected_agents:|peer_agents:|multi_agent:\s*true)/i.test(t);
  if (multi && (!/(inter_agent_authn|mtls|signed_handoff|agent_attestation)/i.test(t) || /protocol:\s*http:\/\/|redis:\/\/|nats:\/\//i.test(t) && !/tls_enabled:\s*true/i.test(t))) f.push(finding('AGT-056'));
  if (/subagent_inherits_full_scope:\s*true|forward_credentials_to_subagent:\s*true|delegation:\s*unrestricted|scope_inheritance:\s*full/i.test(t)) f.push(finding('AGT-057'));
  if (/peer_agents:\s*["']\*["']|agent_allowlist:\s*\[\s*["']\*["']\s*\]/i.test(t) || (multi && !/agent_allowlist\s*:/i.test(t))) f.push(finding('AGT-058'));
  return f;
};
