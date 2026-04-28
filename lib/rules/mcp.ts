import { Finding, ParsedConfig } from './types';
import { finding, includesAny, isMutableRef } from './helpers';

export const runMcpRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];

  if (/git\+http:\/\//i.test(t) || /\buvx\s+[\w@/-]+(?!@\d)/i.test(t) || /@(v1|main|master)\b/i.test(t) || /mcp-remote\s*[<:= ]\s*0\.1\.(?:[0-9]|1[0-5])\b/i.test(t) || /@modelcontextprotocol\/inspector\s*[<:= ]\s*0\.(?:[0-9]|1[0-3])\./i.test(t)) {
    f.push(finding('AGT-003', 'Untrusted MCP source/version'));
  }

  if (/(enableAllProjectMcpServers\s*:\s*true|enabledMcpjsonServers)/i.test(t) && !/\.local\./i.test(parsed.fileName ?? '')) {
    f.push(finding('AGT-010', 'MCP mutation in repo-controlled config'));
  }

  if (/(iex\b|Invoke-Expression|python\s+-c|node\s+-e|deno\s+eval|ruby\s+-e|perl\s+-e|curl.*\|\s*sh|wget.*\|\s*bash|bash\s+<\(curl)/i.test(t)) {
    f.push(finding('AGT-011', 'Dangerous MCP command'));
  }

  if (/(uses:\s*[\w/-]+@(v\d+|main|master|latest)|@[vV]\d+\b|@main\b|@master\b|@latest\b)/i.test(t) || includesAny(t, [':latest', '@latest']) || /npx\s+-y\s+\w+\s*"?[,}\n]/i.test(t) || isMutableRef(t.trim())) {
    f.push(finding('AGT-014', 'Mutable or unpinned MCP/action ref'));
  }

  if (/\.vsix|openai apps sdk manifest|Skill\(\*\)/i.test(t)) {
    f.push(finding('AGT-020', 'Untrusted skill or extension script'));
  }

  return f;
};
