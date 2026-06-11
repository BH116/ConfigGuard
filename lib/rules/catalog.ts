import { Rule } from './types';

const ref = (label: string, url: string) => ({ label, url });
const all = ['auto', 'cursor', 'claude', 'codex', 'copilot', 'aider', 'continue', 'windsurf', 'gemini', 'mcp'] as const;
const baseRefs = [ref('OWASP Agentic Top 10', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('OWASP LLM Top 10', 'https://genai.owasp.org/')];

type R = Pick<Rule, 'id' | 'title' | 'severity' | 'version'>;
const rules: R[] = [
  ['001','Lethal Trifecta','critical'],['002','Hardcoded Secrets','critical'],['003','Untrusted MCP Server','critical'],['004','Auto-Run Without Sandbox','critical'],['005','Invisible Unicode in Instructions','critical'],['006','Overly Broad Filesystem Access','high'],['007','Missing Secrets Deny Pattern','high'],['008','Network Without Domain Allowlist','high'],['009','Shell + Network Combo','high'],['010','MCP Mutation Without Re-Approval','high'],['011','Dangerous MCP Command','high'],['012','Hooks Run Untrusted Commands','critical'],['013','SSL Verification Disabled','high'],['014','Unpinned MCP Versions','medium'],['015','Plaintext Sensitive Env Names','medium'],['016','Auto-Commit Without Verify','medium'],['017','Trivially Weak Rules File','medium'],['018','Self-Modifying Rules','medium'],['019','Missing Output Filter','low'],['020','Untrusted Skill Scripts','low'],['021','.env Not in Ignore Files','low'],['022','Telemetry Enabled','info'],
  ['023','Wildcard Permissions / Scopes','high'],['024','Admin / Root Role Assignment','high'],['025','Missing Tenant / User Identity Propagation','high'],['026','Sensitive Tool Without Human Approval Gate','high'],['027','HITL Bypass via Auto-Approve Flags','critical'],['028','OAuth Token Passthrough / No Audience Binding','high'],['029','Long-Lived or Non-Rotating Credentials','medium'],
  ['030','No Rate Limiting Configured','high'],['031','Unbounded Iterations or Recursion','high'],['032','Missing Token / Cost Budget','medium'],['033','No Timeout on Tool Execution','medium'],
  ['034','No Audit Logging Configured','high'],['035','Insufficient Log Retention','medium'],['036','Prompt Logging Without PII Redaction','high'],['037','No Correlation / Trace IDs','info'],
  ['038','SELECT Star / Full Record Returns','high'],['039','Missing Field Allowlist on Sensitive Tables','high'],['040','PII Redaction Not Configured','high'],['041','Provider Training Opt-In / Data Sent to Vendor','high'],['042','Missing Data Residency / Retention Policy','medium'],
  ['043','Weak System Prompt: Instruction Override Clauses','high'],['044','System Prompt Trusts Tool / Document Outputs','high'],['045','No Input / Output Delimiter for Untrusted Content','medium'],['046','Policy-Puppetry / XML-Frame Jailbreak in Prompts','high'],['047','No Input / Output Safety Rails','medium'],
  ['048','Imperative Override Phrases in Tool Descriptions','high'],['049','File-Read Imperatives in Tool Descriptions','critical'],['050','Misannotated Destructive Tool','high'],['051','Free-Text Covert-Channel Parameter','medium'],
  ['052','Persistent Memory Without TTL or Scope','high'],['053','Memory Writeable From Tool Output','high'],['054','Vector Store Without Tenant Isolation','high'],['055','RAG Corpus Without Source Allowlist','medium'],
  ['056','No Inter-Agent Authentication','high'],['057','Subagent Inherits Full Scope','critical'],['058','Peer-Agent Allowlist Is Wildcard','high'],
  ['059','Privileged Container or Host Networking','critical'],['060','Dangerous Host Filesystem Mounts','critical'],['061','Code Execution Without Microvm / Isolation','high'],['062','Network Egress Without Allowlist in Sandbox','high'],['063','Inference Server Bound to 0.0.0.0 Without Auth','critical'],
  ['064','Vulnerable AI Framework Version','critical'],['065','Pickle / Unsafe Model Deserialization','high'],['066','trust_remote_code Without Revision Pin','high'],['067','Unpinned Model / Dataset Reference','medium'],['068','Mutable GitHub Action References','medium'],['069','Post-Install Hook From AI Package','high'],['070','Dependency Typosquat Candidate','medium'],
  ['071','Markdown Image Auto-Render Enabled','high'],['072','LLM Output Piped to Eval / Exec / Shell','critical'],['073','SQL String Concatenation With LLM Output','critical'],['074','Missing Output Schema for Tool-Calling Agents','medium'],
  ['075','No Kill Switch / Circuit Breaker','medium'],['076','No Anomaly / Loop Detection','low'],['077','No Content Safety / Moderation Layer','critical'],['078','High-Risk Classification Missing Required Artifacts','high'],['079','Automated Decision-Making Without Contest Endpoint','high'],['080','Floating Model Alias for High-Risk Use','medium'],
  ['081','Provider Base URL Override','critical'],['082','Repo-Controlled Hooks or Settings','critical'],['083','GitHub Actions AI Agent With Write Perms and Untrusted Trigger','critical'],['084','Sensitive Connected Agent / Inbox-Wide Trigger','high'],
  ['085','NL: No Audit Logging Stated','high'],['086','NL: Unrestricted Network Egress Stated','high'],['087','NL: No Authentication or Identity Verification Stated','high'],['088','NL: No RBAC / Equal User Permissions Stated','high'],['089','NL: No Rate Limiting Stated','high'],['090','NL: Instruction Override Patterns in Prose','high'],['091','NL: Sensitive Data Exposure Stated','high'],['092','NL: No Human Approval Required Stated','high'],['093','NL: Self-Modification or Persistence Stated','medium'],['094','NL: Excessive Tool Capability Stated','high'],['095','NL: Skip Safety Checks Stated','high'],
  ['096','NL: Trust-on-Claim Privilege Escalation','critical'],['097','NL: Document/Attachment Instructions Followed','high'],['098','NL: Cross-Domain Data Aggregation','high'],['099','NL: Scheduled Task Privilege Persistence','high'],['100','NL: Log-Based Exfiltration Channel','high'],['101','NL: BEC / ACH Change Without Verification','critical'],['102','NL: Untrusted URL Fetch and Execute','critical'],['103','NL: Persistent State Written from User Input','critical'],['104','NL: Search Index / Knowledge Base Poisoning Risk','critical'],['105','NL: Feature Flag / Safe Mode Security Bypass','high'],['106','NL: Coordinated Feedback / Behavior Drift Attack','high'],['107','NL: Classification / Label Downgrade Attack','high'],['108','NL: Calendar / Meeting Invite as Injection Channel','high'],['109','NL: Notification / Alert Routing Manipulation','high'],['110','NL: Re-Identification via Small Cohort Analytics','high'],['111','NL: Token / Secret Exfiltration via Export or Email','critical'],['112','NL: Account Takeover via Tool Combination','critical'],['113','NL: Audit Log Tampering / Shortening','high'],['114','NL: Translation / Transformation as Data Exfiltration Bypass','medium'],['115','NL: Public Link / File Share Without Expiration or DLP','high'],['116','NL: CI/CD Secret Exposure via Logs or Slack','critical'],['117','Combo: Account Takeover (Impersonation + Credential Reset)','critical'],['118','Combo: Token Read + External Send','critical'],['119','Combo: Shell + Fetch + No Sandbox','critical'],['120','Combo: DB Access + Bulk Export + No Approval','critical'],['121','Combo: Deploy + No Review + Urgent Bypass','critical'],
  ['122','NL: Unsigned Plugin Install From Untrusted Source','high'],['123','NL: User-Provided Webhook as Runtime Exfiltration Channel','high'],['124','NL: Infrastructure Permission Escalation Without Approval','critical'],['125','NL: System Prompt / Hidden Instruction Disclosure Allowed','high'],['126','NL: Unbounded Privilege Grant Without Expiration','high'],['127','NL: Cloud Metadata SSRF Allowed','high'],['128','NL: Alert or Notification Routing Hijack','high'],['129','NL: Public Link Sharing Without Expiration or Verification','high'],['130','NL: User Impersonation or Account Takeover Workflow','critical'],['131','NL: Analytics Re-identification Risk / No Cohort Minimum','high'],['132','NL: Sensitive Data in Logs / Log Exfiltration Channel','high'],['133','NL: Trust-on-Claim Authorization','high'],['134','NL: Saved Workflow or Reusable Pipeline From User Input','high'],
  ['135','Unpinned MCP Server Version','high'],['136','Agent Package Install Without Lockfile','high'],['137','Git Clone From Arbitrary URL','high'],['138','Shell Startup File Modification','critical'],['139','Cron Job or Scheduled Task Creation','critical'],['140','Systemd Service Installation','critical'],['141','System Prompt Forwarding to External Endpoint','high'],['142','Bulk Data Export to Unverified Destination','high'],
  ['143','Agent Publishes Content Without Fact Verification','high'],['144','No Grounding or Citation Requirement for Factual Output','medium'],['145','Confidence Forcing / No Uncertainty Disclosure','medium'],
  ['146','MCP Server Poisoning: Combined Read-Write Sensitive Access','critical'],['147','Tool-Call Authorization Bypass / Scope Escalation on Failure','high'],['148','Cross-Agent Trust Escalation','high'],['149','Memory Poisoning Surface / Unvalidated Persistence','high'],['150','RAG Injection Surface / Untrusted Context Into Prompt','critical']
].map(([n,t,s])=>({id:`AGT-${n}`,title:t,severity:s,version:1} as R));

const NATURAL_LANGUAGE_OVERRIDES: Record<string, Pick<Rule, 'description' | 'remediation' | 'references'>> = {
  'AGT-023': {
    description: 'Wildcard or overly broad permission scopes grant the agent access far beyond what it needs.',
    remediation: 'Replace wildcard (*) scopes with an explicit enumerated list of the tools and resources this agent actually requires. Audit current usage to derive the minimal set, deny everything not listed, and re-review the list whenever new tools are added. Excessive scope amplifies blast radius if the agent is compromised through injection. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('CWE-732', 'https://cwe.mitre.org/data/definitions/732.html')]
  },
  'AGT-024': {
    description: 'The agent is configured with an admin or root role granting unrestricted system access.',
    remediation: 'Replace the admin or root role assignment with a least privilege role scoped to only the specific actions this agent performs. Create a dedicated service role, grant individual permissions one at a time, and audit grants quarterly. Admin roles give a compromised agent unrestricted control of the entire system. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('CWE-269', 'https://cwe.mitre.org/data/definitions/269.html')]
  },
  'AGT-025': {
    description: 'Tenant and user identity are not propagated into tool call context, allowing cross-tenant data access.',
    remediation: 'Configure tenant_id and user_id propagation into every tool call, database query, and downstream API request the agent makes. Enforce these identifiers as mandatory filter parameters at the data layer rather than in the prompt. Missing identity context allows one tenant to read or modify another tenant\'s data through the shared agent. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('CWE-284', 'https://cwe.mitre.org/data/definitions/284.html')]
  },
  'AGT-026': {
    description: 'Sensitive tools execute without a human approval gate.',
    remediation: 'Add requires_approval: true or human_approval: true to every sensitive tool definition, including any tool that deletes data, sends external messages, or spends money. Configure the approval gate to fail closed when no reviewer responds. Without an approval gate, a single injected instruction can trigger irreversible actions on sensitive resources with no safety backstop. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('OWASP ASI09', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-027': {
    description: 'Human-in-the-loop controls are bypassed via auto-approve or skip-confirmation flags.',
    remediation: 'Remove all auto_approve, auto_confirm, and skip_confirmation flags from the agent configuration and verify no environment variable or CLI flag re-enables them. Restore explicit human confirmation for every privileged operation and alert when a bypass flag reappears. These override flags silently negate human-in-the-loop controls, leaving sensitive actions completely ungated. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('OWASP ASI09', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-028': {
    description: 'OAuth tokens are passed through without audience binding or scope restriction.',
    remediation: 'Add audience (aud) binding to every OAuth token the agent issues or forwards, and restrict scopes to the minimum each downstream service requires. Validate the audience claim at every receiving service and reject tokens presented to the wrong endpoint. Tokens without audience binding can be replayed against unintended services to escalate access. Ref: CWE-287.',
    references: [ref('CWE-287', 'https://cwe.mitre.org/data/definitions/287.html'), ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/')]
  },
  'AGT-029': {
    description: 'Credentials are long-lived or lack a rotation schedule.',
    remediation: 'Set a maximum credential TTL (for example 90 days or less) and configure automatic rotation through your secrets manager for every credential the agent uses. Replace any static API keys with short-lived tokens issued at runtime. Long-lived credentials extend the attacker\'s window indefinitely after any leak or compromise. Ref: CWE-324.',
    references: [ref('CWE-324', 'https://cwe.mitre.org/data/definitions/324.html'), ref('NIST SP 800-63B', 'https://pages.nist.gov/800-63-4/sp800-63b.html')]
  },
  'AGT-030': {
    description: 'No rate limiting is configured for the agent or its tools.',
    remediation: 'Add a rate_limit block with an explicit requests_per_minute value to the agent configuration, and apply separate per-user and per-tool limits where the runtime supports them. Set alerts for sustained limit hits to detect abuse early. Unbounded request volume exhausts API quota, inflates costs, and enables cost-based denial of service. Ref: OWASP LLM10.',
    references: [ref('OWASP LLM10', 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/'), ref('MITRE AML.T0029', 'https://atlas.mitre.org/techniques/AML.T0029')]
  },
  'AGT-031': {
    description: 'Agent iteration or recursion depth is unbounded.',
    remediation: 'Add max_turns or max_iterations to the agent loop configuration to cap recursion depth, with a conservative starting value such as 10 to 20 turns. Log and alert whenever the cap is reached so legitimate workloads can be tuned. Unbounded recursion enables infinite loops, runaway token spend, and complete resource exhaustion. Ref: OWASP LLM10.',
    references: [ref('OWASP LLM10', 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/'), ref('CWE-674', 'https://cwe.mitre.org/data/definitions/674.html')]
  },
  'AGT-032': {
    description: 'No token or cost budget is configured for the agent.',
    remediation: 'Set token_budget or max_tokens in the agent configuration to cap total consumption per session and per day. Define a hard spend ceiling at the provider account level as a second layer, and alert when usage approaches the budget. Uncapped token usage leads to runaway costs and resource exhaustion during loops or abuse. Ref: OWASP LLM10.',
    references: [ref('OWASP LLM10', 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/')]
  },
  'AGT-033': {
    description: 'No execution timeout is set on tool calls, allowing hanging tools to block threads indefinitely.',
    remediation: 'Add tool_timeout_seconds (a value of 30 is a reasonable default) to every tool definition so hung calls are terminated automatically. Configure the agent to surface timeout errors rather than retrying indefinitely, and tune limits per tool. Hanging tools block worker threads and provide attackers a cheap resource exhaustion vector. Ref: CWE-400.',
    references: [ref('CWE-400', 'https://cwe.mitre.org/data/definitions/400.html'), ref('OWASP LLM10', 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/')]
  },
  'AGT-034': {
    description: 'Audit logging is not configured for agent tool calls and decisions.',
    remediation: 'Set audit_log: true and retention_days to at least 90 in the agent configuration so every tool call and decision is recorded. Ship logs to an immutable external store with restricted delete permissions. Missing audit logs make incident response impossible and break regulatory compliance obligations such as EU AI Act Article 12. Ref: CWE-778.',
    references: [ref('CWE-778', 'https://cwe.mitre.org/data/definitions/778.html'), ref('EU AI Act Art.12', 'https://eur-lex.europa.eu/')]
  },
  'AGT-035': {
    description: 'Log retention is too short for forensic investigation of security incidents.',
    remediation: 'Set log_retention_days to at least 90 in the agent logging configuration, and archive older logs to cold storage rather than deleting them. Align the retention window with your incident response and regulatory requirements. Short retention destroys the evidence needed to investigate incidents that are often discovered weeks or months after they occur. Ref: CWE-778.',
    references: [ref('CWE-778', 'https://cwe.mitre.org/data/definitions/778.html'), ref('SOX Section 802', 'https://www.sec.gov/')]
  },
  'AGT-036': {
    description: 'Prompt contents are logged without PII redaction, capturing sensitive user data.',
    remediation: 'Set pii_redaction: true before enabling any prompt logging, and define redaction patterns for emails, phone numbers, government IDs, and credentials. Sample redacted logs periodically to confirm the filters work. Raw prompt logs capture user PII, violate data minimization requirements, and turn the logging pipeline into a breach liability. Ref: GDPR Art.5.',
    references: [ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/')]
  },
  'AGT-037': {
    description: 'No correlation or trace IDs are emitted, making multi-step attack reconstruction impossible.',
    remediation: 'Add an otlp_endpoint or set trace_id generation in the agent configuration so every tool call and decision carries a correlation identifier. Propagate the same trace ID across subagents and downstream services. Without trace IDs, chained agent actions cannot be reconstructed during incident review, hiding multi-step attacks inside ordinary traffic. Ref: CWE-778.',
    references: [ref('CWE-778', 'https://cwe.mitre.org/data/definitions/778.html'), ref('OWASP A09', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/')]
  },
  'AGT-038': {
    description: 'Queries use SELECT * or return full records, sending unnecessary sensitive data to the agent.',
    remediation: 'Replace SELECT * and full-record returns with an explicit field list in every query tool definition, naming only the columns the agent\'s task requires. Add projection enforcement at the database role level as a backstop. Full-record returns expose PII, secrets, and internal fields the agent does not need, inflating every breach. Ref: OWASP LLM02.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('CWE-200', 'https://cwe.mitre.org/data/definitions/200.html')]
  },
  'AGT-039': {
    description: 'Sensitive database tables have no field allowlist, returning all columns on any query.',
    remediation: 'Add a field_allowlist to every tool definition that touches a sensitive table, enumerating the exact columns the agent may receive. Deny unlisted columns at the query layer and review the allowlist whenever schemas change. Without an allowlist, any query returns all columns by default, including PII and embedded secrets. Ref: OWASP LLM02.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('GDPR Art.5(1)(c)', 'https://gdpr.eu/article-5-how-to-process-personal-data/')]
  },
  'AGT-040': {
    description: 'PII redaction is not configured for agent outputs or logs.',
    remediation: 'Set pii_redaction: true for agent outputs and logs, and define detection patterns for names, emails, phone numbers, account numbers, and credentials. Test the redaction against sample payloads in CI to catch regressions. Unredacted PII flowing through agent outputs violates data minimization principles and creates direct regulatory and breach exposure. Ref: GDPR Art.5.',
    references: [ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/')]
  },
  'AGT-041': {
    description: 'The provider training opt-in setting is enabled, sending user data for model training.',
    remediation: 'Set training_opt_out: true or disable the training opt-in switch in the provider API settings, and verify the flag in the provider dashboard rather than trusting local configuration alone. Record the opt-out status in your data processing inventory. Opting in sends user prompts and data into vendor training pipelines entirely outside your control. Ref: GDPR Art.6.',
    references: [ref('GDPR Art.6', 'https://gdpr.eu/article-6-lawful-basis-for-processing/'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/')]
  },
  'AGT-042': {
    description: 'No data residency or retention policy is configured for the agent.',
    remediation: 'Add data_residency with an explicit region and a retention_days value to the agent configuration, matching the jurisdictions of your users. Verify the provider actually honors regional processing for inference and logging. Uncontrolled residency and indefinite retention can violate GDPR, HIPAA, and contractual data handling commitments without any visible failure. Ref: GDPR Art.44.',
    references: [ref('GDPR Art.44', 'https://gdpr.eu/article-44-transfer-of-personal-data/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-043': {
    description: 'The system prompt contains instruction override clauses that allow later input to supersede safety rules.',
    remediation: 'Remove override phrases such as "ignore previous", "supersede rules", and "later instructions take priority" from the system prompt. State explicitly that system instructions are immutable and that conflicting requests from users, tools, or documents must be refused. Flexible instruction hierarchies let prompt injection escalate into full policy override. Ref: OWASP LLM01.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI01', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-044': {
    description: 'The system prompt trusts tool or document outputs as instructions.',
    remediation: 'Configure untrusted content delimiters around all document and tool output before it reaches the model, and add a system prompt rule stating that delimited content is data, never instructions. Strip or escape delimiter look-alikes inside the wrapped content. Trusting tool and document output as instructions enables indirect prompt injection from any retrieved source. Ref: OWASP LLM01.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('Simon Willison', 'https://simonwillison.net/tags/prompt-injection/')]
  },
  'AGT-045': {
    description: 'No input/output delimiters are used to separate trusted instructions from untrusted content.',
    remediation: 'Add explicit XML tags or unique marker delimiters around every untrusted input section, and instruct the model that text inside those markers is data to analyze, never commands to follow. Sanitize untrusted content for forged closing markers. Without delimiters, injected content bleeds directly into the trusted instruction space and overrides policy. Ref: OWASP LLM01.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/')]
  },
  'AGT-046': {
    description: 'The config contains XML-frame or role-play patterns known to jailbreak major LLMs.',
    remediation: 'Remove policy-puppetry patterns such as XML role assignments, DAN framing, and override personas from all system prompts and configuration files. Add CI checks that scan prompt files for these structures before deployment. These patterns are active, documented jailbreak vectors that bypass alignment safeguards across all major model families. Ref: OWASP LLM01.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('HiddenLayer Policy Puppetry', 'https://hiddenlayer.com/innovation-hub/novel-universal-bypass-for-all-major-llms/')]
  },
  'AGT-047': {
    description: 'No input or output safety rails are configured.',
    remediation: 'Add input_rails and output_rails using NeMo Guardrails, Lakera Guard, or an equivalent safety layer, screening both user input before it reaches the model and model output before it reaches tools or users. Configure the rails to fail closed on errors. Without safety rails, injected or harmful content flows through the pipeline completely unchecked. Ref: OWASP LLM01.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-048': {
    description: 'Tool descriptions contain imperative override phrases that bypass system prompt controls.',
    remediation: 'Remove imperative override phrases such as "always", "ignore", and "forget prior" from every tool description, and rewrite descriptions as neutral statements of what the tool does. Add a registry lint that rejects imperative language in tool metadata. Tool descriptions are injected into the model context and silently override system-level constraints. Ref: OWASP LLM01.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI04', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-049': {
    description: 'Tool descriptions contain file-read imperatives, creating a direct prompt injection vector.',
    remediation: 'Remove all "read", "load", and "import" directives from tool descriptions and replace them with passive capability statements that never instruct the model to act. Audit third-party MCP tool descriptions before registration. File-read imperatives embedded in tool metadata are an active prompt injection vector that can trigger unintended file access. Ref: OWASP LLM01.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('CWE-434', 'https://cwe.mitre.org/data/definitions/434.html')]
  },
  'AGT-050': {
    description: 'A destructive tool is misannotated, preventing human approval from triggering correctly.',
    remediation: 'Mark every destructive tool with destructive: true and add confirmation_required: true so the approval workflow triggers correctly. Audit existing tool annotations against actual tool behavior, since a delete or overwrite capability labeled read-only never prompts for review. Misannotated tools silently bypass human approval logic, removing the last safeguard before irreversible actions. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/')]
  },
  'AGT-051': {
    description: 'A free-text tool parameter creates a covert channel for data exfiltration via unvalidated input.',
    remediation: 'Replace free-text tool parameters with schema-validated enums, numeric ranges, or tightly structured types, and set maxLength limits where strings are unavoidable. Validate against the schema server-side and reject nonconforming calls. Unvalidated free-text parameters function as covert channels through which an injected agent can smuggle sensitive data out of your environment. Ref: CWE-116.',
    references: [ref('CWE-116', 'https://cwe.mitre.org/data/definitions/116.html'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/')]
  },
  'AGT-052': {
    description: 'Persistent memory has no TTL or user-scoping, enabling durable prompt injection across sessions.',
    remediation: 'Add ttl with an explicit expiry in seconds and scope: user to every persistent memory entry so memories expire and never cross user boundaries. Provide an administrative purge path for poisoned entries. Unbounded shared memory lets a single injected instruction persist across sessions and silently influence every future conversation. Ref: OWASP LLM04.',
    references: [ref('OWASP LLM04', 'https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/'), ref('MemoryGraft arXiv:2512.16962', 'https://arxiv.org/abs/2512.16962')]
  },
  'AGT-053': {
    description: 'Tool outputs can write to persistent memory, allowing external content to mutate agent state.',
    remediation: 'Block tool outputs from writing to persistent memory by removing memory-write permissions from tool result handlers, and require explicit human confirmation for any memory mutation. Validate proposed memories against an allowlist of expected formats. External content that can mutate agent state plants durable instructions that survive restarts and infect later sessions. Ref: OWASP LLM04.',
    references: [ref('OWASP LLM04', 'https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/'), ref('Embrace the Red spAIware', 'https://embracethered.com/blog/posts/2025/chatgpt-spaiware/')]
  },
  'AGT-054': {
    description: 'Vector store queries have no tenant isolation, enabling cross-tenant knowledge base access.',
    remediation: 'Add a mandatory tenant_id filter to every vector store query, enforced in the retrieval middleware rather than in the prompt, and partition collections per tenant where the store supports it. Write integration tests proving cross-tenant queries return nothing. Missing isolation lets any tenant retrieve another tenant\'s indexed documents through the shared store. Ref: OWASP LLM08.',
    references: [ref('OWASP LLM08', 'https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/')]
  },
  'AGT-055': {
    description: 'The RAG corpus has no source allowlist, allowing poisoned sources into the retrieval pipeline.',
    remediation: 'Add a source_allowlist to the RAG corpus configuration enumerating the domains, repositories, and buckets that may be ingested, and reject documents from unlisted origins at ingestion time. Record provenance metadata for every chunk. Without an allowlist, attacker-controlled sources enter the retrieval pipeline and poison answers with injected instructions. Ref: OWASP LLM08.',
    references: [ref('OWASP LLM08', 'https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/'), ref('PoisonedRAG', 'https://www.usenix.org/')]
  },
  'AGT-056': {
    description: 'Inter-agent calls have no authentication, allowing any agent to be impersonated.',
    remediation: 'Add signed tokens or mutual TLS to every inter-agent call so each agent cryptographically proves its identity before being trusted. Reject unauthenticated messages and rotate signing keys on a schedule. Without authentication, any process or injected payload can impersonate a peer agent and feed it malicious instructions or fabricated data. Ref: CWE-287.',
    references: [ref('CWE-287', 'https://cwe.mitre.org/data/definitions/287.html'), ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/')]
  },
  'AGT-057': {
    description: 'Subagents inherit the full scope of their parent, turning any subagent compromise into a root compromise.',
    remediation: 'Restrict each subagent to only the tools and resources its specific task requires by defining an explicit per-subagent tool list instead of inheriting the parent scope. Deny credentials and filesystem paths not on that list. Full scope inheritance means one compromised subagent immediately holds root-equivalent privileges across the entire system. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('OWASP ASI03', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-058': {
    description: 'The peer-agent allowlist uses a wildcard, permitting any agent to call any other.',
    remediation: 'Replace peer_agents: ["*"] with an explicit list of authorized agent IDs, and review that list whenever agents are added or retired. Deny calls from unlisted peers by default and log rejected attempts. Wildcard peer allowlists permit lateral movement, letting one compromised agent invoke every other agent in the deployment. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/')]
  },
  'AGT-059': {
    description: 'The container runs with privileged mode or host networking, sharing the host kernel.',
    remediation: 'Remove privileged: true and host network mode from the container configuration, then grant only the specific Linux capabilities the workload genuinely needs. Run with a seccomp profile and a read-only root filesystem where possible. Privileged containers share the host kernel and enable straightforward escape to the host operating system. Ref: CWE-250.',
    references: [ref('CWE-250', 'https://cwe.mitre.org/data/definitions/250.html'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-060': {
    description: 'Dangerous host filesystem paths are mounted into the container.',
    remediation: 'Remove volume mounts of /etc, /proc, /var/run/docker.sock, and other host paths from the container specification, replacing them with named volumes or copied configuration files. Mount anything that must remain as read-only. Host path mounts hand a compromised container direct control of host configuration and the container runtime itself. Ref: CWE-269.',
    references: [ref('CWE-269', 'https://cwe.mitre.org/data/definitions/269.html'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-061': {
    description: 'Code execution runs directly on the host OS without microvm or container isolation.',
    remediation: 'Isolate all code execution in gVisor, Firecracker, or an equivalent microvm so agent-generated code never runs directly on the host operating system. Give the sandbox a minimal filesystem, no host credentials, and an egress allowlist. Uncontained execution means one malicious or injected snippet achieves full system compromise immediately. Ref: CWE-250.',
    references: [ref('CWE-250', 'https://cwe.mitre.org/data/definitions/250.html'), ref('OWASP ASI05', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-062': {
    description: 'Sandbox networking has no egress allowlist, enabling data exfiltration from within the sandbox.',
    remediation: 'Add an explicit egress allowlist to the sandbox networking configuration, permitting only the specific domains and ports the workload requires and denying all other outbound traffic by default. Log blocked attempts to surface injection activity early. Unrestricted egress lets compromised sandbox code exfiltrate data and reach command-and-control infrastructure. Ref: OWASP LLM05.',
    references: [ref('OWASP LLM05', 'https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/')]
  },
  'AGT-063': {
    description: 'The inference server is bound to 0.0.0.0 without authentication, exposing the model to the network.',
    remediation: 'Configure the inference server to bind to 127.0.0.1 instead of 0.0.0.0 and add API key or token authentication in front of every endpoint. If remote access is required, place the server behind a reverse proxy with TLS. An unauthenticated server on all interfaces lets anyone on the network run prompts, extract the model, or exhaust your compute. Ref: CWE-284.',
    references: [ref('CWE-284', 'https://cwe.mitre.org/data/definitions/284.html')]
  },
  'AGT-064': {
    description: 'A vulnerable version of an AI framework is in use with known CVEs.',
    remediation: 'Replace the vulnerable AI framework version with the latest patched release, then add automated dependency scanning (Dependabot, Renovate, or osv-scanner) to CI so future advisories surface immediately. Pin the upgraded version in the lockfile. Known CVEs in AI frameworks are actively exploited and frequently provide remote code execution on inference hosts. Ref: OWASP A06.',
    references: [ref('OWASP A06', 'https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/'), ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/')]
  },
  'AGT-065': {
    description: 'Pickle or other unsafe deserialization is used for model or data loading.',
    remediation: 'Replace pickle deserialization with safetensors, JSON, or another format that cannot execute code on load, and convert existing pickle artifacts during a controlled migration. Block pickle loading in CI with a lint rule or hook. Pickle files execute arbitrary embedded code the moment they are loaded, making any downloaded model a potential backdoor. Ref: CWE-502.',
    references: [ref('CWE-502', 'https://cwe.mitre.org/data/definitions/502.html'), ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/')]
  },
  'AGT-066': {
    description: 'trust_remote_code is enabled without pinning the model to a specific revision hash.',
    remediation: 'Pin the model revision to a specific commit hash whenever trust_remote_code is enabled, instead of referencing a branch or tag, and review the remote code at that hash before deployment. Re-pin deliberately when upgrading. Without a pinned revision, the upstream repository owner can push new code that executes in your environment on the next load. Ref: CWE-829.',
    references: [ref('CWE-829', 'https://cwe.mitre.org/data/definitions/829.html'), ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/')]
  },
  'AGT-067': {
    description: 'Model or dataset references are unpinned, allowing silent substitution via mutable aliases.',
    remediation: 'Pin every model and dataset reference to a specific digest or commit hash rather than a name or mutable alias, and record the pinned hashes in version control. Verify hashes at load time where the framework supports it. Mutable references allow silent substitution of poisoned models or datasets through ordinary repository changes. Ref: OWASP LLM03.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/')]
  },
  'AGT-068': {
    description: 'GitHub Action references use mutable tags or branch names instead of commit SHAs.',
    remediation: 'Replace @main, @master, and @v1 GitHub Action references with full 40-character commit SHAs, and add a comment recording the human-readable version for maintenance. Use Dependabot or pin-checking CI to keep the SHAs current. Mutable action refs allow supply chain compromise, since a tag can be repointed to malicious code without any change in your repository. Ref: OWASP LLM03.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/'), ref('SLSA', 'https://slsa.dev/')]
  },
  'AGT-069': {
    description: 'An AI package includes a post-install hook that executes at install time without review.',
    remediation: 'Remove or audit every post-install hook in AI packages before installation, and run installs with --ignore-scripts so lifecycle scripts cannot execute silently. Re-enable scripts only for individually reviewed packages that genuinely require them. Post-install hooks run arbitrary code with your user\'s privileges at install time, with no visibility or prompt. Ref: OWASP LLM03.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/')]
  },
  'AGT-070': {
    description: 'A package name resembles a popular package and may be a typosquat.',
    remediation: 'Replace the suspect dependency with the verified package name after confirming the exact spelling, publisher, and download statistics on the official registry. Add the verified name to an internal allowlist and enable typosquat detection in dependency scanning. Typosquatted packages execute malicious code on install while appearing nearly identical to the legitimate library. Ref: OWASP LLM03.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/')]
  },
  'AGT-071': {
    description: 'Markdown image auto-rendering is enabled, creating exfiltration and SSRF risk via injected image URLs.',
    remediation: 'Disable markdown image auto-rendering in the agent interface, or route all rendered content through DOMPurify or an equivalent sanitizer that strips remote image URLs. Apply a Content Security Policy restricting image sources to trusted hosts. Auto-rendered images let injected markdown exfiltrate conversation data through crafted URLs and probe internal services via SSRF. Ref: CWE-79.',
    references: [ref('CWE-79', 'https://cwe.mitre.org/data/definitions/79.html'), ref('OWASP LLM05', 'https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/')]
  },
  'AGT-072': {
    description: 'LLM output is passed directly to eval(), exec(), or a shell.',
    remediation: 'Never pass LLM output to eval(), exec(), or shell interpreters. Route generated code through a sandboxed executor with no host credentials, an allowlisted command set, and human review for anything privileged. Treat model output exactly like untrusted user input, because injected instructions in any source document become arbitrary code execution here. Ref: CWE-78.',
    references: [ref('CWE-78', 'https://cwe.mitre.org/data/definitions/78.html'), ref('OWASP LLM05', 'https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/')]
  },
  'AGT-073': {
    description: 'LLM output is concatenated directly into SQL strings, enabling SQL injection.',
    remediation: 'Replace string concatenation with parameterized queries or an ORM for every statement that includes LLM output, and grant the agent\'s database role only the minimum tables and operations it needs. Add query linting in CI to catch regressions. SQL injection through model output is trivially exploitable by anyone who can influence a prompt. Ref: CWE-89.',
    references: [ref('CWE-89', 'https://cwe.mitre.org/data/definitions/89.html'), ref('OWASP LLM05', 'https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/')]
  },
  'AGT-074': {
    description: 'Tool call outputs have no JSON schema, allowing unexpected data structures to propagate.',
    remediation: 'Define a JSON schema for every tool call output and validate responses against it before they reach downstream logic, rejecting or quarantining nonconforming payloads. Version the schemas alongside the tool definitions. Unvalidated outputs let unexpected structures, oversized fields, and injected content propagate into systems that assume well-formed data. Ref: CWE-20.',
    references: [ref('CWE-20', 'https://cwe.mitre.org/data/definitions/20.html'), ref('OWASP LLM05', 'https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/')]
  },
  'AGT-075': {
    description: 'No kill switch or circuit breaker is configured for the agent loop.',
    remediation: 'Add a kill_switch or circuit_breaker to the agent loop configuration so operators can halt all agent activity instantly through a single control. Wire it to anomaly thresholds for automatic tripping and test it in staging drills. Without a kill switch, a runaway or hijacked agent keeps acting until someone obtains infrastructure access. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('NIST AI RMF MG-2.1', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-076': {
    description: 'No loop detection or anomaly threshold is configured for the agent.',
    remediation: 'Add a loop_detection_threshold or anomaly detection settings to the agent configuration so repeated tool-call cycles are detected and interrupted automatically. Alert operators when thresholds trip and record the triggering trace for review. Without detection, cyclic behavior runs indefinitely, silently consuming tokens, API quota, and budget until external limits finally fail. Ref: OWASP LLM10.',
    references: [ref('OWASP LLM10', 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/')]
  },
  'AGT-078': {
    description: 'High-risk AI classification is missing required governance artifacts such as impact assessment or human review records.',
    remediation: 'Add impact_assessment, human_review_required: true, and audit_log entries to the high-risk system configuration, and store the completed assessment with version history alongside the deployment. Assign a named owner for ongoing review. High-risk classifications without these governance artifacts violate EU AI Act Article 9 obligations and leave no defensible record for regulators. Ref: EU AI Act Art.9.',
    references: [ref('EU AI Act Art.9', 'https://eur-lex.europa.eu/'), ref('NIST AI RMF GV-1.1', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-079': {
    description: 'Automated decision-making has no contest or appeal endpoint for affected individuals.',
    remediation: 'Add a contest_endpoint URL to the agent configuration for every automated decision affecting individuals, and connect it to a process where a human can review, explain, and reverse the decision. Publish the contest route to affected users. GDPR Article 22 and the EU AI Act both require a meaningful appeal path for automated decisions. Ref: GDPR Art.22.',
    references: [ref('GDPR Art.22', 'https://gdpr.eu/article-22-automated-individual-decision-making/'), ref('EU AI Act Art.13', 'https://eur-lex.europa.eu/')]
  },
  'AGT-080': {
    description: 'A floating model alias such as "latest" is used, allowing silent model substitution.',
    remediation: 'Pin the model to a specific dated version string (for example gpt-4o-2024-05-13) instead of a floating alias such as latest, and record the pinned version in configuration management. Re-evaluate safety and quality before each deliberate upgrade. Floating aliases let the underlying model change silently, invalidating your testing, evaluations, and compliance assumptions overnight. Ref: OWASP LLM03.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/')]
  },
  'AGT-081': {
    description: 'A custom provider base URL is configured, enabling MITM attacks and credential exfiltration.',
    remediation: 'Remove the base_url override and restore the official provider endpoint, then rotate any API keys that were sent to the custom URL while it was active. Add configuration validation that rejects non-official endpoints in production. A custom base URL silently redirects every API call, allowing interception of prompts, responses, and credentials. Ref: CWE-601.',
    references: [ref('CWE-601', 'https://cwe.mitre.org/data/definitions/601.html'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/')]
  },
  'AGT-082': {
    description: 'Agent hooks or settings files live in the repository and can be modified by anyone with repo write access.',
    remediation: 'Move agent hooks and settings out of the source repository into system-level or user-level configuration paths that require elevated privileges to change. Add CI checks that fail when hook or settings files appear in the repo. Repo-controlled hooks execute code on agent start, so anyone with write access can run commands on every contributor\'s machine. Ref: OWASP LLM03.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/')]
  },
  'AGT-083': {
    description: 'A GitHub Actions AI agent has repository write permissions and can be triggered by untrusted inputs.',
    remediation: 'Restrict workflow triggers to refs/heads/main, set pull_request_target: false, and reduce the workflow permissions block to the minimum scopes required, using read-only defaults wherever possible. Require approval for first-time contributors before workflows run. An AI agent holding write permissions on untrusted triggers lets a malicious pull request escalate into full repository takeover. Ref: OWASP LLM03.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/'), ref('GitHub Actions hardening', 'https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions')]
  },
  'AGT-084': {
    description: 'The agent has an inbox-wide or broad email/calendar trigger allowing any sender to invoke it.',
    remediation: 'Restrict triggers to specific sender patterns or a dedicated service account address instead of inbox-wide or calendar-wide rules, and verify sender authenticity with SPF and DKIM checks before the agent processes a message. Quarantine unrecognized senders for human review. Inbox-wide triggers let any external sender invoke the agent and inject instructions through ordinary email. Ref: OWASP LLM01.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI01', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-085': {
    description: 'The configuration explicitly states actions are not logged or audited.',
    remediation: 'Configure structured audit logging for every tool call, decision, and privileged action the agent performs, with retention of at least 90 days in an immutable external store. Include actor, timestamp, parameters, and outcome in each record, and alert on logging pipeline failures. Without audit logs, incidents cannot be reconstructed and compliance obligations cannot be demonstrated.',
    references: [ref('OWASP MCP08', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('EU AI Act Art.12', 'https://eur-lex.europa.eu/'), ref('ISO 42001 A.6.2.4', 'https://www.iso.org/standard/42001')]
  },
  'AGT-086': {
    description: 'The configuration describes unrestricted network access in natural language prose.',
    remediation: 'Define an explicit domain allowlist for all outbound network access and block every egress destination not on the list by default. Review and re-approve the list on a fixed schedule, and log denied attempts to surface injection activity. Unrestricted egress lets a compromised agent exfiltrate data or contact attacker infrastructure from inside your environment.',
    references: [ref('OWASP LLM05', 'https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/'), ref('OWASP ASI01', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-087': {
    description: 'The configuration describes disabled or absent authentication and identity verification.',
    remediation: 'Require authentication for every agent invocation using your identity provider, API keys, or signed tokens, and reject unauthenticated requests by default. Enforce identity verification before any privileged operation, propagating the verified principal into downstream tool calls and audit logs. Without authentication, anyone who can reach the agent can issue commands, access data, and impersonate legitimate users.',
    references: [ref('OWASP A07', 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'), ref('OWASP MCP07', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-088': {
    description: 'The configuration describes flat or absent role-based access control.',
    remediation: 'Define explicit least-privilege roles with scoped capabilities for each class of user and enforce permission checks before every tool invocation. Map each role to the minimum tool set and data scope it requires, deny by default, and audit role assignments regularly. Flat permission models give every user, including compromised accounts, the agent\'s full capability surface.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('OWASP ASI03', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-089': {
    description: 'The configuration explicitly states no rate limits, throttling, or quotas.',
    remediation: 'Set per-user, per-tool, and global rate limits in the agent configuration, together with explicit token and cost budgets per session and per day. Alert when consumers approach their limits and fail closed when budgets are exhausted. Without throttling, a single abusive or hijacked user can exhaust quota, inflate costs, and deny service to everyone else.',
    references: [ref('OWASP LLM10', 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/'), ref('MITRE AML.T0029', 'https://atlas.mitre.org/techniques/AML.T0029')]
  },
  'AGT-090': {
    description: 'The rules describe a flexible instruction hierarchy where later input can override earlier constraints.',
    remediation: 'Enforce an immutable instruction hierarchy by stating in the system prompt that system rules can never be overridden, and configure the agent to refuse priority changes requested by incoming content. Strip or flag phrases like "ignore previous instructions" during input filtering. A flexible hierarchy lets any injected document or message silently replace your safety constraints.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI01 Goal Hijack', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-091': {
    description: 'The configuration describes returning full records or unredacted sensitive data.',
    remediation: 'Define explicit field allowlists for every data-returning tool and apply PII redaction before content reaches tool output or logs. Enumerate the exact columns each task needs, suppress everything else at the query layer, and test the redaction patterns in CI. Returning full unredacted records turns every agent response into potential breach material.',
    references: [ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-092': {
    description: 'The configuration describes bypassing human approval for sensitive actions.',
    remediation: 'Require human-in-the-loop approval for every destructive, irreversible, or expensive action, with fail-closed timeouts so an unanswered request blocks rather than proceeds. Define the sensitive action list explicitly, route approvals to named roles, and log each decision. Removing the approval gate lets one injected instruction trigger irreversible damage with no human checkpoint.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('OWASP ASI09', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('ISO 42001 A.6.2.3', 'https://www.iso.org/standard/42001')]
  },
  'AGT-093': {
    description: 'The configuration permits self-modification or host persistence across sessions.',
    remediation: 'Mark rules files read-only at the filesystem level and block agent writes to persistence mechanisms including shell profiles, cron, schedulers, and startup directories. Alert on any attempted modification and require human review for legitimate rule changes. An agent that can rewrite its own rules or persist on the host escalates a single injection into durable compromise.',
    references: [ref('OWASP ASI06', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-094': {
    description: 'The configuration describes broad or unrestricted tool and execution capabilities.',
    remediation: 'Limit tool permissions to the minimum scope each task requires, replacing broad execution or filesystem grants with narrowly enumerated capabilities. Document and approve every remaining high-privilege capability with a named owner, and re-review the inventory on a schedule. Broad capability grants turn any prompt injection into command execution with the agent\'s full power.',
    references: [ref('OWASP ASI03', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI RMF GV-1.3', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-095': {
    description: 'The configuration describes bypassing or disabling safety checks and guardrails.',
    remediation: 'Configure safety filtering and moderation controls to run by default on every request, with fail-closed behavior when the safety service errors or times out. Remove any flags, environment variables, or prose instructions that allow safety checks to be skipped, and alert if they reappear. Disabled guardrails leave injection and harmful output completely unmitigated.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-096': {
    description: 'The configuration grants elevated privileges based on user self-claims without identity verification.',
    remediation: 'Require identity and role verification through your authentication provider before any privileged action, resolving the requester\'s actual permissions from the IdP or authorization service. Never trust user self-attestation such as claims of being an admin or manager. Trust-on-claim grants let any user or injected message escalate to full privileges with a single sentence.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('OWASP ASI03', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI RMF GV-1.3', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-097': {
    description: 'The configuration directs the agent to act on instructions found in documents, attachments, invoices, or emails.',
    remediation: 'Mark all document, attachment, invoice, and email content as untrusted data, never as instructions. Wrap it in explicit delimiters, instruct the model to only summarize or analyze it, and require human review before acting on anything it requests. Following embedded directives lets any sender execute indirect prompt injection through ordinary business documents.',
    references: [ref('OWASP LLM01:2025', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI01 Goal Hijack', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('Simon Willison indirect prompt injection', 'https://simonwillison.net/tags/prompt-injection/')]
  },
  'AGT-098': {
    description: 'The configuration combines multiple sensitive domains into single exports, increasing privacy and breach impact.',
    remediation: 'Isolate exports by sensitive domain so health, financial, location, and communication data are never combined into a single artifact. Apply strict data minimization to each export and require explicit human approval whenever three or more sensitive categories would be joined. Cross-domain aggregation multiplies re-identification risk and breach impact far beyond any single dataset.',
    references: [ref('GDPR Art.5(1)(c)', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1 Data Privacy', 'https://www.nist.gov/itl/ai-risk-management-framework'), ref('ISO 42001 A.7.5', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-099': {
    description: 'The configuration allows scheduled tasks to persist original permissions without re-validation at execution time.',
    remediation: 'Require permission and approval re-validation at every scheduled execution rather than trusting the grants captured at creation time. Set expiration on schedule scopes, and force human reconfirmation for long-running recurring tasks at a fixed interval. Persisted permissions let a task keep running with privileges its owner has since lost or that were granted under different conditions.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('NIST AI RMF MG-2.1', 'https://www.nist.gov/itl/ai-risk-management-framework'), ref('ISO 42001 A.6.2.3', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-100': {
    description: 'The configuration uses logs as a channel that may capture sensitive context and export it externally.',
    remediation: 'Configure redaction of PII and secrets before anything is written to logs, restrict log destinations to an approved list of internal systems, and apply DLP scanning to log streams. Block user-directed log forwarding entirely. Logs that capture sensitive context and flow to external destinations become a quiet, durable exfiltration channel that bypasses normal data controls.',
    references: [ref('OWASP A09', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'), ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-101': {
    description: 'The configuration permits payment/banking detail changes from email or document content without out-of-band verification.',
    remediation: 'Require out-of-band verification with a known contact on file before any ACH, wire, or payment routing change requested through email or documents. Add a mandatory waiting period and dual approval for routing updates, and never accept callback numbers supplied in the request itself. These controls directly counter business email compromise, the costliest fraud category on record.',
    references: [ref('FBI IC3 BEC', 'https://www.ic3.gov/Media/PDF/AnnualReport/2024_IC3Report.pdf'), ref('NIST SP 800-63B', 'https://pages.nist.gov/800-63-4/sp800-63b.html'), ref('ISO 42001 A.6.2.3', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-102': {
    description: 'The configuration enables fetch-and-execute behavior from untrusted URLs or user-provided sources.',
    remediation: 'Never execute content fetched from untrusted or user-provided URLs. Enforce a strict domain allowlist for all fetch operations, run any retrieved artifact only inside an isolated sandbox without credentials, and require human approval before any fetch-then-execute workflow. Fetch-and-execute behavior gives an attacker remote code execution through nothing more than a crafted link.',
    references: [ref('OWASP A10 SSRF', 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/'), ref('OWASP LLM05', 'https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/'), ref('MITRE ATLAS T1059', 'https://atlas.mitre.org/techniques/AML.T0011')]
  }
  ,
  'AGT-103': {
    description: 'The configuration persists user-provided instructions/workflows and reapplies them in future sessions, enabling durable memory poisoning.',
    remediation: 'Never auto-persist user-provided content as executable behavior or standing instructions. Require explicit human approval before anything is saved to durable memory, scope each saved item to the originating user and session, and provide an administrative purge path. Auto-persisted instructions become durable memory poisoning that silently shapes every future session for every affected user.',
    references: [ref('OWASP ASI06 Memory Poisoning', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('Embrace the Red spAIware', 'https://embracethered.com/blog/posts/2025/chatgpt-spaiware/'), ref('MemoryGraft arXiv:2512.16962', 'https://arxiv.org/abs/2512.16962')]
  },
  'AGT-104': {
    description: 'User/external content is indexed into knowledge stores and later treated as trusted instructions, creating durable RAG poisoning risk.',
    remediation: 'Mark all retrieved and indexed content as untrusted data that the model may quote or summarize but never obey. Restrict index writes to authenticated internal systems, require provenance signing for ingested documents, and audit the corpus for injected instructions. Poisoned knowledge bases convert one malicious upload into persistent instructions served to every future query.',
    references: [ref('PoisonedRAG', 'https://www.usenix.org/'), ref('AgentPoison', 'https://arxiv.org/'), ref('OWASP LLM08', 'https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/')]
  },
  'AGT-105': {
    description: 'Security/safe-mode controls can be disabled based on user-claimed debug/test contexts.',
    remediation: 'Require privileged authentication plus out-of-band approval before any security-impacting feature flag or safe-mode control can be disabled, and never accept end-user self-attestation of debug or test contexts. Log every flag change immutably and alert security on each toggle. User-toggleable safety controls let an attacker simply ask their way past your protections.',
    references: [ref('OWASP A05', 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'), ref('HiddenLayer Policy Puppetry', 'https://hiddenlayer.com/innovation-hub/novel-universal-bypass-for-all-major-llms/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-106': {
    description: 'Behavior is automatically adapted from aggregated user feedback, enabling coordinated model-policy drift attacks.',
    remediation: 'Require human-reviewed, version-controlled policy updates for every behavior change instead of automatically adapting from aggregated user feedback. Route proposed adjustments through change management with a named approver, and monitor feedback channels for coordinated manipulation patterns. Automatic feedback-driven adaptation lets a coordinated group of accounts steer the agent\'s policies toward attacker-chosen behavior.',
    references: [ref('OWASP ASI06 Goal Hijack', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('MITRE ATLAS T0054', 'https://atlas.mitre.org/techniques/AML.T0054/'), ref('Anthropic model manipulation', 'https://www.anthropic.com/research')]
  },
  'AGT-107': {
    description: 'Users can downgrade sensitivity/classification labels, bypassing downstream controls that trust current labels.',
    remediation: 'Restrict classification changes so users can only upgrade sensitivity labels, never downgrade them. Require privileged approval and an immutable audit trail for every downgrade, and enforce export controls against the original classification until a downgrade is formally approved. User-driven downgrades let an attacker relabel restricted data and walk it past every downstream control.',
    references: [ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('ISO 42001 A.7.5', 'https://www.iso.org/standard/81230.html'), ref('NIST AI 600-1 Data Governance', 'https://www.nist.gov/')]
  },
  'AGT-108': {
    description: 'Calendar invites and meeting artifacts are treated as actionable instructions, creating an indirect prompt-injection channel.',
    remediation: 'Mark calendar invites, meeting titles, and meeting artifacts as untrusted data, never executing directives embedded in them, and keep calendar integration read-only for summaries. Strip or neutralize imperative content before it reaches the model context, and require human confirmation for any action a calendar item appears to request. Calendar entries are an attacker-writable injection channel.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI01 Goal Hijack', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('Willison indirect injection', 'https://simonwillison.net/tags/prompt-injection/')]
  },
  'AGT-109': {
    description: 'Alert routing/suppression can be changed by user input, enabling attackers to mute or divert security notifications.',
    remediation: 'Pin alert and notification channels to authenticated internal destinations defined in version-controlled configuration, and never permit user input to suppress, redirect, or delete security notifications. Require privileged approval with audit logging for any routing change, and alert on modification attempts. User-controllable alert routing lets attackers silence the very signals defenders rely on during an intrusion.',
    references: [ref('OWASP A09', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'), ref('OWASP ASI08', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI RMF Measure 2.5', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-110': {
    description: 'Analytics/reporting permits tiny cohorts or user-level identifiers, allowing re-identification in "aggregate" outputs.',
    remediation: 'Enforce minimum cohort thresholds in all analytics and reporting, requiring at least five and ideally twenty or more individuals per reported group, and never export raw user-level identifiers in aggregate outputs. Suppress or merge small cells automatically rather than relying on analyst judgment. Tiny cohorts allow trivial re-identification of individuals from supposedly anonymous reports.',
    references: [ref('GDPR Art.5(1)(c)', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1 Privacy Risk', 'https://www.nist.gov/'), ref('Differential Privacy', 'https://www.nist.gov/')]
  },
  'AGT-111': {
    description: 'Tokens/secrets may be exported, emailed, or attached for diagnostics, enabling direct credential exfiltration.',
    remediation: 'Never expose live tokens or secrets in exports, emails, attachments, or diagnostic bundles. Provide metadata-only token views such as name, scope, creation date, and last-used timestamp, and direct integrations to introspection endpoints for validity checks. Any channel that emits a live credential converts a routine support request into immediate account compromise.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('OWASP MCP01', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-112': {
    description: 'Impersonation/session-control and credential-reset capability appear together without explicit approval gating.',
    remediation: 'Require dual approval before impersonation or credential-reset operations execute, record both capabilities in immutable audit logs, and send out-of-band notification to the affected user whenever either is used. Separate the two permissions so no single role holds both. Combined impersonation and reset capability is a complete account takeover kit for any attacker who reaches the agent.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('OWASP A07', 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'), ref('MITRE T1078', 'https://attack.mitre.org/techniques/T1078/')]
  },
  'AGT-113': {
    description: 'Audit trails may be shortened, deleted, or suppressed after incidents or routine activity.',
    remediation: 'Configure logs as immutable and write-once, retain them for at least 90 days, and remove all deletion or truncation capability from agent-accessible tooling. Route any retention change through privileged change management, and treat deletion or shortening requests as security incidents to investigate. Tamperable audit trails let attackers erase the evidence of their own activity.',
    references: [ref('OWASP A09', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'), ref('EU AI Act Art.19', 'https://eur-lex.europa.eu/'), ref('SOX Section 802', 'https://www.sec.gov/')]
  },
  'AGT-114': {
    description: 'Translation/transformation workflows allow full-context export, bypassing minimization/redaction controls.',
    remediation: 'Enforce identical field allowlists and redaction rules on translated, summarized, or otherwise transformed outputs as on the original data, applying the controls after transformation rather than before. Reject accuracy or completeness arguments as grounds for bypassing minimization. Transformation workflows that export full context become a loophole that quietly defeats every redaction control you have deployed.',
    references: [ref('GDPR Art.5(1)(c)', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1', 'https://www.nist.gov/'), ref('ISO 42001 A.7.5', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-115': {
    description: 'Public/unauthenticated sharing is allowed without expiration, DLP scanning, or recipient verification.',
    remediation: 'Require short-lived share links that expire within 24 hours, DLP scanning of shared content before link creation, and full logging of link generation and access. Prefer authenticated, recipient-restricted sharing over public links for anything sensitive. Public links without expiration circulate indefinitely through forwards and search indexes, leaking data long after the original purpose has ended.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('ISO 42001 A.7.5', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-116': {
    description: 'CI/build logs may be posted to Slack/email and may reveal masked secrets during troubleshooting.',
    remediation: 'Never post raw CI or build logs to Slack, email, or other external channels. Enforce secret masking in the CI provider, scrub log output through a redaction filter before any sharing, and treat every leaked-secret pattern as an incident requiring immediate rotation. Build logs routinely capture tokens and credentials that masking misses during troubleshooting.',
    references: [ref('CVE-2025-53773', 'https://nvd.nist.gov/'), ref('GitHub Actions secret scanning', 'https://docs.github.com/en/code-security/secret-scanning'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/')]
  },
  'AGT-117': {
    description: 'Dangerous combo detected: impersonation + credential reset without dual-approval gate.',
    remediation: 'Require dual approval and immutable audit logging for every impersonation and credential-change operation, and notify the affected account holder out-of-band whenever either action occurs. Separate the permissions so no single operator or agent holds both unilaterally. Impersonation combined with credential reset is a complete account takeover chain requiring no further attacker steps.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('MITRE T1078', 'https://attack.mitre.org/techniques/T1078/')]
  },
  'AGT-118': {
    description: 'Dangerous combo detected: token/credential read paths plus external send capability without redaction.',
    remediation: 'Block raw secret exports across every external transfer channel and enforce automatic token redaction on all outbound content, including email, webhooks, file shares, and chat integrations. Grant credential-read access only to tools that have no external send capability. Token read paths combined with external send form a direct, two-step credential exfiltration pipeline.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('OWASP MCP01', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-119': {
    description: 'Dangerous combo detected: URL fetch + code execution without sandbox/isolation controls.',
    remediation: 'Isolate all code execution in a sandbox or microVM with no host credentials, a minimal filesystem, and an egress allowlist, and forbid direct fetch-and-execute workflows entirely. Require human approval before any fetched artifact runs even inside the sandbox. URL fetch combined with unsandboxed execution hands attackers remote code execution through a single crafted link.',
    references: [ref('OWASP ASI05', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('OWASP A10 SSRF', 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/')]
  },
  'AGT-120': {
    description: 'Dangerous combo detected: direct production database access combined with bulk export capability and no human approval gate. This is a complete data breach pipeline requiring no additional attacker steps.',
    remediation: 'Require a human approval workflow plus row and field constraints for every production-data export, and separate read privileges from export privileges so no single capability can do both. Enforce per-export sign-off with logged justification and destination verification. Direct database access combined with bulk export and no approval gate is a complete, ready-made data breach pipeline.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-121': {
    description: 'Dangerous combo detected: production deployment + urgency-based bypass of CI/review requirements.',
    remediation: 'Enforce mandatory code review, passing CI checks, and change-window controls for every production deployment, with no urgency-based exceptions. Provide a defined break-glass procedure that requires dual authorization and creates an immutable audit record instead of silently skipping safeguards. Urgency bypasses are exactly the path attackers and injected instructions use to push malicious changes.',
    references: [ref('OWASP A05', 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'), ref('NIST SSDF', 'https://csrc.nist.gov/Projects/ssdf')]
  },
  'AGT-077': {
    description: 'No content safety or moderation layer is configured for user-facing inputs or LLM outputs. This directly enables prompt injection, jailbreaks, and policy bypass attacks with no safety backstop.',
    remediation: 'Add a fail-closed content safety layer (for example OpenAI Moderation, Azure Content Safety, or NeMo Guardrails) covering all user message inputs and all LLM outputs before they reach tools or users. Set fail_closed: true so safety service failures block traffic rather than passing it through. Without moderation, prompt injection, jailbreaks, and policy bypass attacks reach the model with no safety backstop.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP ASI09', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-122': {
    description: 'The configuration permits plugin installation from arbitrary sources without signature/checksum verification or source trust controls.',
    remediation: 'Restrict plugin installation to signed packages from trusted registries only, pin exact versions and checksums for each approved plugin, and run plugin code in an isolated runtime with minimal permissions. Require human approval before any new plugin is installed. Unsigned plugins from arbitrary sources execute attacker-controlled code inside the agent with its full privileges.',
    references: [ref('OWASP A08', 'https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/'), ref('OWASP ASI05', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('SLSA', 'https://slsa.dev/')]
  },
  'AGT-123': {
    description: 'The configuration allows runtime user-provided webhook/callback destinations for exports or reports, creating an exfiltration channel.',
    remediation: 'Enforce a fixed domain allowlist for webhook and callback destinations, require approval before any new external destination is added, and sign outbound payloads so receivers can verify origin. Block sensitive exports to requester-supplied URLs entirely. Runtime user-provided destinations let any requester point your data pipeline at infrastructure they control and quietly siphon exports.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('OWASP A10 SSRF', 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-124': {
    description: 'The configuration permits IAM/Terraform/control-plane permission changes without mandatory approval and review.',
    remediation: 'Require explicit human approval and change review before any IAM, Terraform, or control-plane permission change is applied, and prohibit automated admin grants outright. Enforce scoped roles with expiration on every grant, and alert on policy changes made outside the pipeline. Unreviewed infrastructure permission changes let one injected instruction escalate into durable cloud-wide compromise.',
    references: [ref('MITRE T1098', 'https://attack.mitre.org/techniques/T1098/'), ref('MITRE T1136', 'https://attack.mitre.org/techniques/T1136/'), ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/')]
  },
  'AGT-125': {
    description: 'The configuration allows disclosure of system/developer prompts, hidden policies, or internal routing logic.',
    remediation: 'Never reveal system prompts, developer instructions, hidden policies, or internal routing logic to users or external endpoints. Configure the agent to respond with a high-level safe summary instead, block direct disclosure requests, and log extraction attempts as reconnaissance. Disclosed internal instructions give attackers a precise map for crafting jailbreaks and targeted injections.',
    references: [ref('OWASP LLM07', 'https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/'), ref('MITRE ATLAS T0056', 'https://atlas.mitre.org/techniques/AML.T0056/'), ref('OWASP ASI01', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-126': {
    description: 'The configuration grants access without strong limits, expiration, or periodic review, enabling privilege creep.',
    remediation: 'Limit every access grant with least-privilege scoping, an approval gate, binding to a ticket or documented justification, and automatic expiry, and run periodic access reviews that revoke anything unused. Alert when grants approach expiry rather than auto-renewing them silently. Unbounded grants accumulate into privilege creep that expands the blast radius of any future compromise.',
    references: [ref('NIST SP 800-53 AC-2', 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final'), ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('CIS Control 6', 'https://www.cisecurity.org/controls/access-control-management')]
  },
  'AGT-127': {
    description: 'The configuration permits requests to cloud metadata services, localhost, or private/internal network targets.',
    remediation: 'Block requests to cloud metadata endpoints (169.254.169.254), localhost, and private network ranges by default in every fetch or HTTP tool, and enforce an explicit allowlist for all outbound destinations. Require brokered, audited access for legitimate diagnostics. Metadata SSRF hands attackers cloud credentials directly, turning one crafted URL into account-level compromise.',
    references: [ref('OWASP A10 SSRF', 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/'), ref('AWS IMDSv2', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html'), ref('GCP Metadata', 'https://cloud.google.com/compute/docs/metadata/overview')]
  },
  'AGT-128': {
    description: 'The configuration allows alert/notification routing changes based on unverified requests and without expiry/approval.',
    remediation: 'Require ownership verification before any alert or notification routing change, restrict recipients to an approved allowlist, and gate every route change behind explicit approval with immutable audit logging. Set automatic expiry on temporary routes so diversions cannot persist silently. Unverified routing changes let attackers divert or mute security notifications during an active intrusion.',
    references: [ref('OWASP A09', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'), ref('OWASP ASI08', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('NIST AI RMF Measure 2.5', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-129': {
    description: 'The configuration permits public link sharing without recipient verification, expiration, DLP, or access review.',
    remediation: 'Require recipient-restricted sharing with short expiry windows, DLP scanning before link creation, watermarking of sensitive documents, and recurring access reviews of active links. Block folder-wide public sharing outright and log every link that gets created. Public links without verification or expiration spread beyond the intended audience and remain harvestable indefinitely.',
    references: [ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('GDPR Art.5', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('ISO 42001 A.7.5', 'https://www.iso.org/standard/81230.html')]
  },
  'AGT-130': {
    description: 'The configuration enables user impersonation/account takeover workflows without strong consent verification and approval controls.',
    remediation: 'Require verified customer consent before any impersonation session begins, restrict impersonation to scoped read-only access, write immutable break-glass logs for every session, and enforce strict identity verification before password resets. Notify the affected user out-of-band each time. Unconstrained impersonation workflows are a packaged account takeover capability waiting for misuse or injection.',
    references: [ref('OWASP A07', 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'), ref('MITRE T1078', 'https://attack.mitre.org/techniques/T1078/'), ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/')]
  },
  'AGT-131': {
    description: 'Aggregate analytics policies permit small cohorts or direct identifiers, enabling re-identification.',
    remediation: 'Set minimum cohort thresholds for every aggregate analytics output, automatically suppress groups that fall below the threshold, and remove direct identifiers before any report is generated. Require privacy review for analytics shared externally. Small cohorts and embedded identifiers allow individuals to be re-identified from outputs that appear safely aggregated, defeating the purpose of anonymization.',
    references: [ref('GDPR Art.5(1)(c)', 'https://gdpr.eu/article-5-how-to-process-personal-data/'), ref('NIST AI 600-1 Privacy Risk', 'https://www.nist.gov/'), ref('k-anonymity', 'https://en.wikipedia.org/wiki/K-anonymity')]
  },
  'AGT-132': {
    description: 'Logs are used as a data transfer channel for sensitive request context and external destinations.',
    remediation: 'Configure redaction of sensitive fields before log writes, block headers, cookies, and auth claims from ever being logged, and restrict external log exports to an approved destination list. Apply retention limits and immutability controls to the log store. Logs that capture request context become a covert exfiltration channel that bypasses the controls guarding primary data stores.',
    references: [ref('OWASP A09', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'), ref('OWASP LLM02', 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/'), ref('NIST AI 600-1', 'https://www.nist.gov/')]
  },
  'AGT-133': {
    description: 'Authorization decisions rely on requester claims (role/approval/consent) without independent verification.',
    remediation: 'Require independent verification of identity, role, approval, and consent claims against authoritative systems such as your IdP and ticketing platform before any privileged action executes. Reject requests whose claims cannot be verified, and log every verification outcome. Trust-on-claim authorization lets any requester, or any injected message, obtain privileges simply by asserting them.',
    references: [ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'), ref('NIST SP 800-63', 'https://pages.nist.gov/800-63-4/'), ref('OWASP ASI03', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-134': {
    description: 'User-supplied workflows/pipelines are saved for future automatic reuse without review, enabling persistent abuse.',
    remediation: 'Require human review before any user-supplied workflow or pipeline is saved for reuse, scope each saved workflow\'s permissions to the minimum its steps require, and demand approval for external destinations. Set expiration dates and audit trails on every stored workflow. Unreviewed reusable workflows persist attacker logic that executes repeatedly with standing permissions. Ref: OWASP ASI06.',
    references: [ref('OWASP ASI06', 'https://owasp.org/www-project-top-10-for-agentic-applications/'), ref('MITRE ATLAS T0051', 'https://atlas.mitre.org/techniques/AML.T0051/'), ref('NIST AI RMF MG-2.1', 'https://www.nist.gov/itl/ai-risk-management-framework')]
  },
  'AGT-135': {
    description: 'MCP server configured without a pinned version, commit hash, or checksum, enabling silent substitution of a malicious server.',
    remediation: 'Pin every MCP server to a specific version tag (for example @1.2.3) or commit hash, and never reference latest, main, or master. Verify checksums where the registry provides them and update pins only through reviewed changes. Unpinned servers can be silently replaced upstream, handing an attacker the full tool access your agent grants that server. Ref: OWASP LLM03.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/'), ref('MITRE AML.T0060', 'https://atlas.mitre.org/techniques/AML.T0060')]
  },
  'AGT-136': {
    description: 'Agent instructions permit installing packages without a lockfile or integrity check, allowing dependency confusion or substitution attacks.',
    remediation: 'Require --frozen-lockfile (pnpm) or npm ci for every agent-executed install so dependency resolution matches the committed lockfile exactly, and block agents from installing arbitrary packages outside it. Commit and review lockfile changes like any other code. Installs without a pinned lockfile expose the pipeline to dependency confusion and silent package substitution attacks. Ref: OWASP LLM03.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/')]
  },
  'AGT-137': {
    description: 'Agent instructions permit cloning from arbitrary or user-supplied git URLs, enabling supply chain injection via attacker-controlled repositories.',
    remediation: 'Restrict git clone operations to an explicit allowlist of approved repository URLs enforced at the tool permission layer, and never allow agents to clone from user-provided or dynamically constructed URLs. Log denied clone attempts for review. Cloning attacker-controlled repositories pulls malicious hooks, build scripts, and poisoned instructions directly into the agent\'s working environment. Ref: OWASP LLM03, MITRE T1195.',
    references: [ref('OWASP LLM03', 'https://genai.owasp.org/llmrisk/llm032025-supply-chain/'), ref('MITRE T1195', 'https://attack.mitre.org/techniques/T1195/')]
  },
  'AGT-138': {
    description: 'Agent instructions permit writing to shell startup files (.bashrc, .zshrc, .profile), enabling persistence that survives session termination.',
    remediation: 'Never permit agents to write to shell startup files such as .bashrc, .zshrc, or .profile. Block write access to all shell init paths at the tool permission layer and alert on any attempted modification. Persistence planted in startup files executes in every future shell session and survives agent termination, reboots, and reinstalls. Ref: OWASP LLM08, MITRE T1546.004.',
    references: [ref('OWASP LLM08', 'https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/'), ref('MITRE T1546.004', 'https://attack.mitre.org/techniques/T1546/004/')]
  },
  'AGT-139': {
    description: 'Agent instructions permit creating cron jobs or scheduled tasks, enabling persistent code execution that survives agent session termination.',
    remediation: 'Never permit agents to create cron jobs, crontab entries, or systemd timers. Remove cron and scheduler write access from agent tool permissions, monitor crontab and timer directories for unexpected changes, and treat any agent-created schedule as an incident. Scheduled task creation is a primary persistence mechanism that keeps attacker code running long after the session ends. Ref: OWASP LLM08, MITRE T1053.',
    references: [ref('OWASP LLM08', 'https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/'), ref('MITRE T1053', 'https://attack.mitre.org/techniques/T1053/')]
  },
  'AGT-140': {
    description: 'Agent instructions permit installing or enabling systemd services, enabling root-level persistence that survives reboots.',
    remediation: 'Never permit agents to install or enable systemd services. Restrict agent filesystem access to exclude /etc/systemd and /usr/lib/systemd, deny systemctl invocation in tool permissions, and alert on new unit files. Service installation provides root-level persistence that starts automatically at boot and survives reboots, giving attackers a durable foothold on the host. Ref: OWASP LLM08, MITRE T1543.002.',
    references: [ref('OWASP LLM08', 'https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/'), ref('MITRE T1543.002', 'https://attack.mitre.org/techniques/T1543/002/')]
  },
  'AGT-141': {
    description: 'Agent instructions permit forwarding the system prompt or internal configuration to an external endpoint, exposing operational constraints and jailbreak surface.',
    remediation: 'Configure the agent to never reveal its system prompt, internal instructions, or configuration to any user or external endpoint, and treat the system prompt as a secret equivalent to a credential. Block forwarding tools from accepting prompt content as payload and log every extraction attempt as reconnaissance. Leaked prompts expose the operational constraints attackers use to craft precise jailbreaks. Ref: OWASP LLM07, OWASP LLM10.',
    references: [ref('OWASP LLM07', 'https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/'), ref('OWASP LLM10', 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/')]
  },
  'AGT-142': {
    description: 'Agent instructions permit bulk-exporting all data to a user-provided or unverified destination with no field filter, enabling complete data exfiltration.',
    remediation: 'Never permit agents to bulk-export data to user-provided or unverified destinations. Enforce a field allowlist on every data access tool, verify export destinations against a fixed approved list, and require human approval with logged justification before any bulk operation runs. Unfiltered bulk export to arbitrary destinations is complete data exfiltration in a single step. Ref: OWASP LLM10, NIST AI 600-1.',
    references: [ref('OWASP LLM10', 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/'), ref('NIST AI 600-1', 'https://airc.nist.gov/Home')]
  },
  'AGT-143': {
    description: 'The policy permits the agent to publish or send generated content externally (blog, docs, social, customer replies, knowledge base) with no human review or fact-check step, allowing fabricated claims to reach readers at scale.',
    remediation: 'Require human editorial review and an explicit fact verification step before any generated article, reply, documentation update, or social post is published externally. Configure the publishing tool to hold drafts in a review queue, record the reviewer identity, and block direct external sends entirely. Unreviewed generated content spreads fabricated claims at scale and erodes reader trust in every channel it touches. Ref: OWASP LLM09.',
    references: [ref('OWASP LLM09', 'https://genai.owasp.org/llmrisk/llm092025-misinformation/'), ref('NIST AI 600-1', 'https://airc.nist.gov/Home')]
  },
  'AGT-144': {
    description: 'The configuration states that answers do not require sources, citations, or grounding, or permits answering from general knowledge in regulated factual domains such as medical, legal, or financial advice.',
    remediation: 'Require grounding to a verified corpus with explicit citations for every factual answer, and configure retrieval so responses in medical, legal, and financial domains must cite approved sources or refuse to answer. Remove any policy text that marks citations as optional, and log every answer produced without sources for review. Ungrounded answers in regulated domains deliver confident misinformation directly to users who act on it. Ref: OWASP LLM09.',
    references: [ref('OWASP LLM09', 'https://genai.owasp.org/llmrisk/llm092025-misinformation/'), ref('NIST AI 600-1', 'https://airc.nist.gov/Home')]
  },
  'AGT-145': {
    description: 'Instructions forbid the agent from expressing uncertainty or require it to always provide a confident answer, forcing assertive responses even when the model does not know.',
    remediation: 'Remove every instruction that forbids the agent from expressing uncertainty or that requires an answer regardless of confidence. Configure the system prompt to state that the agent must disclose uncertainty, may answer that it does not know, and should defer to a human reviewer when confidence is low. Forced confidence converts ordinary model errors into authoritative sounding misinformation that users have no signal to question. Ref: OWASP LLM09.',
    references: [ref('OWASP LLM09', 'https://genai.owasp.org/llmrisk/llm092025-misinformation/'), ref('NIST AI 600-1', 'https://airc.nist.gov/Home')]
  },
  'AGT-146': {
    description: 'A single MCP server or tool surface grants filesystem read/write, network access, and code execution together with no approval gate or scope restriction, creating a high-impact poisoning and exfiltration path.',
    remediation: 'Separate filesystem, network, and code-execution capabilities across distinct least-privilege MCP servers rather than granting all three through one tool surface. Require explicit human approval for any write or execution action, restrict each server to an allowlisted scope, and run untrusted servers inside a sandbox. Combined read-write-execute access on one surface lets a poisoned server read secrets and exfiltrate them in a single hop. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('OWASP Agentic Top 10', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-147': {
    description: 'On a tool-call error, denial, or unauthorized response the agent retries with elevated, admin, or broader scope, or proceeds regardless, turning an authorization failure into a privilege escalation path.',
    remediation: 'Require the agent to fail closed on every authorization error, denial, or unauthorized response, halting the action rather than retrying with elevated or broader scope. Remove any instruction that permits proceeding regardless, escalating scope, or using admin credentials after a failure. Route blocked actions to human review instead. Treating a denial as a trigger to widen permissions inverts the entire access-control model. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('OWASP A01', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/')]
  },
  'AGT-148': {
    description: 'A subagent, worker, or delegate inherits the same or higher permissions as its orchestrator with no downscoping, so compromising any child agent yields the full privilege of the coordinating agent.',
    remediation: 'Define an explicit reduced scope for every subagent, worker, and delegate, granting only the tools and data its specific task needs instead of inheriting the orchestrator scope. Deny credentials and capabilities not on that narrowed list, and review delegated scopes whenever new agents are added. Equal or higher inheritance turns one compromised child agent into a root-equivalent foothold across the system. Ref: OWASP LLM06.',
    references: [ref('OWASP LLM06', 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/'), ref('OWASP Agentic Top 10', 'https://owasp.org/www-project-top-10-for-agentic-applications/')]
  },
  'AGT-149': {
    description: 'The agent writes remembered or learned content to persistent memory, files, or a database with no validation, sanitization, or review step, leaving a durable poisoning surface that survives across sessions.',
    remediation: 'Validate and sanitize every item before it is written to persistent memory, files, or a database, and require human review or moderation for content the agent learns from untrusted input. Constrain stored memories to an allowlisted format, scope them per user, and provide a purge path for poisoned entries. Unvalidated persistence plants attacker instructions that silently influence every future session. Ref: OWASP LLM04.',
    references: [ref('OWASP LLM04', 'https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/'), ref('MITRE AML.T0070', 'https://atlas.mitre.org/techniques/AML.T0070')]
  },
  'AGT-150': {
    description: 'Retrieved or external content from URLs, documents, vector stores, or a knowledge base is injected into the prompt or context with no trust boundary, sanitization, or provenance check, creating an indirect prompt injection surface.',
    remediation: 'Establish a trust boundary around all retrieved and external content, treating it as untrusted data wrapped in delimiters rather than instructions before it reaches the prompt. Sanitize retrieved chunks, verify source provenance against an allowlist, and quarantine documents from unapproved origins. Feeding unvetted retrieval output straight into the context lets any poisoned page or document hijack the agent through indirect injection. Ref: OWASP LLM01.',
    references: [ref('OWASP LLM01', 'https://genai.owasp.org/llmrisk/llm012025-prompt-injection/'), ref('OWASP LLM08', 'https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/')]
  }
};

/** The complete catalog of all detection rules (AGT-001 through AGT-150) with descriptions, references, and remediation guidance. */
export const RULE_CATALOG: Rule[] = rules.map((r) => ({
  ...r,
  description: NATURAL_LANGUAGE_OVERRIDES[r.id]?.description ?? `${r.title} misconfiguration detected in agent configuration text.`,
  fileTypes: [...all],
  references: NATURAL_LANGUAGE_OVERRIDES[r.id]?.references ?? [...baseRefs],
  remediation: NATURAL_LANGUAGE_OVERRIDES[r.id]?.remediation ?? `Restrict this agent's configuration to least privilege for ${r.id}: enumerate the exact tools, files, and network destinations the agent requires, deny everything else by default, and add explicit human approval gates before destructive or external-facing actions. Set secure default values for every relevant option rather than relying on permissive fallbacks, and log each privileged operation so misuse of this misconfiguration can be detected and investigated quickly.`
}));
