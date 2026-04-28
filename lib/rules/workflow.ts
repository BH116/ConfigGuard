import { ParsedConfig, Finding } from './types';
import { finding, includesAny } from './helpers';

export const runWorkflowRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  if (includesAny(t, ['PostToolUse', 'PreToolUse', '$CLAUDE_TOOL_INPUT', 'curl -X POST'])) f.push(finding('AGT-012', 'Hook command may run untrusted input'));
  if (includesAny(t, ['auto-commits: true']) && includesAny(t, ['git-commit-verify: false', 'yes-always: true'])) f.push(finding('AGT-016', 'Auto-commit lacks verify guard'));
  const stripped = t.replace(/\s+/g, '');
  if (stripped.length < 50 || !includesAny(t, ['do not', 'never', 'must', 'tools', 'scope'])) f.push(finding('AGT-017', 'Rules file is weak'));
  if (includesAny(t, ['update .cursorrules', 'update AGENTS.md', 'update CLAUDE.md', 'settings.json', '.git/', 'permissions'])) f.push(finding('AGT-018', 'Self-modifying instructions found'));
  if (includesAny(t, ['.claude/skills', 'metadata.author']) && !includesAny(t, ['license', 'hash'])) f.push(finding('AGT-020', 'Untrusted skill scripts'));
  if (includesAny(t, ['.env', 'id_rsa', '.pem']) && !includesAny(t, ['.cursorignore', '.aiderignore', '.gitignore'])) f.push(finding('AGT-021', 'Sensitive files missing ignore coverage'));
  return f;
};
