import { RULE_CATALOG } from './catalog';
import { Finding } from './types';

/**
 * Escapes regex metacharacters in a string so it can be embedded literally in a RegExp.
 *
 * @param s - The string to escape.
 * @returns The string with all regex special characters backslash-escaped.
 */
export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Looks up a rule definition in RULE_CATALOG by its ID.
 *
 * @param id - The rule ID (e.g. 'AGT-001').
 * @returns The matching Rule; throws if the ID is not in the catalog.
 */
export const getRule = (id: string) => {
  const rule = RULE_CATALOG.find((r) => r.id === id);
  if (!rule) throw new Error(`Missing rule ${id}`);
  return rule;
};

/**
 * Builds a Finding for a rule ID, copying severity, title, references, and remediation from the catalog.
 *
 * @param id - The rule ID to build a finding for.
 * @param excerpt - Optional matched text excerpt; defaults to the rule title.
 * @param description - Optional description override; defaults to the rule's catalog description.
 * @returns A fully populated Finding for the given rule.
 */
export const finding = (id: string, excerpt?: string, description?: string): Finding => {
  const rule = getRule(id);
  return {
    ruleId: id,
    severity: rule.severity,
    title: rule.title,
    version: rule.version,
    description: description ?? rule.description,
    excerpt: excerpt ?? rule.title,
    remediation: rule.remediation,
    references: rule.references
  };
};

/**
 * Tests text against a list of regex terms and reports whether enough of them match.
 *
 * @param text - The text to scan.
 * @param terms - The regex patterns to test against the text.
 * @param threshold - Minimum number of patterns that must match.
 * @returns The first matching pattern when the threshold is met, otherwise null.
 */
export const scanTerms = (text: string, terms: RegExp[], threshold: number): RegExp | null => {
  const matched = terms.filter((r) => r.test(text));
  return matched.length >= threshold ? matched[0] : null;
};

/**
 * Checks whether the text contains any of the given needles, case-insensitively.
 *
 * @param text - The text to search.
 * @param needles - Substrings to look for.
 * @returns True if at least one needle is found in the text.
 */
export const includesAny = (text: string, needles: string[]) => needles.some((n) => text.toLowerCase().includes(n.toLowerCase()));

/**
 * Finds the first line of the content that contains any of the given needles, case-insensitively.
 *
 * @param content - The multi-line text to search.
 * @param needles - Substrings to look for in each line.
 * @returns The trimmed matching line, or undefined when no line matches.
 */
export const firstMatchingLine = (content: string, needles: string[]) => {
  const lines = content.split('\n');
  for (const line of lines) {
    const hit = needles.find((needle) => line.toLowerCase().includes(needle.toLowerCase()));
    if (hit) return line.trim();
  }
  return undefined;
};

/**
 * Returns the first non-empty line of the content, trimmed.
 *
 * @param content - The multi-line text to scan.
 * @returns The first trimmed non-empty line, or undefined when the content is blank.
 */
export const firstNonEmptyLine = (content: string) =>
  content
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 0);


/**
 * Computes the Shannon entropy of a string in bits per character, used to spot high-entropy secret values.
 *
 * @param s - The string to measure.
 * @returns The entropy in bits per character (higher means more random).
 */
