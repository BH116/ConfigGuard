// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { AUDIT_LOG_KEYWORDS_RE, finding, firstMatchingLine, firstNonEmptyLine, isProductionConfig } from './helpers';

/**
 * Checks audit and observability controls: missing or disabled audit logging, insufficient log retention, prompt logging without PII redaction, and absent correlation or trace IDs.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for audit logging and traceability gaps.
 */
export const runAuditRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const hasTools = /("?tools"?\s*:|"?mcpServers"?\s*:)/i.test(t);
  const hasAuditKeywords = AUDIT_LOG_KEYWORDS_RE.test(t);
  const mAuditDisabled = t.match(/["']?(audit_log|tool_call_log|logging)["']?\s*:\s*(false|disabled|off|null|none|0)\b/i);
  const explicitAuditDisabled = Boolean(mAuditDisabled);
  const mLogLevel = t.match(/["']?log_level["']?\s*:\s*["']?(error|critical|none|off)["']?/i);
  const loweredLogLevel = Boolean(mLogLevel) && !/["']?log_level["']?\s*:\s*["']?(debug|info|warn|warning|trace)["']?/i.test(t);
  if (hasTools && (!hasAuditKeywords || explicitAuditDisabled || loweredLogLevel)) f.push(finding('AGT-034', mAuditDisabled?.[0] ?? (loweredLogLevel ? mLogLevel?.[0] : undefined) ?? firstMatchingLine(t, ['tools', 'mcpServers']) ?? firstNonEmptyLine(t)));
  const mRetention = t.match(/log_retention_days:\s*([1-9]|[12][0-9]|30)\b/i);
  const mRiskTier = t.match(/risk_tier:\s*(high|critical)|compliance\s*:/i);
  if (mRetention || (mRiskTier && !/log_retention_days\s*:/i.test(t))) f.push(finding('AGT-035', mRetention?.[0] ?? mRiskTier?.[0]));
  const m36 = t.match(/(log_prompts:\s*true|LANGSMITH_HIDE_INPUTS=false|LANGCHAIN_HIDE_OUTPUTS=false|data\.level:\s*"all")/i);
  if (m36 && !/(pii_scrubber|pii_redaction|redact_fields|presidio|dlp)/i.test(t)) f.push(finding('AGT-036', m36[0]));
  if (t.length > 0 && !/(correlation_id|request_id|session_id|trace_id|span_id)/i.test(t)) f.push(finding('AGT-037', firstNonEmptyLine(t), isProductionConfig(t) ? 'High-risk profile without trace IDs.' : undefined));
  return f;
};
