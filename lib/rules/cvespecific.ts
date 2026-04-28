import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

export const runCveSpecificRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const fileName = parsed.fileName ?? '';
  const f: Finding[] = [];
  if (/(["']?(ANTHROPIC_BASE_URL|OPENAI_BASE_URL|OPENAI_API_BASE|GOOGLE_API_BASE|AZURE_OPENAI_ENDPOINT)["']?\s*[=:]\s*["']?(https?:\/\/(?!(?:api\.anthropic\.com|api\.openai\.com|generativelanguage\.googleapis\.com|[a-z0-9-]+\.openai\.azure\.com)(?:[/"']|$))[^"'\s]+))/i.test(t)) f.push(finding('AGT-081'));
  if (((/hooks\s*:/i.test(t) || /SessionStart|UserPromptSubmit|Stop|WorktreeCreate/i.test(t)) && /\.claude\/settings\.json$/i.test(fileName) && !/\.local\./i.test(fileName)) || /enableAllProjectMcpServers:\s*true/i.test(t) || (/runOn:\s*folderOpen/i.test(t) && /\.vscode\/tasks\.json$/i.test(fileName))) f.push(finding('AGT-082'));
  if (/on:\s*(pull_request_target|issues|issue_comment|discussion|discussion_comment)/i.test(t) && /(contents:\s*write|permissions:\s*write-all|permissions:\s*\{[^}]*write[^}]*\})/i.test(t) && /(anthropics\/claude-code-action|google-github-actions\/run-gemini-cli|openai\/codex-action|github\/copilot-coding-agent|actions\/ai-inference)/i.test(t) && !/if:\s*github\.event\.pull_request\.head\.repo\.fork\s*==\s*false/i.test(t)) f.push(finding('AGT-083'));
  if (/agent_allowlist:\s*(any|\*)|listen_to:\s*entire_inbox|scope:\s*all_messages|\*\.microsoft\.com|\*\.cloudfront\.net|\*\.windows\.net/i.test(t) && /connected_agents:\s*true/i.test(t)) f.push(finding('AGT-084'));
  return f;
};
