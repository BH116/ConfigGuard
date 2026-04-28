import { z } from 'zod';
import YAML from 'yaml';
import { ParsedConfig, FileType } from '../rules/types';

const textSchema = z.string().min(1);

const detectType = (fileName?: string, content = ''): FileType => {
  const f = (fileName ?? '').toLowerCase();
  if (f.includes('aider')) return 'aider';
  if (f.includes('agent')) return 'agents-md';
  if (f.includes('claude')) return 'claude';
  if (f.includes('mcp')) return 'mcp';
  if (f.includes('cursor') || f.includes('cursorrules')) return 'cursor';
  if (/mcpServers|defaultMode|WebFetch|Bash/.test(content)) return 'claude';
  return 'auto';
};

export const parseConfig = (content: string, fileName?: string, selectedType?: FileType): ParsedConfig => {
  const safe = textSchema.parse(content);
  const fileType = selectedType && selectedType !== 'auto' ? selectedType : detectType(fileName, safe);
  let json: Record<string, unknown> | undefined;
  let yaml: Record<string, unknown> | undefined;
  try { json = JSON.parse(safe) as Record<string, unknown>; } catch {}
  try { yaml = YAML.parse(safe) as Record<string, unknown>; } catch {}
  return { fileType, fileName, content: safe, json, yaml };
};
