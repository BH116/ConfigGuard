// ConfigGuard
import { normalize, parseStructured } from './common';
/**
 * Parses an MCP server config file into a normalized agent config.
 *
 * @param content - Raw text contents of the MCP config file.
 * @returns A NormalizedAgentConfig with kind set to 'mcp'.
 */
export const parseMcpConfig = (content: string) => normalize('mcp', content, parseStructured(content));
