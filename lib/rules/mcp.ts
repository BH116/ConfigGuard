import { ParsedConfig, Finding } from './types';
import { finding, includesAny } from './helpers';

export const runMcpRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  if (includesAny(t, ['@latest', 'http://', 'mcp-remote']) || /totally-legit-mcp/i.test(t)) f.push(finding('AGT-003', 'Untrusted MCP source')); 
  if (includesAny(t, ['@latest', ':latest']) || /npx\s+-y\s+\w+\s*"?[,}\n]/i.test(t)) f.push(finding('AGT-014', 'Unpinned MCP dependency')); 
  if (includesAny(t, ['nc -e', '/dev/tcp/', 'mkfifo', 'curl'] ) && includesAny(t, ['| sh', 'bash -i', 'sh -c', 'eval $('])) f.push(finding('AGT-011', 'Dangerous MCP command'));
  if (includesAny(t, ['mcpServers'])) f.push(finding('AGT-010', 'MCP config in repo requires re-approval', 'Info by default; verify CODEOWNERS + reviews.'));
  return f;
};
