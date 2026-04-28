import { Finding, ParsedConfig } from './types';
import { finding, firstMatchingLine, includesAny } from './helpers';

export const runPermissionRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];

  const broadMatch = firstMatchingLine(t, ['Read(/**)', 'Read(~/**)', 'Edit(/**)', 'additionalDirectories: ["/", "~"]', 'tools.allowed.*FileSystemTool(*)', 'sandbox_workspace_write', 'path: "/"', 'path: "~"']);
  if (broadMatch) f.push(finding('AGT-006', broadMatch));

  const denyExpected = ['.env', '.aws', '.ssh', '.kube', '.docker', '.gcloud', '.terraform', '.npmrc', '.pypirc', '*.pem', '*.p12', '*.pfx', '*.jks', 'id_ed25519', 'id_ecdsa'];
  const hasFsPolicy = includesAny(t, ['deny', 'read(', 'allow', 'additionalDirectories', 'filesystem', 'FileSystemTool']);
  if (hasFsPolicy && !denyExpected.every((needle) => t.toLowerCase().includes(needle.toLowerCase()))) {
    f.push(finding('AGT-007', 'Missing one or more secret deny-path patterns'));
  }

  const networkNeedles = ['webfetch', 'curl', 'wget', 'httpx', 'aiohttp', 'invoke-webrequest', 'iwr', 'socat', 'ncat', 'openssl s_client', '169.254.169.254'];
  const hasNetworkTool = includesAny(t, networkNeedles);
  if (hasNetworkTool && !includesAny(t, ['domain:', 'allowed_domains', 'egress_allowlist', 'network.domains', 'source_allowlist'])) f.push(finding('AGT-008', 'Network capability without explicit domain allowlist'));


  const shellMatch = firstMatchingLine(t, ['Bash(*)', 'bash -c', 'shell', 'exec', 'powershell']);
  if (shellMatch && includesAny(t, ['webfetch', 'curl', 'wget', 'mcp', 'http'])) {
    if (!/\.devcontainer/i.test(parsed.fileName ?? '')) f.push(finding('AGT-009', shellMatch));
  }

  const approvalMatch = firstMatchingLine(t, ['autoRun: true', 'bypassPermissions', 'yes-always: true', '--dangerously-skip-permissions', 'chat.tools.autoApprove: true', 'disallowYolo: false', 'approval_mode: yolo', '--full-auto', 'auto_approve_new_tools: true', 'default_decision: approve', 'on_timeout: approve']);
  if (approvalMatch) f.push(finding('AGT-004', approvalMatch));

  return f;
};
