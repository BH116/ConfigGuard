import { ParsedConfig, Finding } from './types';
import { finding } from './helpers';

const unicodeSmuggleRegex = /[\u{E0000}-\u{E007F}\u{FE00}-\u{FE0F}\u{E0100}-\u{E01EF}\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/u;

export const runUnicodeRules = (parsed: ParsedConfig): Finding[] =>
  unicodeSmuggleRegex.test(parsed.content) ? [finding('AGT-005', 'Hidden unicode characters present')] : [];
