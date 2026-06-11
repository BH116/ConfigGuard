// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

/**
 * Checks data privacy controls: SELECT star or full-record returns, missing field allowlists on sensitive tables, absent PII redaction, provider training opt-in or vendor telemetry, and missing residency/retention policies.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for data privacy and minimization gaps.
 */
export const runDataPrivacyRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const m38 = t.match(/SELECT\s*\*\s*FROM|return_full[\s_]records?\s*[:=]\s*true|include_pii\s*[:=]\s*true|fields:\s*\[\s*"\*"\s*\]|return_all_records|fetch_all_fields/i);
  if (m38) f.push(finding('AGT-038', m38[0]));
  const m39 = t.match(/(users?|customers?|patients?|employees|accounts|ssn|patient|claim|transaction|billing|medical|hr_|finance_)/i);
  if (m39 && /(query|read|fetch|get|select|retrieve)/i.test(t) && !/(field_allowlist|projection|select_fields|column_allowlist|redact_fields|allowed_columns)/i.test(t)) f.push(finding('AGT-039', m39[0]));
  const m40 = t.match(/(user_input|chat|message|query|prompt)/i);
  if (m40 && !/(pii_redaction|pii_scrubber|presidio|dlp|mask_fields)/i.test(t)) f.push(finding('AGT-040', m40[0]));
  const m41 = t.match(/(share_with_provider_for_training\s*:\s*true|"share_with_provider_for_training"\s*:\s*true|allow_training\s*:\s*true|opt_in_training\s*:\s*true|allowAnonymousTelemetry:\s*true|LANGCHAIN_TRACING_V2\s*=\s*true|LANGSMITH_HIDE_INPUTS\s*=\s*false)/i);
  const m41b = t.match(/data\.level:\s*["']all["']/i);
  if (m41 || (m41b && !/(localhost|127\.0\.0\.1|\.internal)/i.test(t))) f.push(finding('AGT-041', m41?.[0] ?? m41b?.[0]));
  const m42 = t.match(/(compliance\.risk_tier:\s*(high|critical)|gdpr_applicable:\s*true|phi:\s*true|pci_scope:\s*true)/i);
  if (m42 && !/(data_residency|data_retention_days|right_to_delete|dsr_endpoint|consent_tracking)/i.test(t)) f.push(finding('AGT-042', m42[0]));
  return f;
};
