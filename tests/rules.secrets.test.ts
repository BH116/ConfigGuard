import { expect, it } from 'vitest';
import { runRules } from '@/lib/rules';
import { parseConfig } from '@/lib/parsers';
import { expectAllExcerptsNonEmpty } from './helpers';

const checkedIds = (content: string) => {
  const findings = runRules(parseConfig(content));
  expectAllExcerptsNonEmpty(findings);
  return findings.map((f) => f.ruleId);
};

it('detects secret patterns', () => {
  expect(checkedIds('token: ghp_abcdabcdabcdabcdabcdabcdabcdabcdabcd')).toContain('AGT-002');
  expect(checkedIds('token: ${GITHUB_TOKEN}')).not.toContain('AGT-002');
});
