import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

export const runOutputHandlingRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const hasSafeRender = /sanitize_output:\s*true|disable_image_autoload|link_domain_allowlist/i.test(t);
  if (/auto_render_images:\s*true/i.test(t) || ((/send_email|slack_post|webhook/i.test(t)) && !hasSafeRender) || ((/render|slack|email|web/i.test(t)) && !hasSafeRender)) {
    f.push(finding('AGT-071'));
  }
  if (/eval\(.*(?:llm|response|completion|output|content)|exec\(.*(?:llm|response|completion|output|content)|subprocess.*shell=True.*(?:llm|response|output)|os\.system\(.*(?:llm|response|output)|child_process\.exec.*(?:llm|response|output)|Function\(.*(?:llm|response|output)/i.test(t)) f.push(finding('AGT-072'));
  if (/f["'](SELECT|INSERT|UPDATE|DELETE)[^"']*\{.*(?:query|output|response|llm|user_input)|"SELECT.*"\s*\+.*(?:query|output|response)|`\s*(SELECT|INSERT|UPDATE|DELETE)[^`]*\$\{.*(query|output|response|llm|user_input)/i.test(t)) f.push(finding('AGT-073'));
  if (/("?tools"?\s*:|"?mcpServers"?\s*:|"?functions"?\s*: )/i.test(t) && !/(output_schema|response_format:\s*json_schema|pydantic_model|zod_schema|structured_output:\s*true)/i.test(t)) f.push(finding('AGT-074'));
  return f;
};
