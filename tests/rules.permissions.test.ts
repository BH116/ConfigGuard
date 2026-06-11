import { expect, it } from 'vitest';
import { runRules } from '@/lib/rules';
import { parseConfig } from '@/lib/parsers';
import { expectAllExcerptsNonEmpty } from './helpers';

const checkedIds = (content: string, name: string) => {
  const findings = runRules(parseConfig(content, name));
  expectAllExcerptsNonEmpty(findings);
  return findings.map((f) => f.ruleId);
};

it('detects broad filesystem permissions', () => {
  const ids = checkedIds('allow: ["Read(/**)", "WebFetch"]', '.claude/settings.json');
  expect(ids).toContain('AGT-006');
  expect(ids).toContain('AGT-008');
  const okIds = checkedIds('allow: ["Read(./src/**)", "WebFetch(domain:github.com)"] deny: ["Read(.env*)", "Bash(diff *.env*)"]', '.claude/settings.json');
  expect(okIds).not.toContain('AGT-006');
  expect(okIds).not.toContain('AGT-008');
});
