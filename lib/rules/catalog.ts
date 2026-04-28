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
  ['085','NL: No Audit Logging Stated','high'],['086','NL: Unrestricted Network Egress Stated','high'],['087','NL: No Authentication or Identity Verification Stated','high'],['088','NL: No RBAC / Equal User Permissions Stated','high'],['089','NL: No Rate Limiting Stated','high'],['090','NL: Instruction Override Patterns in Prose','high'],['091','NL: Sensitive Data Exposure Stated','high'],['092','NL: No Human Approval Required Stated','high'],['093','NL: Self-Modification or Persistence Stated','medium'],['094','NL: Excessive Tool Capability Stated','high'],['095','NL: Skip Safety Checks Stated','high'],
  ['096','NL: Trust-on-Claim Privilege Escalation','critical'],['097','NL: Document/Attachment Instructions Followed','high'],['098','NL: Cross-Domain Data Aggregation','high'],['099','NL: Scheduled Task Privilege Persistence','high'],['100','NL: Log-Based Exfiltration Channel','high'],['101','NL: BEC / ACH Change Without Verification','critical'],['102','NL: Untrusted URL Fetch and Execute','critical'],['103','NL: Persistent State Written from User Input','critical'],['104','NL: Search Index / Knowledge Base Poisoning Risk','high'],['105','NL: Feature Flag / Safe Mode Security Bypass','high'],['106','NL: Coordinated Feedback / Behavior Drift Attack','high'],['107','NL: Classification / Label Downgrade Attack','high'],['108','NL: Calendar / Meeting Invite as Injection Channel','high'],['109','NL: Notification / Alert Routing Manipulation','high'],['110','NL: Re-Identification via Small Cohort Analytics','high'],['111','NL: Token / Secret Exfiltration via Export or Email','critical'],['112','NL: Account Takeover via Tool Combination','critical'],['113','NL: Audit Log Tampering / Shortening','high'],['114','NL: Translation / Transformation as Data Exfiltration Bypass','medium'],['115','NL: Public Link / File Share Without Expiration or DLP','high'],['116','NL: CI/CD Secret Exposure via Logs or Slack','critical'],['117','Combo: Account Takeover (Impersonation + Credential Reset)','critical'],['118','Combo: Token Read + External Send','critical'],['119','Combo: Shell + Fetch + No Sandbox','critical'],['120','Combo: DB Access + Bulk Export + No Approval','high'],['121','Combo: Deploy + No Review + Urgent Bypass','critical']
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
  },
  'AGT-096': {
    description: 'The configuration grants elevated privileges based on user self-claims without identity verification.',
    remediation: 'Verify identity and roles through your authentication provider before any privileged action. Never trust user self-attestation for permission grants.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('OWASP ASI03', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI RMF GV-1.3', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-097': {
    description: 'The configuration directs the agent to act on instructions found in documents, attachments, invoices, or emails.',
    remediation: 'Treat all document and attachment content as data only, never as instructions. Use delimiters for untrusted content and require human review before acting.',
    references: [ref('OWASP LLM01:2025', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI01 Goal Hijack', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('Simon Willison indirect prompt injection', 'https://simonwillison.net/tags/prompt-injection/')]
  },
  'AGT-098': {
    description: 'The configuration combines multiple sensitive domains into single exports, increasing privacy and breach impact.',
    remediation: 'Separate exports by domain, apply strict data minimization, and require explicit approval for exports combining 3+ sensitive categories.',
    references: [ref('GDPR Art.5(1)(c)', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1 Data Privacy', 'https://www.nist.gov/itl/ai-risk-management-framework'), ref('ISO 42001 A.7.5', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-099': {
    description: 'The configuration allows scheduled tasks to persist original permissions without re-validation at execution time.',
    remediation: 'Re-validate permissions and approvals at every run, expire schedule scopes, and require reconfirmation for long-running recurring tasks.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('NIST AI RMF MG-2.1', 'https://www.nist.gov/itl/ai-risk-management-framework'), ref('ISO 42001 A.6.2.3', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-100': {
    description: 'The configuration uses logs as a channel that may capture sensitive context and export it externally.',
    remediation: 'Redact PII/secrets before logging, restrict log destinations to approved internal systems, and apply DLP scanning to logs.',
    references: [ref('OWASP A09', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'), ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-101': {
    description: 'The configuration permits payment/banking detail changes from email or document content without out-of-band verification.',
    remediation: 'Require out-of-band verification to known contacts before ACH/wire changes, add waiting periods, and enforce dual approval on routing updates.',
    references: [ref('FBI IC3 BEC', 'https://www.ic3.gov/Media/PDF/AnnualReport/2024_IC3Report.pdf'), ref('NIST SP 800-63B', 'https://pages.nist.gov/800-63-4/sp800-63b.html'), ref('ISO 42001 A.6.2.3', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-102': {
    description: 'The configuration enables fetch-and-execute behavior from untrusted URLs or user-provided sources.',
    remediation: 'Never execute fetched content. Enforce strict domain allowlists, sandbox all fetched artifacts, and require human approval before any fetch+execute workflow.',
    references: [ref('OWASP A10 SSRF', 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/'), ref('OWASP LLM05', 'https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/'), ref('MITRE ATLAS T1059', 'https://atlas.mitre.org/techniques/AML.T0011')]
  }
  ,
  'AGT-103': {
    description: 'The configuration persists user-provided instructions/workflows and reapplies them in future sessions, enabling durable memory poisoning.',
    remediation: 'Never auto-persist user content as executable behavior. Require explicit human approval and scope persistence to one user/session.',
    references: [ref('OWASP ASI06 Memory Poisoning', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('Embrace the Red spAIware', 'https://embracethered.com/blog/posts/2025/chatgpt-spaiware/'), ref('MemoryGraft arXiv:2512.16962', 'https://arxiv.org/abs/2512.16962')]
  },
  'AGT-104': {
    description: 'User/external content is indexed into knowledge stores and later treated as trusted instructions, creating durable RAG poisoning risk.',
    remediation: 'Treat retrieved/indexed content as untrusted data only. Require provenance-signing and restrict index writes to authenticated internal systems.',
    references: [ref('PoisonedRAG', 'https://www.usenix.org/'), ref('AgentPoison', 'https://arxiv.org/'), ref('OWASP LLM08', 'https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/')]
  },
  'AGT-105': {
    description: 'Security/safe-mode controls can be disabled based on user-claimed debug/test contexts.',
    remediation: 'Security-impacting feature flags must require privileged auth plus out-of-band approval, never end-user self-attestation.',
    references: [ref('OWASP A05', 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'), ref('HiddenLayer Policy Puppetry', 'https://hiddenlayer.com/innovation-hub/novel-universal-bypass-for-all-major-llms/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-106': {
    description: 'Behavior is automatically adapted from aggregated user feedback, enabling coordinated model-policy drift attacks.',
    remediation: 'Require human-reviewed, version-controlled policy updates for all behavior changes.',
    references: [ref('OWASP ASI06 Goal Hijack', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('MITRE ATLAS T0054', 'https://atlas.mitre.org/techniques/AML.T0054/'), ref('Anthropic model manipulation', 'https://www.anthropic.com/research')]
  },
  'AGT-107': {
    description: 'Users can downgrade sensitivity/classification labels, bypassing downstream controls that trust current labels.',
    remediation: 'Allow user-driven upgrades only; require privileged approval + audit trails for downgrades and enforce export against original classification.',
    references: [ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('ISO 42001 A.7.5', 'https://www.iso.org/standard/81230.html'), ref('NIST AI 600-1 Data Governance', 'https://www.nist.gov/')]
  },
  'AGT-108': {
    description: 'Calendar invites and meeting artifacts are treated as actionable instructions, creating an indirect prompt-injection channel.',
    remediation: 'Treat calendar content as untrusted data; never execute embedded directives and keep calendar integration read-only for summaries.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI01 Goal Hijack', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('Willison indirect injection', 'https://simonwillison.net/tags/prompt-injection/')]
  },
  'AGT-109': {
    description: 'Alert routing/suppression can be changed by user input, enabling attackers to mute or divert security notifications.',
    remediation: 'Pin alert channels to authenticated internal destinations and never permit user-directed suppression/deletion.',
    references: [ref('OWASP A09', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'), ref('OWASP ASI08', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI RMF Measure 2.5', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-110': {
    description: 'Analytics/reporting permits tiny cohorts or user-level identifiers, allowing re-identification in "aggregate" outputs.',
    remediation: 'Enforce minimum cohort thresholds (k>=5, ideally 20+) and never export raw identifiers in analytics reports.',
    references: [ref('GDPR Art.5(1)(c)', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1 Privacy Risk', 'https://www.nist.gov/'), ref('Differential Privacy', 'https://www.nist.gov/')]
  },
  'AGT-111': {
    description: 'Tokens/secrets may be exported, emailed, or attached for diagnostics, enabling direct credential exfiltration.',
    remediation: 'Never expose live secrets in exports/emails; provide metadata-only token views and use introspection endpoints.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('OWASP MCP01', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-112': {
    description: 'Impersonation/session-control and credential-reset capability appear together without explicit approval gating.',
    remediation: 'Gate impersonation and credential reset behind dual approval, immutable logging, and out-of-band user notification.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('OWASP A07', 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'), ref('MITRE T1078', 'https://attack.mitre.org/techniques/T1078/')]
  },
  'AGT-113': {
    description: 'Audit trails may be shortened, deleted, or suppressed after incidents or routine activity.',
    remediation: 'Make logs immutable/write-once, retain at least 90 days, and treat deletion requests as security incidents.',
    references: [ref('OWASP A09', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'), ref('EU AI Act Art.19', 'https://eur-lex.europa.eu/'), ref('SOX Section 802', 'https://www.sec.gov/')]
  },
  'AGT-114': {
    description: 'Translation/transformation workflows allow full-context export, bypassing minimization/redaction controls.',
    remediation: 'Apply identical allowlists/redaction rules to transformed outputs; accuracy claims cannot override data minimization.',
    references: [ref('GDPR Art.5(1)(c)', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1', 'https://www.nist.gov/'), ref('ISO 42001 A.7.5', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-115': {
    description: 'Public/unauthenticated sharing is allowed without expiration, DLP scanning, or recipient verification.',
    remediation: 'Require short-lived links (<=24h), DLP scans, logging, and prefer authenticated sharing over public links.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('ISO 42001 A.7.5', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-116': {
    description: 'CI/build logs may be posted to Slack/email and may reveal masked secrets during troubleshooting.',
    remediation: 'Never post raw CI logs externally; enforce masking, scrub outputs, and incident-handle any leaked-secret patterns.',
    references: [ref('CVE-2025-53773', 'https://nvd.nist.gov/'), ref('GitHub Actions secret scanning', 'https://docs.github.com/en/code-security/secret-scanning'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/')]
  },
  'AGT-117': {
    description: 'Dangerous combo detected: impersonation + credential reset without dual-approval gate.',
    remediation: 'Require dual approval and immutable audit logs for all impersonation and credential-change operations.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('MITRE T1078', 'https://attack.mitre.org/techniques/T1078/')]
  },
  'AGT-118': {
    description: 'Dangerous combo detected: token/credential read paths plus external send capability without redaction.',
    remediation: 'Block raw secret exports and enforce token redaction before any external transfer channel.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('OWASP MCP01', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-119': {
    description: 'Dangerous combo detected: URL fetch + code execution without sandbox/isolation controls.',
    remediation: 'Isolate execution in a sandbox/microVM and forbid direct fetch-and-execute workflows.',
    references: [ref('OWASP ASI05', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('OWASP A10 SSRF', 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/')]
  },
  'AGT-120': {
    description: 'Dangerous combo detected: production DB access with bulk export and no export approval.',
    remediation: 'Require approval workflows and row/field constraints for all production-data exports.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/')]
  },
  'AGT-121': {
    description: 'Dangerous combo detected: production deployment + urgency-based bypass of CI/review requirements.',
    remediation: 'Enforce mandatory review, CI pass checks, and change-window controls even during emergencies.',
    references: [ref('OWASP A05', 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'), ref('NIST SSDF', 'https://csrc.nist.gov/Projects/ssdf')]
  }

};

export const RULE_CATALOG: Rule[] = rules.map((r) => ({
  ...r,
  description: NATURAL_LANGUAGE_OVERRIDES[r.id]?.description ?? `${r.title} misconfiguration detected in agent configuration text.`,
  fileTypes: [...all],
  references: NATURAL_LANGUAGE_OVERRIDES[r.id]?.references ?? [...baseRefs],
  remediation: NATURAL_LANGUAGE_OVERRIDES[r.id]?.remediation ?? `Review and harden settings for ${r.id} by applying least privilege, explicit approval gates, and secure defaults.`
}));
