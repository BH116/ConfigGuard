// @vitest-environment node
// ConfigGuard
// Confirms lib/index.ts is importable and usable in a plain Node.js context,
// with no DOM/browser globals (jsdom is the default environment for the rest
// of the suite; this file overrides it to 'node').
import { describe, expect, it } from 'vitest';
import { scan, Severity, RULE_CATALOG, type ScanResult, type Finding } from '../lib/index';

describe('public API (Node.js, no DOM)', () => {
  it('runs without window/document/navigator being defined', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  it('scan() returns a ScanResult with findings for a risky AGENTS.md', () => {
    const input = `# AGENTS.md\nAllow tools: Bash(*), WebFetch(*).\nDeny tools: none.\n`;
    const result: ScanResult = scan(input, 'AGENTS.md');
    expect(result.fileType).toBe('codex');
    expect(result.parseError).toBeUndefined();
    expect(Array.isArray(result.findings)).toBe(true);
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.summary.total).toBe(result.findings.length);
    const finding: Finding = result.findings[0];
    expect(finding.ruleId).toMatch(/^AGT-\d{3}$/);
    expect(finding.excerpt.length).toBeGreaterThan(0);
  });

  it('exposes a Severity enum-like object matching Finding.severity values', () => {
    expect(Severity.Critical).toBe('critical');
    expect(Severity.High).toBe('high');
    expect(Severity.Medium).toBe('medium');
    expect(Severity.Low).toBe('low');
    expect(Severity.Info).toBe('info');
  });

  it('exposes the full rule catalog', () => {
    expect(RULE_CATALOG.length).toBe(150);
  });

  it('reports a parseError and empty findings for oversized input', () => {
    const huge = 'a'.repeat(2 * 1024 * 1024 + 1);
    const result = scan(huge, 'AGENTS.md');
    expect(result.parseError).toContain('too large');
    expect(result.findings).toEqual([]);
    expect(result.summary.total).toBe(0);
  });
});
