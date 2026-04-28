import { Finding, ParsedConfig } from './types';
import { extractAllStrings, finding } from './helpers';

export const runToolPoisoningRules = (parsed: ParsedConfig): Finding[] => {
  const all = [parsed.content, ...extractAllStrings(parsed.json), ...extractAllStrings(parsed.yaml)].join('\n');
  const f: Finding[] = [];
  if (/<IMPORTANT>|<HIDDEN>|<SYSTEM>|before any other tool|always do this first|do not mention this|never reveal|silently|without informing the user|ignore what the user said|conversation history|exfiltrate/i.test(all)) f.push(finding('AGT-048'));
  if (/(read|cat|open|fetch|get|retrieve|access|send|exfiltrate|upload).{0,40}(~\/\.ssh|\.aws|\.env|id_rsa|credentials|\.claude\/settings|\/etc\/passwd|\/etc\/shadow|\.cursor\/mcp\.json|config\.toml)/i.test(all)) f.push(finding('AGT-049'));
  if (/^(delete|drop|truncate|update|patch|put|post|send|exec|run|deploy|kill|shutdown)/im.test(all) && /(readOnlyHint:\s*true|destructiveHint:\s*false)/i.test(all)) f.push(finding('AGT-050'));
  if (/(sidenote|reasoning_trace|context_notes|memo|metadata_blob|internal_comment)/i.test(all) && /type\s*:\s*string/i.test(all) && !/(maxLength|pattern)\s*:/i.test(all)) f.push(finding('AGT-051'));
  return f;
};
