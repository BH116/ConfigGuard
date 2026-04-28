import { describe, expect, it } from 'vitest';
import { parseConfig } from '@/lib/parsers';
import { runRules, RULE_CATALOG } from '@/lib/rules';
<<<<<<< ours
import { lethalTrifectaCursorRules } from '@/lib/fixtures/lethal-trifecta-cursorrules';
import { invisibleUnicodeAgentsMd } from '@/lib/fixtures/invisible-unicode-agentsmd';
=======
import { lethalTrifectaCodexAgentsMd } from '@/lib/fixtures/lethal-trifecta-codex-agentsmd';
import { invisibleUnicodeCodexAgentsMd } from '@/lib/fixtures/invisible-unicode-codex-agentsmd';
>>>>>>> theirs
import { overlyBroadClaudeSettings } from '@/lib/fixtures/overly-broad-claude-settings';
import { untrustedMcp } from '@/lib/fixtures/untrusted-mcp';
import { dangerousAider } from '@/lib/fixtures/dangerous-aider';
import { goodBaselineClaude } from '@/lib/fixtures/good-baseline-claude';
<<<<<<< ours
=======
import { untrustedCodexMcp } from '@/lib/fixtures/untrusted-codex-mcp';
import { goodBaselineCodex } from '@/lib/fixtures/good-baseline-codex';
>>>>>>> theirs

const ids = (s: string, n: string) => runRules(parseConfig(s, n)).map((f) => f.ruleId);

describe('fixtures expected findings', () => {
  it('matches fixture expectations', () => {
<<<<<<< ours
    expect(ids(lethalTrifectaCursorRules, '.cursorrules')).toEqual(expect.arrayContaining(['AGT-001','AGT-006','AGT-007','AGT-008','AGT-018']));
    expect(ids(invisibleUnicodeAgentsMd, 'AGENTS.md')).toContain('AGT-005');
    expect(ids(overlyBroadClaudeSettings, '.claude/settings.json')).toEqual(expect.arrayContaining(['AGT-001','AGT-002','AGT-004','AGT-006','AGT-007','AGT-008','AGT-009','AGT-022']));
    expect(ids(untrustedMcp, '.cursor/mcp.json')).toEqual(expect.arrayContaining(['AGT-002','AGT-003','AGT-010','AGT-011','AGT-013','AGT-014','AGT-015']));
    expect(ids(dangerousAider, '.aider.conf.yml')).toEqual(expect.arrayContaining(['AGT-002','AGT-004','AGT-006','AGT-007','AGT-013','AGT-016','AGT-021','AGT-012']));
  });

  it('good baseline has no critical/high', () => {
    const findings = runRules(parseConfig(goodBaselineClaude, '.claude/settings.json'));
    expect(findings.filter((f) => f.severity === 'critical' || f.severity === 'high')).toHaveLength(0);
=======
    expect(ids(lethalTrifectaCodexAgentsMd, 'AGENTS.md')).toEqual(expect.arrayContaining(['AGT-001','AGT-006','AGT-007','AGT-008','AGT-009','AGT-018','AGT-019']));
    expect(ids(invisibleUnicodeCodexAgentsMd, 'AGENTS.md')).toContain('AGT-005');
    expect(ids(overlyBroadClaudeSettings, '.claude/settings.json')).toEqual(expect.arrayContaining(['AGT-001','AGT-002','AGT-004','AGT-006','AGT-007','AGT-008','AGT-009','AGT-022']));
    expect(ids(untrustedMcp, '.cursor/mcp.json')).toEqual(expect.arrayContaining(['AGT-002','AGT-003','AGT-010','AGT-011','AGT-013','AGT-014','AGT-015']));
    expect(ids(untrustedCodexMcp, 'codex-mcp.json')).toEqual(expect.arrayContaining(['AGT-002','AGT-003','AGT-010','AGT-011','AGT-013','AGT-014','AGT-015']));
    expect(ids(dangerousAider, '.aider.conf.yml')).toEqual(expect.arrayContaining(['AGT-002','AGT-004','AGT-006','AGT-007','AGT-013','AGT-016','AGT-021','AGT-012']));
  });

  it('good baselines have no critical/high', () => {
    const claude = runRules(parseConfig(goodBaselineClaude, '.claude/settings.json'));
    const codex = runRules(parseConfig(goodBaselineCodex, 'AGENTS.md'));
    expect(claude.filter((f) => f.severity === 'critical' || f.severity === 'high')).toHaveLength(0);
    expect(codex.filter((f) => f.severity === 'critical' || f.severity === 'high')).toHaveLength(0);
>>>>>>> theirs
  });

  it('every catalog rule has a positive and negative sample', () => {
    for (const rule of RULE_CATALOG) {
<<<<<<< ours
      const positive = ids(lethalTrifectaCursorRules + overlyBroadClaudeSettings + untrustedMcp + dangerousAider + invisibleUnicodeAgentsMd, 'combo').includes(rule.id);
      const negative = !ids(goodBaselineClaude, 'good').includes(rule.id);
=======
      const positive = ids(lethalTrifectaCodexAgentsMd + overlyBroadClaudeSettings + untrustedMcp + untrustedCodexMcp + dangerousAider + invisibleUnicodeCodexAgentsMd, 'combo').includes(rule.id);
      const negative = !ids(goodBaselineClaude + goodBaselineCodex, 'good').includes(rule.id);
>>>>>>> theirs
      expect(positive, `${rule.id} missing positive`).toBe(true);
      expect(negative, `${rule.id} missing negative`).toBe(true);
    }
  });
});
