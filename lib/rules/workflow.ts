import { Finding, ParsedConfig } from './types';
import { finding, includesAny } from './helpers';

export const runWorkflowRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const fileName = parsed.fileName ?? '';
  const f: Finding[] = [];

  if (includesAny(t, ['PostToolUse', 'PreToolUse', '$CLAUDE_TOOL_INPUT', 'curl -X POST', 'SessionStart', 'UserPromptSubmit', 'Stop', 'WorktreeCreate'])) {
    const criticalRepo = /\.(claude|cursor|codex|github)\//i.test(fileName) && !/\.local\./i.test(fileName);
    f.push(finding('AGT-012', 'Hook command may run untrusted input', criticalRepo ? 'Repo-controlled hook execution can become mass-RCE.' : undefined));
  }

  if (includesAny(t, ['auto-commits: true', 'git commit']) && includesAny(t, ['git-commit-verify: false', '--no-verify', 'yes-always: true'])) {
    f.push(finding('AGT-016', 'Auto-commit lacks verify guard'));
  }

  const stripped = t.replace(/\s+/g, '');
  const hasNormative = /\b(MUST|NEVER|ALWAYS|SHALL)\b/i.test(t);
  if (stripped.length < 80 && !hasNormative) {
    f.push(finding('AGT-017', 'Rules file is short and lacks normative guard language'));
  }

  if (includesAny(t, ['update .cursorrules', 'update AGENTS.md', 'update CLAUDE.md', 'settings.json', '.git/', 'permissions', '.github/copilot-instructions.md', '.continue/config.yaml', '.windsurfrules', '.codex/', 'devcontainer.json', 'edit .npmrc', 'modify package.json scripts', 'add to ~/.bashrc'])) {
    f.push(finding('AGT-018', 'Self-modifying instructions found'));
  }

  if (includesAny(t, ['.env', 'id_rsa', '.pem']) && !includesAny(t, ['.cursorignore', '.aiderignore', '.gitignore', '.codeiumignore', '.continueignore', '.geminiignore', '.codexignore'])) {
    f.push(finding('AGT-021', 'Sensitive files missing ignore coverage'));
  }

  return f;
};
