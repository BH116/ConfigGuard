// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { extractAllStrings, finding, firstMatchingLine, firstNonEmptyLine } from './helpers';

/**
 * Checks prompt injection exposure: instruction override clauses, prompts that trust tool or document outputs, missing delimiters around untrusted content, policy-puppetry jailbreak frames, and absent safety rails.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for prompt injection weaknesses.
 */
export const runPromptInjectionRules = (parsed: ParsedConfig): Finding[] => {
  const strings = [parsed.content, ...extractAllStrings(parsed.json), ...extractAllStrings(parsed.yaml)];
  const all = strings.join('\n');
  const f: Finding[] = [];
  const m43 = all.match(/\b(ignore (all )?previous instructions?|admin override|developer mode|jailbreak|do anything now|DAN mode|if urgent[^.]{0,40}override|unrestricted mode|no safety rules?|sudo mode|god mode|override all restrictions)\b/i);
  if (m43) f.push(finding('AGT-043', m43[0]));
  const m44 = all.match(/(follow|obey|execute|act on).{0,40}(instructions?|directions?|commands?).{0,20}(in|from|inside|within).{0,20}(document|tool|email|webpage|response|data|ticket|issue|pr|attachment|url)|(trust|believe|treat as authoritative).{0,30}(content|output|result|response)/i);
  if (m44) f.push(finding('AGT-044', m44[0]));
  const m45 = all.match(/(\{user_input\}|\{\{.*query.*\}\}|\$\{input\}|\{message\})/i);
  if (m45 && !/(<UNTRUSTED>|<DATA>|<USER_INPUT>|###|---|\|\|\||<\|im_start\|>|<\|im_end\|>|```)/i.test(all)) f.push(finding('AGT-045', m45[0]));
  const m46 = all.match(/<interaction-config>|<scene-rules>|<dr-house-config>|interaction-mode\s*=|"blocked_modes"\s*:\s*\[\s*\]|"allowed_responses"\s*:\s*"unrestricted"|\[ALLOWED\]:\s*\[BLOCKED\]:|allowedModes\s*:/i);
  if (m46) f.push(finding('AGT-046', m46[0]));
  const m47b = all.match(/safety:\s*disabled|fail_closed:\s*false/i);
  if (/("?tools"?\s*:|"?mcpServers"?\s*:|"?functions"?\s*: )/i.test(all) && (!/(input_rails|output_rails|guardrails|nemo_guardrails|lakera_guard|llm_guard|azure_content_safety|bedrock_guardrails|openai_moderation|prompt_shields|content_safety)/i.test(all) || m47b)) f.push(finding('AGT-047', m47b?.[0] ?? firstMatchingLine(all, ['tools', 'mcpServers', 'functions']) ?? firstNonEmptyLine(all)));
  return f;
};
