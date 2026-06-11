import { expect } from 'vitest';
import type { Finding } from '@/lib/rules/types';

// Rule IDs known to produce empty excerpts (genuine gaps in lib/, kept here so
// the suite stays green while the gap remains visible). Currently none.
export const KNOWN_EMPTY_EXCERPT: ReadonlySet<string> = new Set<string>([]);

export const expectAllExcerptsNonEmpty = (findings: Finding[]) => {
  for (const f of findings) {
    if (KNOWN_EMPTY_EXCERPT.has(f.ruleId)) continue;
    expect(f.excerpt, `excerpt empty for ${f.ruleId}`).toBeTruthy();
    expect(f.excerpt.trim().length, `excerpt blank for ${f.ruleId}`).toBeGreaterThan(0);
  }
};
