// ConfigGuard
import { normalize, parseStructured } from './common';

/**
 * Parses a Codex or AGENTS.md style config file into a normalized agent config.
 *
 * @param content - Raw text contents of the Codex config file.
 * @returns A NormalizedAgentConfig with kind set to 'codex'.
 */
export const parseCodexConfig = (content: string) => {
  const structured = parseStructured(content);
  return normalize('codex', content, structured);
};
