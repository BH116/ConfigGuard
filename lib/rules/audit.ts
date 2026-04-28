import { Finding, ParsedConfig } from './types';
import { AUDIT_LOG_KEYWORDS, finding, isProductionConfig } from './helpers';

export const runAuditRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const hasTools = /("?tools"?\s*:|"?mcpServers"?\s*:)/i.test(t);
  const hasAuditKeywords = new RegExp(AUDIT_LOG_KEYWORDS.join('|'), 'i').test(t);
  const explicitAuditDisabled = /["']?(audit_log|tool_call_log|logging)["']?\s*:\s*(false|disabled|off|null|none|0)\b/i.test(t);
  const loweredLogLevel = /["']?log_level["']?\s*:\s*["']?(error|critical|none|off)["']?/i.test(t) && !/["']?log_level["']?\s*:\s*["']?(debug|info|warn|warning|trace)["']?/i.test(t);
  if (hasTools && (!hasAuditKeywords || explicitAuditDisabled || loweredLogLevel)) f.push(finding('AGT-034'));
  if (/log_retention_days:\s*([1-9]|[12][0-9]|30)\b/i.test(t) || ((/risk_tier:\s*(high|critical)|compliance\s*:/i.test(t)) && !/log_retention_days\s*:/i.test(t))) f.push(finding('AGT-035'));
  if (/(log_prompts:\s*true|LANGSMITH_HIDE_INPUTS=false|LANGCHAIN_HIDE_OUTPUTS=false|data\.level:\s*"all")/i.test(t) && !/(pii_scrubber|pii_redaction|redact_fields|presidio|dlp)/i.test(t)) f.push(finding('AGT-036'));
  if (t.length > 0 && !/(correlation_id|request_id|session_id|trace_id|span_id)/i.test(t)) f.push(finding('AGT-037', undefined, isProductionConfig(t) ? 'High-risk profile without trace IDs.' : undefined));
  return f;
};
