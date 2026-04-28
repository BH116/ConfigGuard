<<<<<<< ours
export {};
=======
import { normalize, parseStructured } from './common';
export const parseClaudeConfig = (content: string) => normalize('claude', content, parseStructured(content));
>>>>>>> theirs
