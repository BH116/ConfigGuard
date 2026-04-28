import { normalize, parseStructured } from './common';
export const parseCopilotConfig = (content: string) => normalize('copilot', content, parseStructured(content));
