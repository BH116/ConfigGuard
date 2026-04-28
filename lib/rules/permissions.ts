import { Finding, ParsedConfig } from './types';
import { finding, firstMatchingLine, includesAny } from './helpers';

export const runPermissionRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const broadNeedles = ['Read(/**)', 'Read(~/**)', 'Edit(/**)', 'additionalDirectories: ["/", "~"]', 'additionalDirectories'];
  const secretDenyNeedles = ['Bash(diff *.env*)', 'cat *.env'];
  const networkNeedles = ['WebFetch', 'curl', 'wget', 'nc'];
  const shellNeedles = ['Bash(*)', 'bash -c', 'shell'];
  const approvalNeedles = ['autoRun: true', 'bypassPermissions', 'yes-always: true', '--dangerously-skip-permissions'];

  const broadMatch = firstMatchingLine(t, broadNeedles);
  if (broadMatch) f.push(finding('AGT-006', broadMatch));

  if (!includesAny(t, ['.env', 'secrets/', '.aws', '.ssh', '.netrc', '*.pem']) || !includesAny(t, secretDenyNeedles)) {
    f.push(finding('AGT-007', firstMatchingLine(t, ['.env', 'secrets/', '.aws', '.ssh', '.netrc', '*.pem']) ?? 'No explicit deny pattern for secrets found'));
  }

  const networkMatch = firstMatchingLine(t, networkNeedles);
  if (networkMatch && !includesAny(t, ['domain:'])) f.push(finding('AGT-008', networkMatch));

  const shellMatch = firstMatchingLine(t, shellNeedles);
  if (shellMatch && includesAny(t, ['WebFetch', 'curl', 'wget', 'mcp'])) f.push(finding('AGT-009', shellMatch));

  const approvalMatch = firstMatchingLine(t, approvalNeedles);
  if (approvalMatch) f.push(finding('AGT-004', approvalMatch));
  return f;
};
