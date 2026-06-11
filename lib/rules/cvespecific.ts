// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

/**
 * Checks patterns tied to specific published CVEs and incidents: provider base URL overrides, repo-controlled hooks/settings, GitHub Actions AI agents with write permissions on untrusted triggers, and overly broad connected-agent scopes.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for known CVE-style misconfiguration patterns.
 */
export const runCveSpecificRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const fileName = parsed.fileName ?? '';
  const f: Finding[] = [];
  const m81 = t.match(/(["']?(ANTHROPIC_BASE_URL|OPENAI_BASE_URL|OPENAI_API_BASE|GOOGLE_API_BASE|AZURE_OPENAI_ENDPOINT)["']?\s*[=:]\s*["']?(https?:\/\/(?!(?:api\.anthropic\.com|api\.openai\.com|generativelanguage\.googleapis\.com|[a-z0-9-]+\.openai\.azure\.com)(?:[/"']|$))[^"'\s]+))/i);
  if (m81) f.push(finding('AGT-081', m81[0]));
  if (((/hooks\s*:/i.test(t) || /SessionStart|UserPromptSubmit|Stop|WorktreeCreate/i.test(t)) && /\.claude\/settings\.json$/i.test(fileName) && !/\.local\./i.test(fileName)) || /enableAllProjectMcpServers:\s*true/i.test(t) || (/runOn:\s*folderOpen/i.test(t) && /\.vscode\/tasks\.json$/i.test(fileName))) {
    const m82 = t.match(/enableAllProjectMcpServers:\s*true/i) ?? t.match(/runOn:\s*folderOpen/i) ?? t.match(/hooks\s*:/i) ?? t.match(/SessionStart|UserPromptSubmit|Stop|WorktreeCreate/i);
    f.push(finding('AGT-082', m82?.[0]));
  }
  const m83 = t.match(/on:\s*(pull_request_target|issues|issue_comment|discussion|discussion_comment)/i);
  if (m83 && /(contents:\s*write|permissions:\s*write-all|permissions:\s*\{[^}]*write[^}]*\})/i.test(t) && /(anthropics\/claude-code-action|google-github-actions\/run-gemini-cli|openai\/codex-action|github\/copilot-coding-agent|actions\/ai-inference)/i.test(t) && !/if:\s*github\.event\.pull_request\.head\.repo\.fork\s*==\s*false/i.test(t)) f.push(finding('AGT-083', m83[0]));
  const m84 = t.match(/agent_allowlist:\s*(any|\*)|listen_to:\s*entire_inbox|scope:\s*all_messages|\*\.microsoft\.com|\*\.cloudfront\.net|\*\.windows\.net/i);
  if (m84 && /connected_agents:\s*true/i.test(t)) f.push(finding('AGT-084', m84[0]));
  return f;
};
