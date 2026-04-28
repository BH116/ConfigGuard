import { Rule } from './types';

const ref = (label: string, url: string) => ({ label, url });
const all = ['auto', 'cursor', 'claude', 'codex', 'copilot', 'aider', 'continue', 'windsurf', 'gemini', 'mcp'] as const;
const baseRefs = [ref('OWASP Agentic Top 10', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('OWASP LLM Top 10', 'https://genai.owasp.org/')];

type R = Pick<Rule, 'id' | 'title' | 'severity'>;
const rules: R[] = [
  ['001','Lethal Trifecta','critical'],['002','Hardcoded Secrets','critical'],['003','Untrusted MCP Server','critical'],['004','Auto-Run Without Sandbox','critical'],['005','Invisible Unicode in Instructions','critical'],['006','Overly Broad Filesystem Access','high'],['007','Missing Secrets Deny Pattern','high'],['008','Network Without Domain Allowlist','high'],['009','Shell + Network Combo','high'],['010','MCP Mutation Without Re-Approval','high'],['011','Dangerous MCP Command','high'],['012','Hooks Run Untrusted Commands','critical'],['013','SSL Verification Disabled','high'],['014','Unpinned MCP Versions','medium'],['015','Plaintext Sensitive Env Names','medium'],['016','Auto-Commit Without Verify','medium'],['017','Trivially Weak Rules File','medium'],['018','Self-Modifying Rules','medium'],['019','Missing Output Filter','low'],['020','Untrusted Skill Scripts','low'],['021','.env Not in Ignore Files','low'],['022','Telemetry Enabled','info'],
  ['023','Wildcard Permissions / Scopes','high'],['024','Admin / Root Role Assignment','high'],['025','Missing Tenant / User Identity Propagation','high'],['026','Sensitive Tool Without Human Approval Gate','high'],['027','HITL Bypass via Auto-Approve Flags','critical'],['028','OAuth Token Passthrough / No Audience Binding','high'],['029','Long-Lived or Non-Rotating Credentials','medium'],
  ['030','No Rate Limiting Configured','high'],['031','Unbounded Iterations or Recursion','high'],['032','Missing Token / Cost Budget','medium'],['033','No Timeout on Tool Execution','medium'],
  ['034','No Audit Logging Configured','high'],['035','Insufficient Log Retention','medium'],['036','Prompt Logging Without PII Redaction','high'],['037','No Correlation / Trace IDs','info'],
  ['038','SELECT Star / Full Record Returns','high'],['039','Missing Field Allowlist on Sensitive Tables','high'],['040','PII Redaction Not Configured','high'],['041','Provider Training Opt-In / Data Sent to Vendor','high'],['042','Missing Data Residency / Retention Policy','medium'],
  ['043','Weak System Prompt — Instruction Override Clauses','high'],['044','System Prompt Trusts Tool / Document Outputs','high'],['045','No Input / Output Delimiter for Untrusted Content','medium'],['046','Policy-Puppetry / XML-Frame Jailbreak in Prompts','high'],['047','No Input / Output Safety Rails','medium'],
  ['048','Imperative Override Phrases in Tool Descriptions','high'],['049','File-Read Imperatives in Tool Descriptions','critical'],['050','Misannotated Destructive Tool','high'],['051','Free-Text Covert-Channel Parameter','medium'],
  ['052','Persistent Memory Without TTL or Scope','high'],['053','Memory Writeable From Tool Output','high'],['054','Vector Store Without Tenant Isolation','high'],['055','RAG Corpus Without Source Allowlist','medium'],
  ['056','No Inter-Agent Authentication','high'],['057','Subagent Inherits Full Scope','critical'],['058','Peer-Agent Allowlist Is Wildcard','high'],
  ['059','Privileged Container or Host Networking','critical'],['060','Dangerous Host Filesystem Mounts','critical'],['061','Code Execution Without Microvm / Isolation','high'],['062','Network Egress Without Allowlist in Sandbox','high'],['063','Inference Server Bound to 0.0.0.0 Without Auth','critical'],
  ['064','Vulnerable AI Framework Version','critical'],['065','Pickle / Unsafe Model Deserialization','high'],['066','trust_remote_code Without Revision Pin','high'],['067','Unpinned Model / Dataset Reference','medium'],['068','Mutable GitHub Action References','medium'],['069','Post-Install Hook From AI Package','high'],['070','Dependency Typosquat Candidate','medium'],
  ['071','Markdown Image Auto-Render Enabled','high'],['072','LLM Output Piped to Eval / Exec / Shell','critical'],['073','SQL String Concatenation With LLM Output','critical'],['074','Missing Output Schema for Tool-Calling Agents','medium'],
  ['075','No Kill Switch / Circuit Breaker','medium'],['076','No Anomaly / Loop Detection','low'],['077','No Content Safety / Moderation Layer','high'],['078','High-Risk Classification Missing Required Artifacts','high'],['079','Automated Decision-Making Without Contest Endpoint','high'],['080','Floating Model Alias for High-Risk Use','medium'],
  ['081','Provider Base URL Override','critical'],['082','Repo-Controlled Hooks or Settings','critical'],['083','GitHub Actions AI Agent With Write Perms and Untrusted Trigger','critical'],['084','Sensitive Connected Agent / Inbox-Wide Trigger','high']
].map(([n,t,s])=>({id:`AGT-${n}`,title:t,severity:s} as R));

export const RULE_CATALOG: Rule[] = rules.map((r) => ({
  ...r,
  description: `${r.title} misconfiguration detected in agent configuration text.`,
  fileTypes: [...all],
  references: [...baseRefs],
  remediation: `Review and harden settings for ${r.id} by applying least privilege, explicit approval gates, and secure defaults.`
}));
