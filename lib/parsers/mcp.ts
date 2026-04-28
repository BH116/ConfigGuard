import { normalize, parseStructured } from './common';
export const parseMcpConfig = (content: string) => normalize('mcp', content, parseStructured(content));
