import { describe, expect, it } from 'vitest';
import { parseConfig } from '@/lib/parsers';

describe('parser', () => {
  it('detects claude file type', () => {
    const parsed = parseConfig('{"defaultMode":"default"}', '.claude/settings.json');
    expect(parsed.fileType).toBe('claude');
  });
});
