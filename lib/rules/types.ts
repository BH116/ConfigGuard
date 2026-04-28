export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type FileType = 'cursor' | 'claude' | 'agents-md' | 'aider' | 'mcp' | 'auto';

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

export interface ParsedConfig {
  fileType: FileType;
  fileName?: string;
  content: string;
  json?: Record<string, unknown>;
  yaml?: Record<string, unknown>;
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
