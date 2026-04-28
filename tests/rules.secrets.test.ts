import { expect, it } from 'vitest';
import { runRules } from '@/lib/rules';
import { parseConfig } from '@/lib/parsers';

it('detects secret patterns', () => {
  expect(runRules(parseConfig('token: ghp_fakeplaceholdertoken0000000000000')).map((f) => f.ruleId)).toContain('AGT-002');
  expect(runRules(parseConfig('token: ${GITHUB_TOKEN}')).map((f) => f.ruleId)).not.toContain('AGT-002');
});
