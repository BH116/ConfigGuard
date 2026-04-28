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
  ['081','Provider Base URL Override','critical'],['082','Repo-Controlled Hooks or Settings','critical'],['083','GitHub Actions AI Agent With Write Perms and Untrusted Trigger','critical'],['084','Sensitive Connected Agent / Inbox-Wide Trigger','high'],
  ['085','NL: No Audit Logging Stated','high'],['086','NL: Unrestricted Network Egress Stated','high'],['087','NL: No Authentication or Identity Verification Stated','high'],['088','NL: No RBAC / Equal User Permissions Stated','high'],['089','NL: No Rate Limiting Stated','high'],['090','NL: Instruction Override Patterns in Prose','high'],['091','NL: Sensitive Data Exposure Stated','high'],['092','NL: No Human Approval Required Stated','high'],['093','NL: Self-Modification or Persistence Stated','medium'],['094','NL: Excessive Tool Capability Stated','high'],['095','NL: Skip Safety Checks Stated','high']
].map(([n,t,s])=>({id:`AGT-${n}`,title:t,severity:s} as R));

const NATURAL_LANGUAGE_OVERRIDES: Record<string, Pick<Rule, 'description' | 'remediation' | 'references'>> = {
  'AGT-085': {
    description: 'The configuration explicitly states actions are not logged or audited.',
    remediation: 'Enable structured audit logging for all tool calls and decisions, with retention for at least 90 days.',
    references: [ref('OWASP MCP08', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('EU AI Act Art.12', 'https://eur-lex.europa.eu/'), ref('ISO 42001 A.6.2.4', 'https://www.iso.org/standard/42001')]
  },
  'AGT-086': {
    description: 'The configuration describes unrestricted network access in natural language prose.',
    remediation: 'Define an explicit domain allowlist and block all egress not on the list.',
    references: [ref('OWASP LLM05', 'https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/'), ref('OWASP ASI01', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-087': {
    description: 'The configuration describes disabled or absent authentication and identity verification.',
    remediation: 'Require authentication for all agent invocations and enforce identity verification.',
    references: [ref('OWASP A07', 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'), ref('OWASP MCP07', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-088': {
    description: 'The configuration describes flat or absent role-based access control.',
    remediation: 'Define explicit least-privileged roles with scoped capabilities and permission checks.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('OWASP ASI03', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-089': {
    description: 'The configuration explicitly states no rate limits, throttling, or quotas.',
    remediation: 'Set per-user, per-tool, and global rate limits with token and cost budgets.',
    references: [ref('OWASP LLM10', 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/'), ref('MITRE AML.T0029', 'https://atlas.mitre.org/techniques/AML.T0029')]
  },
  'AGT-090': {
    description: 'The rules describe a flexible instruction hierarchy where later input can override earlier constraints.',
    remediation: 'Treat system rules as immutable and do not defer to incoming content for priority changes.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI01 Goal Hijack', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-091': {
    description: 'The configuration describes returning full records or unredacted sensitive data.',
    remediation: 'Define explicit field allowlists and apply PII redaction before tool or log access.',
    references: [ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-092': {
    description: 'The configuration describes bypassing human approval for sensitive actions.',
    remediation: 'Require human-in-the-loop approval for destructive or expensive actions with fail-closed timeouts.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('OWASP ASI09', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('ISO 42001 A.6.2.3', 'https://www.iso.org/standard/42001')]
  },
  'AGT-093': {
    description: 'The configuration permits self-modification or host persistence across sessions.',
    remediation: 'Make rules files read-only and block writes to persistence mechanisms such as shell profiles and schedulers.',
    references: [ref('OWASP ASI06', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-094': {
    description: 'The configuration describes broad or unrestricted tool and execution capabilities.',
    remediation: 'Limit tool permissions to minimum required scope and document high-privilege use.',
    references: [ref('OWASP ASI03', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI RMF GV-1.3', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-095': {
    description: 'The configuration describes bypassing or disabling safety checks and guardrails.',
    remediation: 'Run safety filtering and moderation controls by default with fail-closed behavior.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  }
};

export const RULE_CATALOG: Rule[] = rules.map((r) => ({
  ...r,
  description: NATURAL_LANGUAGE_OVERRIDES[r.id]?.description ?? `${r.title} misconfiguration detected in agent configuration text.`,
  fileTypes: [...all],
  references: NATURAL_LANGUAGE_OVERRIDES[r.id]?.references ?? [...baseRefs],
  remediation: NATURAL_LANGUAGE_OVERRIDES[r.id]?.remediation ?? `Review and harden settings for ${r.id} by applying least privilege, explicit approval gates, and secure defaults.`
}));
