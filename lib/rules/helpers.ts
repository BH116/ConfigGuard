import { RULE_CATALOG } from './catalog';
import { Finding } from './types';

export const getRule = (id: string) => {
  const rule = RULE_CATALOG.find((r) => r.id === id);
  if (!rule) throw new Error(`Missing rule ${id}`);
  return rule;
};

export const finding = (id: string, excerpt?: string, description?: string): Finding => {
  const rule = getRule(id);
  return {
    ruleId: id,
    severity: rule.severity,
    title: rule.title,
    description: description ?? rule.description,
    excerpt,
    remediation: rule.remediation,
    references: rule.references
  };
};

export const includesAny = (text: string, needles: string[]) => needles.some((n) => text.toLowerCase().includes(n.toLowerCase()));

export const firstMatchingLine = (content: string, needles: string[]) => {
  const lines = content.split('\n');
  for (const line of lines) {
    const hit = needles.find((needle) => line.toLowerCase().includes(needle.toLowerCase()));
    if (hit) return line.trim();
  }
  return undefined;
};

export const hasInvisibleUnicode = (text: string): boolean => {
  return /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u{E0000}-\u{E007F}\u{FE00}-\u{FE0F}\u{E0100}-\u{E01EF}]/u.test(text);
};

export const hasAnsiEscapes = (text: string): boolean => {
  return /\x1b\[|\u001b\[|\\033\[/.test(text);
};

export const isMutableRef = (ref: string): boolean => {
  return /^(@latest|@main|@master|@HEAD|@v\d+$|latest$|main$|master$)/i.test(ref);
};

export const extractAllStrings = (obj: unknown, maxDepth = 6): string[] => {
  if (maxDepth <= 0) return [];
  if (typeof obj === 'string') return [obj];
  if (Array.isArray(obj)) return obj.flatMap((v) => extractAllStrings(v, maxDepth - 1));
  if (obj && typeof obj === 'object') return Object.values(obj).flatMap((v) => extractAllStrings(v, maxDepth - 1));
  return [];
};

export const isTestOrFixturePath = (filePath?: string): boolean => {
  if (!filePath) return false;
  return /fixtures|examples|__tests__|\.test\.|\.spec\.|\.local\.|\.example\./i.test(filePath);
};

export const isProductionConfig = (content: string): boolean => {
  return /risk_tier:\s*(high|critical)|env:\s*(prod|production)|gdpr_applicable:\s*true|phi:\s*true|pci_scope:\s*true/i.test(content);
};

export const SENSITIVE_VERB_PATTERN = /(?:^|["'\s])(delete|drop|truncate|purge|send_email|send_message|email|post_to|publish|tweet|transfer|pay|charge|refund|wire|purchase|order|grant_access|revoke_access|rotate_secret|create_user|change_password|disable_account|terminate|deploy|kubectl_apply|exec|shell_exec|run_code|eval_code|apply_patch|git_push|unlock|open_door|start_engine)/i;

export const HITL_KEYWORDS = ['requires_approval', 'needs_approval', 'human_approval', 'interrupt_on', 'confirmation_required', 'require_confirmation', 'approval_required', 'hitl', 'human_in_the_loop', 'manual_review'];
export const RATE_LIMIT_KEYWORDS = ['rate_limit', 'requests_per_minute', 'rpm', 'tpm', 'quota', 'throttle', 'max_requests'];
export const AUDIT_LOG_KEYWORDS = ['audit_log', 'tool_call_log', 'decision_log', 'telemetry', 'tracing', 'otel', 'otlp_endpoint'];
