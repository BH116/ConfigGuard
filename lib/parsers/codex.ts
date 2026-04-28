import { normalize, parseStructured } from './common';

export const parseCodexConfig = (content: string) => {
  const structured = parseStructured(content);
  return normalize('codex', content, structured);
};
