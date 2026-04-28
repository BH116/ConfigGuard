import { z } from 'zod';
import YAML from 'yaml';
import { ParsedConfig, FileType } from '../rules/types';
import { parseCodexConfig } from './codex';
import { parseCursorConfig } from './cursor';
import { parseClaudeConfig } from './claude';
import { parseAiderConfig } from './aider';
import { parseMcpConfig } from './mcp';
import { parseCopilotConfig } from './copilot';
import { parseContinueConfig } from './continue';
import { parseWindsurfConfig } from './windsurf';
import { parseGeminiConfig } from './gemini';

const textSchema = z.string().min(1);

const detectType = (fileName?: string, content = ''): FileType => {
  const f = (fileName ?? '').toLowerCase();
  const c = content.toLowerCase();
  if (f.endsWith('agents.md')) return 'codex';
  if (f.includes('copilot-instructions') || f.includes('.instructions.md') || (f.includes('settings.json') && c.includes('github.copilot'))) return 'copilot';
  if (f.includes('.continue') || f.includes('.continuerc') || c.includes('continue.dev') || c.includes('allowanonymoustelemetry') || c.includes('"models":')) return 'continue';
  if (f.includes('.windsurf') || f.includes('windsurfrules') || f.includes('global_rules.md') || c.includes('windsurf') || c.includes('cascade')) return 'windsurf';
  if (f.includes('gemini') || c.includes('googlegenerativeai') || c.includes('gemini-pro') || c.includes('gemini-2')) return 'gemini';
  if (f.includes('aider')) return 'aider';
  if (f.includes('claude')) return 'claude';
  if (f.includes('cursor') || f.includes('cursorrules')) return 'cursor';
  if (f.includes('mcp')) return 'mcp';
  if (c.includes('mcpservers')) return 'mcp';
  return 'auto';
};

export const parseConfig = (content: string, fileName?: string, selectedType?: FileType): ParsedConfig => {
  const safe = textSchema.parse(content);
  const fileType = selectedType && selectedType !== 'auto' ? selectedType : detectType(fileName, safe);
  let json: Record<string, unknown> | undefined;
  let yaml: Record<string, unknown> | undefined;
  try { json = JSON.parse(safe) as Record<string, unknown>; } catch {}
  try { yaml = YAML.parse(safe) as Record<string, unknown>; } catch {}

  const normalized =
    fileType === 'codex' ? parseCodexConfig(safe) :
    fileType === 'cursor' ? parseCursorConfig(safe) :
    fileType === 'claude' ? parseClaudeConfig(safe) :
    fileType === 'aider' ? parseAiderConfig(safe) :
    fileType === 'mcp' ? parseMcpConfig(safe) :
    fileType === 'copilot' ? parseCopilotConfig(safe) :
    fileType === 'continue' ? parseContinueConfig(safe) :
    fileType === 'windsurf' ? parseWindsurfConfig(safe) :
    fileType === 'gemini' ? parseGeminiConfig(safe) :
    parseCodexConfig(safe);

  return { fileType, fileName, content: safe, json, yaml, normalized };
};