export const shannonEntropy = (s: string): number => {
  const counts: Record<string, number> = {};
  for (const c of s) counts[c] = (counts[c] || 0) + 1;
  const len = s.length;
  let entropy = 0;
  for (const count of Object.values(counts)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
};

/**
 * Detects invisible or steganographic Unicode characters (zero-width, bidi controls, tags, variation selectors).
 *
 * @param text - The text to inspect.
 * @returns True if the text contains invisible Unicode characters.
 */
export const hasInvisibleUnicode = (text: string): boolean => {
  return /[​-‏‪-‮⁠-⁯﻿\u{E0000}-\u{E007F}\u{FE00}-\u{FE0F}\u{E0100}-\u{E01EF}]/u.test(text);
};

/**
 * Detects ANSI terminal escape sequences that could hide or manipulate displayed content.
 *
 * @param text - The text to inspect.
 * @returns True if the text contains ANSI escape sequences.
 */
export const hasAnsiEscapes = (text: string): boolean => {
  return /\x1b\[|\[|\\033\[/.test(text);
};

/**
 * Checks whether a version reference is mutable (e.g. @latest, @main, @master, or a bare major version tag).
 *
 * @param ref - The version reference string to check.
 * @returns True if the reference can move over time rather than being pinned.
 */
export const isMutableRef = (ref: string): boolean => {
  return /^(@latest|@main|@master|@HEAD|@v\d+$|latest$|main$|master$)/i.test(ref);
};

/**
 * Recursively collects every string value found in an object, array, or primitive, up to a depth limit.
 *
 * @param obj - The value to walk.
 * @param maxDepth - Maximum recursion depth (default 6) to guard against deeply nested input.
 * @returns A flat array of all string values found.
 */
export const extractAllStrings = (obj: unknown, maxDepth = 6): string[] => {
  if (maxDepth <= 0) return [];
  if (typeof obj === 'string') return [obj];
  if (Array.isArray(obj)) return obj.flatMap((v) => extractAllStrings(v, maxDepth - 1));
  if (obj && typeof obj === 'object') return Object.values(obj).flatMap((v) => extractAllStrings(v, maxDepth - 1));
  return [];
};

/**
 * Heuristically determines whether a file path points at test, fixture, example, or local-only content.
 *
 * @param filePath - The file path to check; undefined returns false.
 * @returns True if the path looks like test or fixture material rather than a real config.
 */
export const isTestOrFixturePath = (filePath?: string): boolean => {
  if (!filePath) return false;
  return /fixtures|examples|__tests__|\.test\.|\.spec\.|\.local\.|\.example\./i.test(filePath);
};

/**
 * Heuristically detects whether config content describes a production or high-risk deployment.
 *
 * @param content - The config text to inspect.
 * @returns True if the content declares a high/critical risk tier, production env, or regulated data flags.
 */
export const isProductionConfig = (content: string): boolean => {
  return /risk_tier:\s*(high|critical)|env:\s*(prod|production)|gdpr_applicable:\s*true|phi:\s*true|pci_scope:\s*true/i.test(content);
};

/** Regex matching tool or action names that perform sensitive, destructive, or externally visible operations. */
export const SENSITIVE_VERB_PATTERN = /(?:^|["'\s])(delete|drop|truncate|purge|send_email|send_message|email|post_to|publish|tweet|transfer|pay|charge|refund|wire|purchase|order|grant_access|revoke_access|rotate_secret|create_user|change_password|disable_account|terminate|deploy|kubectl_apply|exec|shell_exec|run_code|eval_code|apply_patch|git_push|unlock|open_door|start_engine)/i;

/** Keywords indicating a human-in-the-loop approval gate is configured. */
export const HITL_KEYWORDS = ['requires_approval', 'needs_approval', 'human_approval', 'interrupt_on', 'confirmation_required', 'require_confirmation', 'approval_required', 'hitl', 'human_in_the_loop', 'manual_review'];
/** Keywords indicating some form of rate limiting or quota is configured. */
export const RATE_LIMIT_KEYWORDS = ['rate_limit', 'requests_per_minute', 'rpm', 'tpm', 'quota', 'throttle', 'max_requests'];
/** Keywords indicating audit logging, telemetry, or tracing is configured. */
export const AUDIT_LOG_KEYWORDS = ['audit_log', 'tool_call_log', 'decision_log', 'telemetry', 'tracing', 'otel', 'otlp_endpoint'];

/** Precompiled case-insensitive regex over HITL_KEYWORDS, built once at module load instead of per scan. */
export const HITL_KEYWORDS_RE = new RegExp(HITL_KEYWORDS.join('|'), 'i');
/** Precompiled case-insensitive regex over RATE_LIMIT_KEYWORDS, built once at module load instead of per scan. */
export const RATE_LIMIT_KEYWORDS_RE = new RegExp(RATE_LIMIT_KEYWORDS.join('|'), 'i');
/** Precompiled case-insensitive regex over AUDIT_LOG_KEYWORDS, built once at module load instead of per scan. */
export const AUDIT_LOG_KEYWORDS_RE = new RegExp(AUDIT_LOG_KEYWORDS.join('|'), 'i');
