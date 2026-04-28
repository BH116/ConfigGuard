import { normalize, parseStructured } from './common';
export const parseGeminiConfig = (content: string) => normalize('gemini', content, parseStructured(content));
