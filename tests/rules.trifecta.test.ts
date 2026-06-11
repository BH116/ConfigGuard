import { expect, it } from 'vitest';
import { runRules } from '@/lib/rules';
import { parseConfig } from '@/lib/parsers';
import { lethalTrifectaCursorRules } from '@/lib/fixtures/lethal-trifecta-cursorrules';
import { expectAllExcerptsNonEmpty } from './helpers';

const checkedIds = (content: string, name: string) => {
  const findings = runRules(parseConfig(content, name));
  expectAllExcerptsNonEmpty(findings);
  return findings.map((f) => f.ruleId);
};

it('detects lethal trifecta composite', () => {
  const ids = checkedIds(lethalTrifectaCursorRules, '.cursorrules');
  expect(ids).toContain('AGT-001');
  expect(checkedIds('Read(./src/**) only', '.cursorrules')).not.toContain('AGT-001');
});
