import { expect, it } from 'vitest';
import { parseConfig } from '@/lib/parsers';
import { runRules } from '@/lib/rules';
<<<<<<< ours
import { invisibleUnicodeAgentsMd } from '@/lib/fixtures/invisible-unicode-agentsmd';

it('detects hidden unicode', () => {
  const ids = runRules(parseConfig(invisibleUnicodeAgentsMd, 'AGENTS.md')).map((f) => f.ruleId);
=======
import { invisibleUnicodeCodexAgentsMd } from '@/lib/fixtures/invisible-unicode-codex-agentsmd';

it('detects hidden unicode', () => {
  const ids = runRules(parseConfig(invisibleUnicodeCodexAgentsMd, 'AGENTS.md')).map((f) => f.ruleId);
>>>>>>> theirs
  expect(ids).toContain('AGT-005');
  const clean = runRules(parseConfig('Run tests only.', 'AGENTS.md')).map((f) => f.ruleId);
  expect(clean).not.toContain('AGT-005');
});
