import { expect, it } from 'vitest';
import { parseConfig } from '@/lib/parsers';
import { runRules } from '@/lib/rules';
import { invisibleUnicodeCodexAgentsMd } from '@/lib/fixtures/invisible-unicode-codex-agentsmd';
import { expectAllExcerptsNonEmpty } from './helpers';

const checkedIds = (content: string, name: string) => {
  const findings = runRules(parseConfig(content, name));
  expectAllExcerptsNonEmpty(findings);
  return findings.map((f) => f.ruleId);
};

it('detects hidden unicode', () => {
  const ids = checkedIds(invisibleUnicodeCodexAgentsMd, 'AGENTS.md');
  expect(ids).toContain('AGT-005');
  const clean = checkedIds('Run tests only.', 'AGENTS.md');
  expect(clean).not.toContain('AGT-005');
});
