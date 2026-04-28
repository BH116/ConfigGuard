import { expect, it } from 'vitest';
import { runRules } from '@/lib/rules';
import { parseConfig } from '@/lib/parsers';
import { lethalTrifectaCursorRules } from '@/lib/fixtures/lethal-trifecta-cursorrules';

it('detects lethal trifecta composite', () => {
  const ids = runRules(parseConfig(lethalTrifectaCursorRules, '.cursorrules')).map((f) => f.ruleId);
  expect(ids).toContain('AGT-001');
  expect(runRules(parseConfig('Read(./src/**) only', '.cursorrules')).map((f) => f.ruleId)).not.toContain('AGT-001');
});
