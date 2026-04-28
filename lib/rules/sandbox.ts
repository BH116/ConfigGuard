import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

export const runSandboxRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  if (/privileged:\s*true|network:\s*host|--net=host|pid:\s*host|ipc:\s*host|userns:\s*host|cap_add.*(ALL|SYS_ADMIN|NET_ADMIN|SYS_PTRACE)|seccomp:\s*unconfined|apparmor:\s*unconfined/i.test(t)) f.push(finding('AGT-059'));
  if (/"\/"|\/var\/run\/docker\.sock|\/etc|\/root|\/proc|\/sys|\/dev|~|\$HOME|C:\\|%USERPROFILE%/i.test(t)) f.push(finding('AGT-060'));
  const sandboxKeywords = /(isolation:\s*(gvisor|kata|firecracker|wasm|microvm|sandbox)|gvisor|firecracker|microvm|kata|container\s+restrict|sandbox(ed|ing)?\s+(enabled|required|enforced|configured|active))/i;
  const codeExecTools = /(PythonREPLTool|code_interpreter|bash_tool|shell_exec|exec_python|jupyter_kernel|run_python|execute_code|generate_code.{0,40}execute)/i;
  const codeExecPhrases = [
    /no\s+sandboxing?\s+(is\s+)?(required|needed|configured)/i,
    /(scripts?\s+(that\s+)?look\s+safe|looks\s+safe\s+to\s+run|appears\s+safe)\s+(may\s+be\s+|can\s+be\s+)?executed?\s+without\s+sandbox/i,
    /(execute|run)\s+(code|scripts?|python|bash)\s+(immediately|directly|without\s+review|as\.is)/i,
    /generated\s+code\s+(may\s+be\s+|can\s+be\s+|is\s+)?executed?\s+(immediately|directly|without\s+(review|approval|sandbox))/i,
    /file\s+system\s+access\s+is\s+unrestricted/i
  ];
  const hasCodeExecPhrase = codeExecPhrases.some((pattern) => pattern.test(t));
  if ((codeExecTools.test(t) || hasCodeExecPhrase) && !sandboxKeywords.test(t)) f.push(finding('AGT-061'));
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
