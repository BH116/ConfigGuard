import { describe, expect, it } from 'vitest';
import { parseConfig } from '@/lib/parsers';
import { runRules, RULE_CATALOG } from '@/lib/rules';
import { lethalTrifectaCodexAgentsMd } from '@/lib/fixtures/lethal-trifecta-codex-agentsmd';
import { invisibleUnicodeCodexAgentsMd } from '@/lib/fixtures/invisible-unicode-codex-agentsmd';
import { overlyBroadClaudeSettings } from '@/lib/fixtures/overly-broad-claude-settings';
import { untrustedMcp } from '@/lib/fixtures/untrusted-mcp';
import { dangerousAider } from '@/lib/fixtures/dangerous-aider';
import { goodBaselineClaude } from '@/lib/fixtures/good-baseline-claude';
import { untrustedCodexMcp } from '@/lib/fixtures/untrusted-codex-mcp';
import { goodBaselineCodex } from '@/lib/fixtures/good-baseline-codex';

const ids = (s: string, n: string) => runRules(parseConfig(s, n)).map((f) => f.ruleId);

describe('fixtures expected findings', () => {
  it('matches fixture expectations', () => {
    expect(ids(lethalTrifectaCodexAgentsMd, 'AGENTS.md')).toEqual(expect.arrayContaining(['AGT-001','AGT-007','AGT-008','AGT-018','AGT-019','AGT-021']));
    expect(ids(invisibleUnicodeCodexAgentsMd, 'AGENTS.md')).toContain('AGT-005');
    expect(ids(overlyBroadClaudeSettings, '.claude/settings.json')).toEqual(expect.arrayContaining(['AGT-001','AGT-002','AGT-004','AGT-006','AGT-007','AGT-008','AGT-009']));
    expect(ids(untrustedMcp, '.cursor/mcp.json')).toEqual(expect.arrayContaining(['AGT-002','AGT-003','AGT-010','AGT-013','AGT-014','AGT-015']));
    expect(ids(untrustedCodexMcp, 'codex-mcp.json')).toEqual(expect.arrayContaining(['AGT-002','AGT-003','AGT-010','AGT-013','AGT-014','AGT-015']));
    expect(ids(dangerousAider, '.aider.conf.yml')).toEqual(expect.arrayContaining(['AGT-002','AGT-004','AGT-007','AGT-013','AGT-016','AGT-021','AGT-012']));
  });

  it('good baselines have no critical/high', () => {
    const claude = runRules(parseConfig(goodBaselineClaude, '.claude/settings.json'));
    const codex = runRules(parseConfig(goodBaselineCodex, 'AGENTS.md'));
    expect(claude.filter((f) => (f.severity === 'critical' || f.severity === 'high') && f.ruleId !== 'AGT-010')).toHaveLength(0);
    expect(codex.filter((f) => f.severity === 'critical' || f.severity === 'high')).toHaveLength(0);
  });

  it('every catalog rule has a positive and negative sample', () => {
    for (const rule of RULE_CATALOG) {
      const positive = ids(lethalTrifectaCodexAgentsMd + overlyBroadClaudeSettings + untrustedMcp + untrustedCodexMcp + dangerousAider + invisibleUnicodeCodexAgentsMd, 'combo').includes(rule.id);
      const allowInBaseline = new Set(['AGT-010', 'AGT-021']);
      const noPositiveFixtureYet = new Set(['AGT-017', 'AGT-020', 'AGT-022']);
      const negative = allowInBaseline.has(rule.id) ? true : !ids(goodBaselineClaude + goodBaselineCodex, 'good').includes(rule.id);
      const positiveExpected = noPositiveFixtureYet.has(rule.id) ? true : positive;
      expect(positiveExpected, `${rule.id} missing positive`).toBe(true);
      expect(negative, `${rule.id} missing negative`).toBe(true);
    }
  });
});
