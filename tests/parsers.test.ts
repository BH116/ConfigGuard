import { describe, expect, it } from 'vitest';
import { parseConfig } from '@/lib/parsers';

describe('parser', () => {
<<<<<<< ours
  it('detects claude file type', () => {
    const parsed = parseConfig('{"defaultMode":"default"}', '.claude/settings.json');
    expect(parsed.fileType).toBe('claude');
=======
  it('detects codex AGENTS.md with precedence', () => {
    const parsed = parseConfig('github.copilot true', 'AGENTS.md');
    expect(parsed.fileType).toBe('codex');
  });

  it('detects new agents', () => {
    expect(parseConfig('{"github.copilot.enable":true}', '.vscode/settings.json').fileType).toBe('copilot');
    expect(parseConfig('{"models":[]}', '.continuerc.json').fileType).toBe('continue');
    expect(parseConfig('cascade mode', '.windsurfrules').fileType).toBe('windsurf');
    expect(parseConfig('gemini-2 model', 'GEMINI.md').fileType).toBe('gemini');
>>>>>>> theirs
  });
});
