import { describe, expect, it } from 'vitest';
import { parseConfig } from '@/lib/parsers';
import { runRules, RULE_CATALOG } from '@/lib/rules';
import { lethalTrifectaCursorRules } from '@/lib/fixtures/lethal-trifecta-cursorrules';
import { invisibleUnicodeAgentsMd } from '@/lib/fixtures/invisible-unicode-agentsmd';
import { overlyBroadClaudeSettings } from '@/lib/fixtures/overly-broad-claude-settings';
import { untrustedMcp } from '@/lib/fixtures/untrusted-mcp';
import { dangerousAider } from '@/lib/fixtures/dangerous-aider';
import { goodBaselineClaude } from '@/lib/fixtures/good-baseline-claude';

const ids = (s: string, n: string) => runRules(parseConfig(s, n)).map((f) => f.ruleId);

describe('fixtures expected findings', () => {
  it('matches fixture expectations', () => {
    expect(ids(lethalTrifectaCursorRules, '.cursorrules')).toEqual(expect.arrayContaining(['AGT-001','AGT-006','AGT-007','AGT-008','AGT-018']));
    expect(ids(invisibleUnicodeAgentsMd, 'AGENTS.md')).toContain('AGT-005');
    expect(ids(overlyBroadClaudeSettings, '.claude/settings.json')).toEqual(expect.arrayContaining(['AGT-001','AGT-002','AGT-004','AGT-006','AGT-007','AGT-008','AGT-009','AGT-022']));
    expect(ids(untrustedMcp, '.cursor/mcp.json')).toEqual(expect.arrayContaining(['AGT-002','AGT-003','AGT-010','AGT-011','AGT-013','AGT-014','AGT-015']));
    expect(ids(dangerousAider, '.aider.conf.yml')).toEqual(expect.arrayContaining(['AGT-002','AGT-004','AGT-006','AGT-007','AGT-013','AGT-016','AGT-021','AGT-012']));
  });

  it('good baseline has no critical/high', () => {
    const findings = runRules(parseConfig(goodBaselineClaude, '.claude/settings.json'));
    expect(findings.filter((f) => f.severity === 'critical' || f.severity === 'high')).toHaveLength(0);
  });

  it('every catalog rule has a positive and negative sample', () => {
    for (const rule of RULE_CATALOG) {
      const positive = ids(lethalTrifectaCursorRules + overlyBroadClaudeSettings + untrustedMcp + dangerousAider + invisibleUnicodeAgentsMd, 'combo').includes(rule.id);
      const negative = !ids(goodBaselineClaude, 'good').includes(rule.id);
      expect(positive, `${rule.id} missing positive`).toBe(true);
      expect(negative, `${rule.id} missing negative`).toBe(true);
    }
  });
});
