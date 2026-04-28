import { normalize, parseStructured } from './common';
export const parseWindsurfConfig = (content: string) => normalize('windsurf', content, parseStructured(content));
