// ConfigGuard
import { normalize, parseStructured } from './common';
/**
 * Parses a Claude Code config file into a normalized agent config.
 *
 * @param content - Raw text contents of the Claude config file.
 * @returns A NormalizedAgentConfig with kind set to 'claude'.
 */
export const parseClaudeConfig = (content: string) => normalize('claude', content, parseStructured(content));
