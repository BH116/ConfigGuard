// ConfigGuard
import { normalize, parseStructured } from './common';
/**
 * Parses a Windsurf config file into a normalized agent config.
 *
 * @param content - Raw text contents of the Windsurf config file.
 * @returns A NormalizedAgentConfig with kind set to 'windsurf'.
 */
export const parseWindsurfConfig = (content: string) => normalize('windsurf', content, parseStructured(content));
