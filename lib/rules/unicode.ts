import { Finding, ParsedConfig } from './types';
import { finding, hasAnsiEscapes, hasInvisibleUnicode } from './helpers';

export const runUnicodeRules = (parsed: ParsedConfig): Finding[] => {
  const applies = !parsed.fileName || /(windsurfrules|aider\.conf\.yml|agents\.md|cursorrules|claude|codex)/i.test(parsed.fileName);
  if (!applies) return [];
  if (hasInvisibleUnicode(parsed.content) || hasAnsiEscapes(parsed.content)) return [finding('AGT-005', 'Invisible Unicode or ANSI escape content detected')];
  return [];
};
