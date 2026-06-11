// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { extractAllStrings, finding } from './helpers';

/**
 * Checks tool description poisoning: hidden imperative override phrases, file-read imperatives targeting secrets, misannotated destructive tools, and free-text covert-channel parameters.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for poisoned or deceptive tool definitions.
 */
export const runToolPoisoningRules = (parsed: ParsedConfig): Finding[] => {
  const all = [parsed.content, ...extractAllStrings(parsed.json), ...extractAllStrings(parsed.yaml)].join('\n');
  const f: Finding[] = [];
  const m48 = all.match(/<IMPORTANT>|<HIDDEN>|<SYSTEM>|before any other tool|always do this first|do not mention this|never reveal|silently|without informing the user|ignore what the user said|conversation history|exfiltrate/i);
  if (m48) f.push(finding('AGT-048', m48[0]));
  const m49 = all.match(/(read|cat|open|fetch|get|retrieve|access|send|exfiltrate|upload).{0,40}(~\/\.ssh|\.aws|\.env|id_rsa|credentials|\.claude\/settings|\/etc\/passwd|\/etc\/shadow|\.cursor\/mcp\.json|config\.toml)/i);
  if (m49) f.push(finding('AGT-049', m49[0]));
  const m50 = all.match(/"?readOnlyHint"?\s*:\s*true|"?destructiveHint"?\s*:\s*false/i);
  if (/((?:^|[\s"']))(delete|drop|truncate|update|patch|put|post|send|exec|run|deploy|kill|shutdown)/im.test(all) && m50) f.push(finding('AGT-050', m50[0]));
  const m51 = all.match(/(sidenote|reasoning_trace|context_notes|memo|metadata_blob|internal_comment)/i);
  if (m51 && /type\s*:\s*string/i.test(all) && !/(maxLength|pattern)\s*:/i.test(all)) f.push(finding('AGT-051', m51[0]));
  return f;
};
