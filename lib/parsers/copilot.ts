// ConfigGuard
import { normalize, parseStructured } from './common';
/**
 * Parses a GitHub Copilot config file into a normalized agent config.
 *
 * @param content - Raw text contents of the Copilot config file.
 * @returns A NormalizedAgentConfig with kind set to 'copilot'.
 */
export const parseCopilotConfig = (content: string) => normalize('copilot', content, parseStructured(content));
