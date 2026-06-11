// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { finding, firstMatchingLine, firstNonEmptyLine, RATE_LIMIT_KEYWORDS_RE } from './helpers';

/**
 * Checks resource consumption limits: missing or unlimited rate limits, unbounded iterations or retries, absent token/cost budgets, and missing tool execution timeouts.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for rate limiting and resource budget gaps.
 */
export const runRatelimitRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const hasTools = /("?tools"?\s*:|"?mcpServers"?\s*:|"?functions"?\s*: )/i.test(t);
  const toolsLine = firstMatchingLine(t, ['tools', 'mcpServers', 'functions']) ?? firstNonEmptyLine(t);
  const m30 = t.match(/(rate_limit|rpm|tpm|quota|throttle)\s*:\s*(unlimited|infinite|null|none|-1)/i);
  if (hasTools && (!RATE_LIMIT_KEYWORDS_RE.test(t) || m30)) f.push(finding('AGT-030', m30?.[0] ?? toolsLine));
  const mBadIteration = t.match(/max_iterations\s*[:=]\s*(-1|0|null|undefined)|max_iterations\s*[:=]\s*\d{4,}|max_steps\s*[:=]\s*(-1|0|null|undefined)|max_recursion_depth\s*[:=]\s*(?:[1-9][0-9]{3,}|-1|0|null)|max_subagent_depth\s*[:=]\s*(-1|0|null|undefined)/i);
  const mRetry = t.match(/(retry|retries|try\s+again).{0,40}(forever|until\s+success|until\s+they\s+succeed|without\s+limit|unbounded|indefinitely)|infinite\s+retries|keep\s+retrying/i);
  const mLoop = t.match(/(unbounded|infinite|without\s+limit|no\s+iteration\s+limit|no\s+step\s+limit|no\s+max\s+steps?|no\s+recursion\s+limit).{0,40}(loop|iteration|recursion|steps?)|(loop|recurse).{0,40}(forever|until\s+complete|until\s+done|without\s+limit)/i);
  if (mBadIteration || mRetry || mLoop) f.push(finding('AGT-031', mBadIteration?.[0] ?? mRetry?.[0] ?? mLoop?.[0]));
  if (hasTools && !/(max_output_tokens|max_input_tokens|max_context_tokens|cost_cap|daily_cost_cap_usd|token_budget)/i.test(t)) f.push(finding('AGT-032', toolsLine));
  const m33b = t.match(/timeout\s*:\s*(0|null|none|-1)/i);
  const m33c = t.match(/no\s+timeout\s+(is\s+)?required|without\s+timeout|timeout\s+is\s+optional/i);
  if ((/(tool|function)/i.test(t) && !/(timeout|tool_timeout_sec|step_timeout|request_timeout)/i.test(t)) || m33b || m33c) f.push(finding('AGT-033', m33b?.[0] ?? m33c?.[0] ?? firstMatchingLine(t, ['tool', 'function']) ?? firstNonEmptyLine(t)));
  return f;
};
