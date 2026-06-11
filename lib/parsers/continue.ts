// ConfigGuard
import { normalize, parseStructured } from './common';
/**
 * Parses a Continue config file into a normalized agent config.
 *
 * @param content - Raw text contents of the Continue config file.
 * @returns A NormalizedAgentConfig with kind set to 'continue'.
 */
export const parseContinueConfig = (content: string) => normalize('continue', content, parseStructured(content));
