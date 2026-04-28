import { normalize, parseStructured } from './common';
export const parseAiderConfig = (content: string) => normalize('aider', content, parseStructured(content));
