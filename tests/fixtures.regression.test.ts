// ConfigGuard
// CI regression test: scans the sample agent configs in test/fixtures/ and
// asserts (a) the scanner never crashes on them, (b) benign configs produce
// no critical findings, and (c) malicious configs (one per major OWASP LLM
// Top 10 2025 category) each produce at least one high or critical finding,
// including the specific rule the fixture was designed to trigger.
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { scan } from '../lib/index';

const FIXTURES_ROOT = join(process.cwd(), 'test', 'fixtures');

const readFixtures = (dir: string): { name: string; content: string }[] =>
  readdirSync(join(FIXTURES_ROOT, dir)).map((name) => ({
    name,
    content: readFileSync(join(FIXTURES_ROOT, dir, name), 'utf8')
  }));

describe('benign fixtures', () => {
  const fixtures = readFixtures('benign');

  it('found at least 5 benign fixtures', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(5);
  });

  it.each(fixtures)('scans $name without crashing and with no critical findings', ({ name, content }) => {
    const result = scan(content, name);
    expect(result.parseError).toBeUndefined();
    expect(result.summary.critical).toBe(0);
    const criticalIds = result.findings.filter((f) => f.severity === 'critical').map((f) => f.ruleId);
    expect(criticalIds).toEqual([]);
  });
});

describe('malicious fixtures (one per OWASP LLM Top 10 2025 category)', () => {
  const expectedRuleByFile: Record<string, string> = {
    'llm01-prompt-injection.md': 'AGT-046',
    'llm02-sensitive-info-disclosure.env': 'AGT-002',
    'llm03-supply-chain-requirements.txt': 'AGT-064',
    'llm04-memory-poisoning.md': 'AGT-149',
    'llm05-improper-output-handling.md': 'AGT-072',
    'llm06-excessive-agency.md': 'AGT-001',
    'llm07-system-prompt-leakage.md': 'AGT-125',
    'llm08-vector-store.yaml': 'AGT-054',
    'llm09-misinformation.md': 'AGT-143',
    'llm10-unbounded-consumption.yaml': 'AGT-030'
  };

  const fixtures = readFixtures('malicious');

  it('found at least 5 malicious fixtures', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(5);
  });

  it('covers at least 5 distinct OWASP LLM Top 10 categories', () => {
    const categories = new Set(Object.keys(expectedRuleByFile).map((name) => name.slice(0, 'llmNN'.length)));
    expect(categories.size).toBeGreaterThanOrEqual(5);
  });

  it.each(fixtures)('scans $name without crashing and produces a high/critical finding', ({ name, content }) => {
    const result = scan(content, name);
    expect(result.parseError).toBeUndefined();
    expect(result.findings.length).toBeGreaterThan(0);

    const severities = result.findings.map((f) => f.severity);
    expect(severities).toEqual(expect.arrayContaining([expect.stringMatching(/^(critical|high)$/)]));

    const expectedRuleId = expectedRuleByFile[name];
    if (expectedRuleId) {
      const ruleIds = result.findings.map((f) => f.ruleId);
      expect(ruleIds).toContain(expectedRuleId);
    }
  });
});
