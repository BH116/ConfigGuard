// ConfigGuard
// Public library entry point. Importable from plain Node.js (no DOM/browser
// globals): only depends on lib/parsers and lib/rules, which are pure
// string/data transforms.
import { parseConfig } from './parsers';
import { runRules, RULE_CATALOG } from './rules';
import type { Finding, FileType, ReferenceLink, Rule } from './rules/types';

export type { Finding, FileType, ReferenceLink, Rule };
export { RULE_CATALOG };
export { taxonomyByRule } from './taxonomy';

/**
 * Enum-like severity value object whose members are the severity strings used by Finding.severity.
 *
 * Severity is both a runtime value object (Severity.Critical === 'critical')
 * and a type alias for the same string union used by Finding.severity, so it
 * can be used as an enum-like API without breaking structural typing.
 */
export const Severity = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
  Info: 'info'
} as const;

/** String union of the five finding severity levels, from critical down to info. */
export type Severity = (typeof Severity)[keyof typeof Severity];

/** Count of findings produced by a scan, broken down by severity level. */
export interface ScanSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

/** Result of scanning a single config file: detected file type, findings, severity summary, and any parse error. */
export interface ScanResult {
  fileType: FileType;
  fileName?: string;
  findings: Finding[];
  summary: ScanSummary;
  parseError?: string;
}

const summarize = (findings: Finding[]): ScanSummary => {
  const summary: ScanSummary = { total: findings.length, critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const finding of findings) {
    summary[finding.severity] += 1;
  }
  return summary;
};

/**
 * Scan a raw config file's contents for AI agent misconfiguration findings.
 *
 * fileName and fileType are optional hints used to detect the config format
 * (e.g. AGENTS.md, .cursorrules, mcp.json); when omitted, format detection
 * falls back to content sniffing.
 *
 * @param input - Raw text contents of the config file to scan.
 * @param fileName - Optional file name hint used for config format detection.
 * @param fileType - Optional explicit config format; overrides detection unless set to 'auto'.
 * @returns A ScanResult with the detected file type, findings, severity summary, and any parse error.
 */
export const scan = (input: string, fileName?: string, fileType?: FileType): ScanResult => {
  const parsed = parseConfig(input, fileName, fileType);
  const findings = parsed.parseError ? [] : runRules(parsed);
  return {
    fileType: parsed.fileType,
    fileName: parsed.fileName,
    findings,
    summary: summarize(findings),
    parseError: parsed.parseError
  };
};
