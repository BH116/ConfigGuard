<<<<<<< ours
export {};
=======
import { normalize, parseStructured } from './common';
export const parseCursorConfig = (content: string) => normalize('cursor', content, parseStructured(content));
>>>>>>> theirs
