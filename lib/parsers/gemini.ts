// ConfigGuard
import { normalize, parseStructured } from './common';
/**
 * Parses a Gemini config file into a normalized agent config.
 *
 * @param content - Raw text contents of the Gemini config file.
 * @returns A NormalizedAgentConfig with kind set to 'gemini'.
 */
export const parseGeminiConfig = (content: string) => normalize('gemini', content, parseStructured(content));
