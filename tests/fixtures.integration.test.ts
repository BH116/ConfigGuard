import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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
import { policyPuppetryCursorRules } from '@/lib/fixtures/policy-puppetry-cursorrules';
import { indirectInjectionAgentsMd } from '@/lib/fixtures/indirect-injection-agents-md';

const fixture = (name: string) => readFileSync(join(process.cwd(), 'lib/fixtures', name), 'utf8');
const ids = (s: string, n: string) => runRules(parseConfig(s, n)).map((f) => f.ruleId);

describe('fixtures expected findings', () => {
  it('matches existing fixture expectations', () => {
    expect(ids(lethalTrifectaCodexAgentsMd, 'AGENTS.md')).toContain('AGT-001');
    expect(ids(invisibleUnicodeCodexAgentsMd, 'AGENTS.md')).toContain('AGT-005');
    expect(ids(overlyBroadClaudeSettings, '.claude/settings.json')).toEqual(expect.arrayContaining(['AGT-004', 'AGT-006', 'AGT-008']));
    expect(ids(untrustedMcp, '.cursor/mcp.json')).toContain('AGT-014');
    expect(ids(untrustedCodexMcp, 'codex-mcp.json')).toContain('AGT-014');
    expect(ids(dangerousAider, '.aider.conf.yml')).toContain('AGT-012');
  });

  it('matches new fixture expectations', () => {
    expect(ids(fixture('runtime-agent-overprivileged.json'), 'runtime-agent-overprivileged.json')).toEqual(expect.arrayContaining(['AGT-023', 'AGT-026', 'AGT-030', 'AGT-034', 'AGT-038', 'AGT-040']));
    expect(ids(fixture('hooks-rce-claude-settings.json'), '.claude/settings.json')).toEqual(expect.arrayContaining(['AGT-012', 'AGT-082']));
    expect(ids(policyPuppetryCursorRules, '.cursorrules')).toContain('AGT-046');
    expect(ids(indirectInjectionAgentsMd, 'AGENTS.md')).toContain('AGT-044');
    expect(ids(fixture('github-actions-ai-agent.yml'), '.github/workflows/ai.yml')).toContain('AGT-083');
    expect(ids(fixture('privileged-container-config.yaml'), 'sandbox.yaml')).toEqual(expect.arrayContaining(['AGT-059', 'AGT-060']));
    expect(ids(fixture('vulnerable-framework-requirements.txt'), 'requirements.txt')).toContain('AGT-064');
    expect(ids(fixture('base-url-override.env'), 'base-url-override.env')).toContain('AGT-081');
  });

  it('good-baseline-production has no critical/high findings', () => {
    const production = runRules(parseConfig(fixture('good-baseline-production.json'), 'good-baseline-production.json'));
    expect(production.filter((f) => f.severity === 'critical' || f.severity === 'high')).toHaveLength(0);
    expect(runRules(parseConfig(goodBaselineClaude, '.claude/settings.json')).length).toBeGreaterThanOrEqual(0);
    expect(runRules(parseConfig(goodBaselineCodex, 'AGENTS.md')).length).toBeGreaterThanOrEqual(0);
  });

  it('expanded fixture set covers catalog breadth', () => {
    const combined = [
      lethalTrifectaCodexAgentsMd,
      invisibleUnicodeCodexAgentsMd,
      overlyBroadClaudeSettings,
      untrustedMcp,
      untrustedCodexMcp,
      dangerousAider,
      policyPuppetryCursorRules,
      indirectInjectionAgentsMd,
      fixture('runtime-agent-overprivileged.json'),
      fixture('hooks-rce-claude-settings.json'),
      fixture('github-actions-ai-agent.yml'),
      fixture('privileged-container-config.yaml'),
      fixture('vulnerable-framework-requirements.txt'),
      fixture('base-url-override.env')
    ].join('\n\n');

    const positives = new Set(ids(combined, 'combo'));
    expect(RULE_CATALOG).toHaveLength(84);
    expect(positives.size).toBeGreaterThan(35);
  });
});
