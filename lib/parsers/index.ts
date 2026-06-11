// ConfigGuard
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

/**
 * Hard input size cap in bytes (2MB), enforced before any YAML/JSON parsing or regex scanning.
 *
 * The UI enforces the same limit (components/auditor.tsx), but library callers
 * bypass the UI, so the cap must live here too.
 */
export const MAX_INPUT_BYTES = 2 * 1024 * 1024;

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

const EMPTY_NORMALIZED = { kind: 'auto' as FileType, raw: '', allowList: [], denyList: [], mcpServers: {}, env: {}, hooks: [], additionalDirectories: [] };

/**
 * Parses raw config text into a ParsedConfig, validating size, detecting the format, and normalizing the data.
 *
 * @param content - Raw text contents of the config file.
 * @param fileName - Optional file name hint used for format detection.
 * @param selectedType - Optional explicit config format; overrides detection unless set to 'auto'.
 * @returns A ParsedConfig with detected file type, raw content, optional JSON/YAML parses, normalized data, and any parse error.
 */
export const parseConfig = (content: string, fileName?: string, selectedType?: FileType): ParsedConfig => {
  let safe: string;
  try {
    safe = textSchema.parse(content);
  } catch {
    return { fileType: 'auto', fileName, content: '', normalized: EMPTY_NORMALIZED, parseError: 'This file is empty or could not be read as text. Provide a non-empty config file and try again.' };
  }

  if (new TextEncoder().encode(safe).length > MAX_INPUT_BYTES) {
    return { fileType: 'auto', fileName, content: '', normalized: EMPTY_NORMALIZED, parseError: 'This file is too large to scan (max 2MB). Split the config into smaller files and scan them individually.' };
  }

  const fileType = selectedType && selectedType !== 'auto' ? selectedType : detectType(fileName, safe);
  let json: Record<string, unknown> | undefined;
  let yaml: Record<string, unknown> | undefined;
  // Format probing, not error handling: most inputs are valid in at most one
  // of JSON/YAML, and markdown configs are valid in neither. Failures fall
  // through to raw text scanning by design.
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
