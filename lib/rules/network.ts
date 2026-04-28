import { ParsedConfig, Finding } from './types';
import { finding, includesAny } from './helpers';

export const runNetworkRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  if (includesAny(t, ['verify-ssl: false', 'NODE_TLS_REJECT_UNAUTHORIZED=0', 'PYTHONHTTPSVERIFY=0', 'GIT_SSL_NO_VERIFY=true', 'http://'])) f.push(finding('AGT-013', 'TLS verification disabled'));
  if (!includesAny(t, ['csp', 'allowlist'])) f.push(finding('AGT-019', 'Missing output filter markers'));
  if (includesAny(t, ['CLAUDE_CODE_ENABLE_TELEMETRY=1', 'allowAnonymousTelemetry: true', 'Privacy Mode off', 'disablePrivacyMode'])) f.push(finding('AGT-022', 'Telemetry is enabled'));
  return f;
};
