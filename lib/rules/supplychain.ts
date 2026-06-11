// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { finding, firstMatchingLine } from './helpers';

const typoCandidates = ['iangchain', 'llama-lndex', '0penai', 'anthr0pic', 'transf0rmers', 'huggingface-hvb', 'litelm', 'crewa1', 'aut0gen', 'pydant1c'];

/**
 * Checks supply chain risks: vulnerable AI framework versions, unsafe model deserialization (pickle/torch.load), trust_remote_code without revision pins, unpinned models and actions, post-install hooks, and dependency typosquats.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for dependency and model supply chain misconfigurations.
 */
export const runSupplyChainRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content.toLowerCase();
  const hasPackageContent = /\b(pip\s+install|npm\s+install|requirements\.txt|package\.json|setup\.py|postinstall|prepare\s+script|poetry|pyproject|cargo\.toml|go\.mod|gemfile)/i.test(parsed.content);
  const hasDependencyDeclaration = /\b(dependencies|devDependencies|install_requires|packages|plugins?|extensions?)\s*[=:]/i.test(parsed.content);
  const f: Finding[] = [];
  const m64 = parsed.content.match(/langchain.*(0\.3\.[0-7][0-9]|1\.[01]\.|1\.2\.[0-2])|llama.?index.*0\.(?:[0-9]|1[01])\.|llama.?index.*0\.12\.(?:[0-2][0-9]|3[0-7])|vllm.*0\.(?:[0-9]|10\.)|ollama.*0\.(?:[0-9]|1[01])\.|litellm.*1\.82\.[78]\b|mcp\.remote.*0\.1\.(?:[0-9]|1[0-5])|@modelcontextprotocol\/inspector.*0\.(?:[0-9]|1[0-3])\.|cursor.*1\.[0-2]\.|@anthropic-ai\/claude-code.*2\.0\.[0-5][0-9]/i);
  if (m64) f.push(finding('AGT-064', m64[0]));
  const m65 = parsed.content.match(/pickle\.loads?\(|torch\.load\([^)]*\)(?![^\n]*weights_only\s*=\s*true)|joblib\.load\(|keras\.models\.load_model.*\.h5|dill\.loads\(|\.pkl|\.bin|\.pt|\.ckpt/i);
  if (m65) f.push(finding('AGT-065', m65[0]));
  const m66 = parsed.content.match(/trust_remote_code\s*=\s*true/i);
  if (m66 && !/revision\s*=\s*["'][a-f0-9]{7,40}["']/i.test(parsed.content)) f.push(finding('AGT-066', m66[0]));
  const m67 = parsed.content.match(/huggingface\.co\/[\w-]+\/[\w-]+(?!@[a-f0-9]{7,40})|model:\s*[a-z0-9._-]+-latest|model:\s*\w+\/\w+$/im);
  if (m67) f.push(finding('AGT-067', m67[0]));
  const m68 = parsed.content.match(/uses:\s*[\w/-]+@(v\d+|main|master|latest|head)\b/i);
  if (m68) f.push(finding('AGT-068', m68[0]));
  if (hasPackageContent || hasDependencyDeclaration) {
    const m69 = parsed.content.match(/(postinstall|prepare|setup_requires|cmdclass|\.pth)/i);
    if (m69 && /(langchain|llama|openai|anthropic|litellm|transformers|huggingface|agent)/i.test(parsed.content)) f.push(finding('AGT-069', m69[0]));
  }
  const typo = typoCandidates.find((x) => t.includes(x));
  if (typo) f.push(finding('AGT-070', firstMatchingLine(parsed.content, [typo]) ?? typo));
  return f;
};
