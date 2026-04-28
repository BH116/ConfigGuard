import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

export const runMemoryRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const persistent = /memory.*persistent|long_term_memory:\s*true|auto_summarize_to_memory:\s*true/i.test(t);
  if (persistent && (!/(ttl|expires)/i.test(t) || /memory_scope:\s*(global|shared)/i.test(t) || !/sanitize_on_write:\s*true/i.test(t))) f.push(finding('AGT-052'));
  if (/write_from_tool_output:\s*true|auto_write_memory_from_response:\s*true/i.test(t) || (persistent && !/(memory_write_requires_user_confirmation|memory\.allowed_writers)/i.test(t))) f.push(finding('AGT-053'));
  if (/(pinecone|weaviate|qdrant|chroma|milvus|pgvector|redis.*vector)/i.test(t) && !/(namespace|tenant_id|MetadataFilter|where_filter)/i.test(t)) f.push(finding('AGT-054'));
  if (/chroma/i.test(t) && /0\.0\.0\.0/i.test(t) && !/(auth_token|api_key|bearer)/i.test(t)) f.push(finding('AGT-054'));
  if (/rag_enabled:\s*true|retriever\s*:/i.test(t) && (!/source_allowlist\s*:/i.test(t) || /source_allowlist:\s*\[\s*("\*"|)\s*\]/i.test(t))) f.push(finding('AGT-055'));
  return f;
};
