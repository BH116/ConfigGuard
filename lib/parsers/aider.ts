// ConfigGuard
import { normalize, parseStructured } from './common';
/**
 * Parses an Aider config file into a normalized agent config.
 *
 * @param content - Raw text contents of the Aider config file.
 * @returns A NormalizedAgentConfig with kind set to 'aider'.
 */
export const parseAiderConfig = (content: string) => normalize('aider', content, parseStructured(content));
