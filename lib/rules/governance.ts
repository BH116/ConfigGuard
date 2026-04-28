import { Finding, ParsedConfig } from './types';
import { SENSITIVE_VERB_PATTERN, finding } from './helpers';

export const runGovernanceRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  if ((/risk_tier:\s*(high|critical)/i.test(t) || (/(tools\s*:)/i.test(t) && SENSITIVE_VERB_PATTERN.test(t))) && !/(kill_switch|circuit_breaker|pause_on_anomaly|manual_override|break_glass|emergency_stop)/i.test(t)) f.push(finding('AGT-075'));
  if (/(loop|while|agent_loop|plan_and_execute)/i.test(t) && /(cost_cap|daily_cost_cap_usd|token_budget)/i.test(t) && !/(loop_detection\.no_progress_steps|loop_detection\.same_error_streak|cost_velocity_per_minute|anomaly_detection\.z_score_threshold)/i.test(t)) f.push(finding('AGT-076'));
  if (/(user_message|chat|conversation|customer)/i.test(t) && (!/(openai_moderation|azure_content_safety|bedrock_guardrails|nemo_guardrails|lakera_guard|llm_guard|prompt_shields|topic_rails)/i.test(t) || /fail_closed:\s*false/i.test(t))) f.push(finding('AGT-077'));
  if (/(compliance\.risk_tier:\s*(high|critical)|gdpr_applicable:\s*true|phi:\s*true|pci_scope:\s*true)/i.test(t) && (!/(human_oversight|post_market_monitoring|transparency_notice)/i.test(t) || !/(dpia_id|fria_id|conformity_assessment_id)/i.test(t))) f.push(finding('AGT-078'));
  if (/(automated_decision_making:\s*true|name\s*:\s*["']?(approve|deny|grade|score|rank|disqualify|terminate_employment|reject_application))/i.test(t) && !/(art22_contest_endpoint|appeal_url|human_review_endpoint|human_in_the_loop:\s*true)/i.test(t)) f.push(finding('AGT-079'));
  if ((/risk_tier:\s*(high|critical)|compliance/i.test(t) && /model:\s*(gpt-4o|claude-3-5-sonnet-latest|gemini-pro|mistral-large-latest)\b/i.test(t)) || (/(grade|score|rank|decision)/i.test(t) && /temperature:\s*[0-9]*\.[5-9][0-9]*/i.test(t))) f.push(finding('AGT-080'));
  return f;
};
