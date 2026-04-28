import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

export const runDataPrivacyRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  if (/SELECT\s*\*\s*FROM|return_full[\s_]records?\s*[:=]\s*true|include_pii\s*[:=]\s*true|fields:\s*\[\s*"\*"\s*\]|return_all_records|fetch_all_fields/i.test(t)) f.push(finding('AGT-038'));
  if (/(users?|customers?|patients?|employees|accounts|ssn|patient|claim|transaction|billing|medical|hr_|finance_)/i.test(t) && /(query|read|fetch|get|select|retrieve)/i.test(t) && !/(field_allowlist|projection|select_fields|column_allowlist|redact_fields|allowed_columns)/i.test(t)) f.push(finding('AGT-039'));
  if (/(user_input|chat|message|query|prompt)/i.test(t) && !/(pii_redaction|pii_scrubber|presidio|dlp|mask_fields)/i.test(t)) f.push(finding('AGT-040'));
  if (/share_with_provider_for_training:\s*true|allowAnonymousTelemetry:\s*true|LANGCHAIN_TRACING_V2=true/i.test(t) || (/data\.level:\s*"all"/i.test(t) && !/(localhost|127\.0\.0\.1|\.internal)/i.test(t))) f.push(finding('AGT-041'));
  if (/(compliance\.risk_tier:\s*(high|critical)|gdpr_applicable:\s*true|phi:\s*true|pci_scope:\s*true)/i.test(t) && !/(data_residency|data_retention_days|right_to_delete|dsr_endpoint|consent_tracking)/i.test(t)) f.push(finding('AGT-042'));
  return f;
};
