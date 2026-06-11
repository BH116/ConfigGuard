/** String union of the five finding severity levels, from critical down to info. */
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/** String union of the supported agent config formats, plus 'auto' for content-based detection. */
export type FileType =
  | 'codex'
  | 'cursor'
  | 'copilot'
  | 'aider'
  | 'continue'
  | 'windsurf'
  | 'gemini'
  | 'claude'
  | 'mcp'
  | 'auto';

/** A labeled URL pointing to external reference material for a rule, such as OWASP or CWE pages. */
export interface ReferenceLink {
  label: string;
  url: string;
}

/** Definition of a single detection rule: its ID, title, severity, description, applicable file types, references, and remediation guidance. */
export interface Rule {
  id: string;
  title: string;
  severity: Severity;
  version: number;
  description: string;
  fileTypes: FileType[];
  references: ReferenceLink[];
  remediation: string;
}

/** Config data normalized into a common shape across all supported formats: allow/deny lists, MCP servers, env vars, hooks, and extra directories. */
export interface NormalizedAgentConfig {
  kind: FileType;
  raw: string;
  allowList: string[];
  denyList: string[];
  mcpServers: Record<string, unknown>;
  env: Record<string, string>;
  hooks: string[];
  additionalDirectories: string[];
}

/** A fully parsed config file: detected type, raw content, optional JSON/YAML parses, normalized data, and any parse error. */
export interface ParsedConfig {
  fileType: FileType;
  fileName?: string;
  content: string;
  json?: Record<string, unknown>;
  yaml?: Record<string, unknown>;
  normalized: NormalizedAgentConfig;
  parseError?: string;
}

/** A single detection result produced by a rule, including severity, description, the matched excerpt, and remediation guidance. */
export interface Finding {
  ruleId: string;
  severity: Severity;
  title: string;
  version: number;
  description: string;
  excerpt: string;
  remediation: string;
  references: ReferenceLink[];
}
