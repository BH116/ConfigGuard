// ConfigGuard
import { normalize, parseStructured } from './common';
/**
 * Parses a Cursor config file into a normalized agent config.
 *
 * @param content - Raw text contents of the Cursor config file.
 * @returns A NormalizedAgentConfig with kind set to 'cursor'.
 */
export const parseCursorConfig = (content: string) => normalize('cursor', content, parseStructured(content));
