// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

/**
 * Checks multi-agent topology risks: missing inter-agent authentication, subagents inheriting full scope, and wildcard peer-agent allowlists.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for multi-agent communication and delegation misconfigurations.
 */
export const runMultiAgentRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const mMulti = t.match(/(sub_agents:|agent_bus:|connected_agents:|peer_agents:|multi_agent:\s*true)/i);
  const multi = Boolean(mMulti);
  const mProto = t.match(/protocol:\s*http:\/\/|redis:\/\/|nats:\/\//i);
  if (multi && (!/(inter_agent_authn|mtls|signed_handoff|agent_attestation)/i.test(t) || mProto && !/tls_enabled:\s*true/i.test(t))) f.push(finding('AGT-056', mProto?.[0] ?? mMulti?.[0]));
  const m57 = t.match(/(subagent_inherits_full_scope\s*:\s*true|"subagent_inherits_full_scope"\s*:\s*true|forward_credentials_to_subagent\s*:\s*true|delegation\s*:\s*["']?unrestricted["']?|scope_inheritance\s*:\s*["']?full["']?)/i);
  if (m57) f.push(finding('AGT-057', m57[0]));
  const m58 = t.match(/peer_agents:\s*["']\*["']|agent_allowlist:\s*\[\s*["']\*["']\s*\]/i);
  if (m58 || (multi && !/agent_allowlist\s*:/i.test(t))) f.push(finding('AGT-058', m58?.[0] ?? mMulti?.[0]));
  return f;
};
