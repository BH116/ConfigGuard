// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { finding, firstMatchingLine } from './helpers';

/**
 * Checks agent memory and retrieval risks: persistent memory without TTL or scoping, memory writes from tool output, vector stores without tenant isolation, and RAG corpora without source allowlists.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for memory and RAG misconfigurations.
 */
export const runMemoryRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const mPersistent = t.match(/memory.*persistent|long_term_memory:\s*true|auto_summarize_to_memory:\s*true/i);
  const persistent = Boolean(mPersistent);
  const mScope = t.match(/memory_scope:\s*(global|shared)/i);
  if (persistent && (!/(ttl|expires)/i.test(t) || mScope || !/sanitize_on_write:\s*true/i.test(t))) f.push(finding('AGT-052', mScope?.[0] ?? mPersistent?.[0]));
  const m53 = t.match(/write_from_tool_output:\s*true|auto_write_memory_from_response:\s*true/i);
  if (m53 || (persistent && !/(memory_write_requires_user_confirmation|memory\.allowed_writers)/i.test(t))) f.push(finding('AGT-053', m53?.[0] ?? mPersistent?.[0]));
  const m54 = t.match(/(pinecone|weaviate|qdrant|chroma|milvus|pgvector|redis.*vector)/i);
  if (m54 && !/(namespace|tenant_id|MetadataFilter|where_filter)/i.test(t)) f.push(finding('AGT-054', m54[0]));
  if (/chroma/i.test(t) && /0\.0\.0\.0/i.test(t) && !/(auth_token|api_key|bearer)/i.test(t)) f.push(finding('AGT-054', firstMatchingLine(t, ['0.0.0.0'])));
  const m55 = t.match(/rag_enabled:\s*true|retriever\s*:/i);
  if (m55 && (!/source_allowlist\s*:/i.test(t) || /source_allowlist:\s*\[\s*("\*"|)\s*\]/i.test(t))) f.push(finding('AGT-055', m55[0]));
  return f;
};
