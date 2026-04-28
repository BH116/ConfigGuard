import { Finding, ParsedConfig } from './types';
import { finding, RATE_LIMIT_KEYWORDS } from './helpers';

export const runRatelimitRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const hasTools = /("?tools"?\s*:|"?mcpServers"?\s*:|"?functions"?\s*: )/i.test(t);
  if (hasTools && (!new RegExp(RATE_LIMIT_KEYWORDS.join('|'), 'i').test(t) || /(rate_limit|rpm|tpm|quota|throttle)\s*:\s*(unlimited|infinite|null|none|-1)/i.test(t))) f.push(finding('AGT-030'));
  if (/max_iterations:\s*(-1|0|null)|max_iterations\s*[:=]\s*\d{4,}|max_steps:\s*(-1|0|null)|max_recursion_depth:\s*[1-9][0-9]{1,}|max_subagent_depth:\s*(-1|0|null)/i.test(t) || (/(loop|while|agent_loop|plan_and_execute)/i.test(t) && !/(max_iterations|max_steps)/i.test(t))) f.push(finding('AGT-031'));
  if (hasTools && !/(max_output_tokens|max_input_tokens|max_context_tokens|cost_cap|daily_cost_cap_usd|token_budget)/i.test(t)) f.push(finding('AGT-032'));
  if ((/(tool|function)/i.test(t) && !/(timeout|tool_timeout_sec|step_timeout|request_timeout)/i.test(t)) || /timeout\s*:\s*(0|null|none|-1)/i.test(t) || /no\s+timeout\s+(is\s+)?required|without\s+timeout|timeout\s+is\s+optional/i.test(t)) f.push(finding('AGT-033'));
  return f;
};
