import { expect, it } from 'vitest';
import { runRules } from '@/lib/rules';
import { parseConfig } from '@/lib/parsers';

it('detects broad filesystem permissions', () => {
  const ids = runRules(parseConfig('allow: ["Read(/**)", "WebFetch"]', '.claude/settings.json')).map((f) => f.ruleId);
  expect(ids).toContain('AGT-006');
  expect(ids).toContain('AGT-008');
  const okIds = runRules(parseConfig('allow: ["Read(./src/**)", "WebFetch(domain:github.com)"] deny: ["Read(.env*)", "Bash(diff *.env*)"]', '.claude/settings.json')).map((f) => f.ruleId);
  expect(okIds).not.toContain('AGT-006');
  expect(okIds).not.toContain('AGT-008');
});
