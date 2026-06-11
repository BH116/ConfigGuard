// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { finding, hasAnsiEscapes, hasInvisibleUnicode } from './helpers';

/**
 * Checks instruction files for hidden content: invisible Unicode characters and ANSI escape sequences that can smuggle instructions past human review.
 *
 * @param parsed - The parsed config to scan.
 * @returns A single AGT-005 finding when hidden content is detected, otherwise an empty array.
 */
export const runUnicodeRules = (parsed: ParsedConfig): Finding[] => {
  const applies = !parsed.fileName || /(windsurfrules|aider\.conf\.yml|agents\.md|cursorrules|claude|codex)/i.test(parsed.fileName);
  if (!applies) return [];
  if (hasInvisibleUnicode(parsed.content) || hasAnsiEscapes(parsed.content)) return [finding('AGT-005', 'Invisible Unicode or ANSI escape content detected')];
  return [];
};
