import YAML from 'yaml';
import { FileType, NormalizedAgentConfig } from '../rules/types';

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
