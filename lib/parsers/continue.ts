import { normalize, parseStructured } from './common';
export const parseContinueConfig = (content: string) => normalize('continue', content, parseStructured(content));
