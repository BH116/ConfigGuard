import { Finding, ParsedConfig } from './types';
import { finding, RATE_LIMIT_KEYWORDS } from './helpers';

export const runRatelimitRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const hasTools = /("?tools"?\s*:|"?mcpServers"?\s*:|"?functions"?\s*: )/i.test(t);
  if (hasTools && (!new RegExp(RATE_LIMIT_KEYWORDS.join('|'), 'i').test(t) || /(rate_limit|rpm|tpm|quota|throttle)\s*:\s*(unlimited|infinite|null|none|-1)/i.test(t))) f.push(finding('AGT-030'));
  const explicitBadIteration = /max_iterations\s*[:=]\s*(-1|0|null|undefined)|max_iterations\s*[:=]\s*\d{4,}|max_steps\s*[:=]\s*(-1|0|null|undefined)|max_recursion_depth\s*[:=]\s*(?:[1-9][0-9]{3,}|-1|0|null)|max_subagent_depth\s*[:=]\s*(-1|0|null|undefined)/i.test(t);
  const unboundedRetry = /(retry|retries|try\s+again).{0,40}(forever|until\s+success|until\s+they\s+succeed|without\s+limit|unbounded|indefinitely)|infinite\s+retries|keep\s+retrying/i.test(t);
  const unboundedLoop = /(unbounded|infinite|without\s+limit|no\s+iteration\s+limit|no\s+step\s+limit|no\s+max\s+steps?|no\s+recursion\s+limit).{0,40}(loop|iteration|recursion|steps?)|(loop|recurse).{0,40}(forever|until\s+complete|until\s+done|without\s+limit)/i.test(t);
  if (explicitBadIteration || unboundedRetry || unboundedLoop) f.push(finding('AGT-031'));
  if (hasTools && !/(max_output_tokens|max_input_tokens|max_context_tokens|cost_cap|daily_cost_cap_usd|token_budget)/i.test(t)) f.push(finding('AGT-032'));
  if ((/(tool|function)/i.test(t) && !/(timeout|tool_timeout_sec|step_timeout|request_timeout)/i.test(t)) || /timeout\s*:\s*(0|null|none|-1)/i.test(t) || /no\s+timeout\s+(is\s+)?required|without\s+timeout|timeout\s+is\s+optional/i.test(t)) f.push(finding('AGT-033'));
  return f;
};
