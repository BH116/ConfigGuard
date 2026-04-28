import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

export const runSandboxRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  if (/privileged:\s*true|network:\s*host|--net=host|pid:\s*host|ipc:\s*host|userns:\s*host|cap_add.*(ALL|SYS_ADMIN|NET_ADMIN|SYS_PTRACE)|seccomp:\s*unconfined|apparmor:\s*unconfined/i.test(t)) f.push(finding('AGT-059'));
  if (/"\/"|\/var\/run\/docker\.sock|\/etc|\/root|\/proc|\/sys|\/dev|~|\$HOME|C:\\|%USERPROFILE%/i.test(t)) f.push(finding('AGT-060'));
  if (/(PythonREPLTool|code_interpreter|bash_tool|shell_exec|exec_python|jupyter_kernel)/i.test(t) && !/isolation:\s*(gvisor|kata|firecracker|wasm|microvm|sandbox)/i.test(t)) f.push(finding('AGT-061'));
  if (/(network:\s*true|network_access:\s*true)/i.test(t) && (!/(egress_allowlist|allowed_domains|network\.allowedDomains|WebFetch\(domain:)/i.test(t) || /allowed_domains:\s*\[\s*("\*"|)\s*\]/i.test(t))) f.push(finding('AGT-062'));
  const inferenceOpenBind =
    /["']?OLLAMA_HOST["']?\s*[=:]\s*["']?0\.0\.0\.0["']?/i.test(t) ||
    /--host\s+0\.0\.0\.0/i.test(t) ||
    (/(vllm|ollama|llama|mcp)/i.test(t) && /host\s*:\s*["']?0\.0\.0\.0["']?/i.test(t)) ||
    /bind.*0\.0\.0\.0/i.test(t) ||
    /listen.*0\.0\.0\.0/i.test(t);
  if (inferenceOpenBind && !/(auth_token|api_key|bearer_token|OLLAMA_API_KEY)/i.test(t)) f.push(finding('AGT-063'));
  return f;
};
