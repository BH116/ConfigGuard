import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

const typoCandidates = ['iangchain', 'llama-lndex', '0penai', 'anthr0pic', 'transf0rmers', 'huggingface-hvb', 'litelm', 'crewa1', 'aut0gen', 'pydant1c'];

export const runSupplyChainRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content.toLowerCase();
  const f: Finding[] = [];
  if (/langchain.*(0\.3\.[0-7][0-9]|1\.[01]\.|1\.2\.[0-2])|llama.?index.*0\.(?:[0-9]|1[01])\.|llama.?index.*0\.12\.(?:[0-2][0-9]|3[0-7])|vllm.*0\.(?:[0-9]|10\.)|ollama.*0\.(?:[0-9]|1[01])\.|litellm.*1\.82\.[78]\b|mcp\.remote.*0\.1\.(?:[0-9]|1[0-5])|@modelcontextprotocol\/inspector.*0\.(?:[0-9]|1[0-3])\.|cursor.*1\.[0-2]\.|@anthropic-ai\/claude-code.*2\.0\.[0-5][0-9]/i.test(parsed.content)) f.push(finding('AGT-064'));
  if (/pickle\.loads?\(|torch\.load\([^)]*\)(?![^\n]*weights_only\s*=\s*true)|joblib\.load\(|keras\.models\.load_model.*\.h5|dill\.loads\(|\.pkl|\.bin|\.pt|\.ckpt/i.test(parsed.content)) f.push(finding('AGT-065'));
  if (/trust_remote_code\s*=\s*true/i.test(parsed.content) && !/revision\s*=\s*["'][a-f0-9]{7,40}["']/i.test(parsed.content)) f.push(finding('AGT-066'));
  if (/huggingface\.co\/[\w-]+\/[\w-]+(?!@[a-f0-9]{7,40})|model:\s*[a-z0-9._-]+-latest|model:\s*\w+\/\w+$/im.test(parsed.content)) f.push(finding('AGT-067'));
  if (/uses:\s*[\w/-]+@(v\d+|main|master|latest|head)\b/i.test(parsed.content)) f.push(finding('AGT-068'));
  if (/(postinstall|prepare|setup_requires|cmdclass|\.pth)/i.test(parsed.content) && /(langchain|llama|openai|anthropic|litellm|transformers|huggingface|agent)/i.test(parsed.content)) f.push(finding('AGT-069'));
  if (typoCandidates.some((x) => t.includes(x))) f.push(finding('AGT-070'));
  return f;
};
