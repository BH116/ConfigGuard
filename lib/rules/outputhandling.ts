// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { finding, firstMatchingLine, firstNonEmptyLine } from './helpers';

/**
 * Checks unsafe handling of model output: markdown image auto-render, LLM output piped to eval/exec/shell, SQL built by string concatenation with model output, and missing output schemas for tool-calling agents.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for improper output handling.
 */
export const runOutputHandlingRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const hasSafeRender = /sanitize_output:\s*true|disable_image_autoload|link_domain_allowlist/i.test(t);
  const m71 = t.match(/auto_render_images:\s*true/i);
  const m71b = t.match(/send_email|slack_post|webhook/i);
  const m71c = t.match(/render|slack|email|web/i);
  if (m71 || (m71b && !hasSafeRender) || (m71c && !hasSafeRender)) {
    f.push(finding('AGT-071', m71?.[0] ?? m71b?.[0] ?? m71c?.[0]));
  }
  const m72 = t.match(/eval\(.*(?:llm|response|completion|output|content)|exec\(.*(?:llm|response|completion|output|content)|subprocess.*shell=True.*(?:llm|response|output)|os\.system\(.*(?:llm|response|output)|child_process\.exec.*(?:llm|response|output)|Function\(.*(?:llm|response|output)/i);
  if (m72) f.push(finding('AGT-072', m72[0]));
  const m73 = t.match(/f["'](SELECT|INSERT|UPDATE|DELETE)[^"']*\{.*(?:query|output|response|llm|user_input)|"SELECT.*"\s*\+.*(?:query|output|response)|`\s*(SELECT|INSERT|UPDATE|DELETE)[^`]*\$\{.*(query|output|response|llm|user_input)/i);
  if (m73) f.push(finding('AGT-073', m73[0]));
  if (/("?tools"?\s*:|"?mcpServers"?\s*:|"?functions"?\s*: )/i.test(t) && !/(output_schema|response_format:\s*json_schema|pydantic_model|zod_schema|structured_output:\s*true)/i.test(t)) f.push(finding('AGT-074', firstMatchingLine(t, ['tools', 'mcpServers', 'functions']) ?? firstNonEmptyLine(t)));
  return f;
};
