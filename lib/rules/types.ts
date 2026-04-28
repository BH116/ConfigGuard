export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

<<<<<<< ours
export type FileType = 'cursor' | 'claude' | 'agents-md' | 'aider' | 'mcp' | 'auto';
=======
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
>>>>>>> theirs

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

<<<<<<< ours
=======
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

>>>>>>> theirs
export interface ParsedConfig {
  fileType: FileType;
  fileName?: string;
  content: string;
  json?: Record<string, unknown>;
  yaml?: Record<string, unknown>;
<<<<<<< ours
=======
  normalized: NormalizedAgentConfig;
>>>>>>> theirs
}

export interface Finding {
  ruleId: string;
  severity: Severity;
  title: string;
  description: string;
  excerpt: string;
  remediation: string;
  references: ReferenceLink[];
}
