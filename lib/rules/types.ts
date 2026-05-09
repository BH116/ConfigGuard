export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

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

export interface ReferenceLink {
  label: string;
  url: string;
}

export interface Rule {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  fileTypes: FileType[];
  references: ReferenceLink[];
  remediation: string;
}

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

export interface ParsedConfig {
  fileType: FileType;
  fileName?: string;
  content: string;
  json?: Record<string, unknown>;
  yaml?: Record<string, unknown>;
  normalized: NormalizedAgentConfig;
  parseError?: string;
}

export interface Finding {
  ruleId: string;
  severity: Severity;
  title: string;
  description: string;
  excerpt?: string;
  remediation: string;
  references: ReferenceLink[];
}
