// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { SENSITIVE_VERB_PATTERN, finding } from './helpers';

/**
 * Checks governance controls: missing kill switches, absent anomaly/loop detection, no content moderation layer, high-risk classification without required compliance artifacts, automated decisions without contest endpoints, and floating model aliases.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for governance and compliance gaps.
 */
export const runGovernanceRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const m75 = t.match(/risk_tier:\s*(high|critical)/i);
  const m75b = t.match(SENSITIVE_VERB_PATTERN);
  if ((m75 || (/(tools\s*:)/i.test(t) && m75b)) && !/(kill_switch|circuit_breaker|pause_on_anomaly|manual_override|break_glass|emergency_stop)/i.test(t)) f.push(finding('AGT-075', m75?.[0] ?? m75b?.[0]?.trim()));
  const m76 = t.match(/(loop|while|agent_loop|plan_and_execute)/i);
  if (m76 && /(cost_cap|daily_cost_cap_usd|token_budget)/i.test(t) && !/(loop_detection\.no_progress_steps|loop_detection\.same_error_streak|cost_velocity_per_minute|anomaly_detection\.z_score_threshold)/i.test(t)) f.push(finding('AGT-076', m76[0]));
  const m77 = t.match(/(user_message|chat|conversation|customer)/i);
  const m77b = t.match(/fail_closed:\s*false/i);
  if (m77 && (!/(openai_moderation|azure_content_safety|bedrock_guardrails|nemo_guardrails|lakera_guard|llm_guard|prompt_shields|topic_rails)/i.test(t) || m77b)) f.push(finding('AGT-077', m77b?.[0] ?? m77[0]));
  const m78 = t.match(/(compliance\.risk_tier:\s*(high|critical)|gdpr_applicable:\s*true|phi:\s*true|pci_scope:\s*true)/i);
  if (m78 && (!/(human_oversight|post_market_monitoring|transparency_notice)/i.test(t) || !/(dpia_id|fria_id|conformity_assessment_id)/i.test(t))) f.push(finding('AGT-078', m78[0]));
  const m79 = t.match(/(automated_decision_making:\s*true|name\s*:\s*["']?(approve|deny|grade|score|rank|disqualify|terminate_employment|reject_application))/i);
  if (m79 && !/(art22_contest_endpoint|appeal_url|human_review_endpoint|human_in_the_loop:\s*true)/i.test(t)) f.push(finding('AGT-079', m79[0]));
  const m80 = t.match(/model:\s*(gpt-4o|claude-3-5-sonnet-latest|gemini-pro|mistral-large-latest)\b/i);
  const m80b = t.match(/temperature:\s*[0-9]*\.[5-9][0-9]*/i);
  if ((/risk_tier:\s*(high|critical)|compliance/i.test(t) && m80) || (/(grade|score|rank|decision)/i.test(t) && m80b)) f.push(finding('AGT-080', m80?.[0] ?? m80b?.[0]));
  return f;
};
