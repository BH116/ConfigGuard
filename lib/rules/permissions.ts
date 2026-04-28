import { Finding, ParsedConfig } from './types';
import { finding, includesAny } from './helpers';

export const runPermissionRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  if (includesAny(t, ['Read(/**)', 'Read(~/**)', 'Edit(/**)', 'additionalDirectories: ["/", "~"]', 'additionalDirectories'])) f.push(finding('AGT-006', 'Broad filesystem scope'));
  if (!includesAny(t, ['.env', 'secrets/', '.aws', '.ssh', '.netrc', '*.pem']) || !includesAny(t, ['Bash(diff *.env*)', 'cat *.env'])) f.push(finding('AGT-007', 'Missing deny for secret files'));
  if (includesAny(t, ['WebFetch', 'curl', 'wget', 'nc']) && !includesAny(t, ['domain:'])) f.push(finding('AGT-008', 'Network not allowlisted'));
  if (includesAny(t, ['Bash(*)', 'bash -c', 'shell']) && includesAny(t, ['WebFetch', 'curl', 'wget', 'mcp'])) f.push(finding('AGT-009', 'Shell + network combo'));
  if (includesAny(t, ['autoRun: true', 'bypassPermissions', 'yes-always: true', '--dangerously-skip-permissions'])) f.push(finding('AGT-004', 'Auto-run bypass enabled'));
  return f;
};
