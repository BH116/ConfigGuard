// ConfigGuard
import YAML from 'yaml';
import { FileType, NormalizedAgentConfig } from '../rules/types';

/**
 * Best-effort structured parse of raw config text: tries JSON, then YAML, then gives up.
 *
 * This is format probing, not error handling. An empty object means "not
 * structured data"; raw text scanning still runs on the original content.
 *
 * @param raw - Raw config file text to parse.
 * @returns The parsed object, or an empty object when the text is neither valid JSON nor valid YAML.
 */
export const parseStructured = (raw: string): Record<string, unknown> => {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    try {
      return (YAML.parse(raw) ?? {}) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
};

/**
 * Normalizes structured config data into the common NormalizedAgentConfig shape used by all rules.
 *
 * @param kind - The detected config format (e.g. 'claude', 'cursor', 'mcp').
 * @param raw - Raw text contents of the config file.
 * @param structured - Optional pre-parsed structured data; when omitted, the raw text is parsed via parseStructured.
 * @returns A NormalizedAgentConfig with allow/deny lists, MCP servers, env, hooks, and additional directories extracted.
 */
export const normalize = (kind: FileType, raw: string, structured?: Record<string, unknown>): NormalizedAgentConfig => {
  const data = structured ?? parseStructured(raw);
  const allow = Array.isArray(data.allow) ? data.allow.map(String) : [];
  const deny = Array.isArray(data.deny) ? data.deny.map(String) : [];
  const env = (typeof data.env === 'object' && data.env ? data.env : {}) as Record<string, string>;
  const hooksObj = (typeof data.hooks === 'object' && data.hooks ? data.hooks : {}) as Record<string, unknown>;
  const hooks = Object.values(hooksObj).flatMap((v) => (Array.isArray(v) ? v.map(String) : [String(v)])).filter(Boolean);
  const additionalDirectories = Array.isArray(data.additionalDirectories) ? data.additionalDirectories.map(String) : [];
  const mcpServers = (typeof data.mcpServers === 'object' && data.mcpServers ? data.mcpServers : {}) as Record<string, unknown>;
  return { kind, raw, allowList: allow, denyList: deny, mcpServers, env, hooks, additionalDirectories };
};
