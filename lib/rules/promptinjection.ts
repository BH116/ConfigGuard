import { Finding, ParsedConfig } from './types';
import { extractAllStrings, finding } from './helpers';

export const runPromptInjectionRules = (parsed: ParsedConfig): Finding[] => {
  const strings = [parsed.content, ...extractAllStrings(parsed.json), ...extractAllStrings(parsed.yaml)];
  const all = strings.join('\n');
  const f: Finding[] = [];
  if (/\b(ignore (all )?previous instructions?|admin override|developer mode|jailbreak|do anything now|DAN mode|if urgent[^.]{0,40}override|unrestricted mode|no safety rules?|sudo mode|god mode|override all restrictions)\b/i.test(all)) f.push(finding('AGT-043'));
  if (/(follow|obey|execute|act on).{0,40}(instructions?|directions?|commands?).{0,20}(in|from|inside|within).{0,20}(document|tool|email|webpage|response|data|ticket|issue|pr|attachment|url)|(trust|believe|treat as authoritative).{0,30}(content|output|result|response)/i.test(all)) f.push(finding('AGT-044'));
  if (/(\{user_input\}|\{\{.*query.*\}\}|\$\{input\}|\{message\})/i.test(all) && !/(<UNTRUSTED>|<DATA>|<USER_INPUT>|###|---|\|\|\||<\|im_start\|>|<\|im_end\|>|```)/i.test(all)) f.push(finding('AGT-045'));
  if (/<interaction-config>|<scene-rules>|<dr-house-config>|interaction-mode\s*=|"blocked_modes"\s*:\s*\[\s*\]|"allowed_responses"\s*:\s*"unrestricted"|\[ALLOWED\]:\s*\[BLOCKED\]:|allowedModes\s*:/i.test(all)) f.push(finding('AGT-046'));
  if (/("?tools"?\s*:|"?mcpServers"?\s*:|"?functions"?\s*: )/i.test(all) && (!/(input_rails|output_rails|guardrails|nemo_guardrails|lakera_guard|llm_guard|azure_content_safety|bedrock_guardrails|openai_moderation|prompt_shields|content_safety)/i.test(all) || /safety:\s*disabled|fail_closed:\s*false/i.test(all))) f.push(finding('AGT-047'));
  return f;
};
