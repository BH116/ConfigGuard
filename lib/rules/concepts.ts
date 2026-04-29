import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';
 
/**
 * Concept-based detection layer.
 *
 * v2 fixes (verified against 10-config blind test suite):
 * - AGT-133: added team lead, lead, coordinator, nurse, on-call to subject list
 * - AGT-101: added "contacts us to say", "once the supplier confirms" patterns
 * - AGT-132: added session bundle + posted to Slack; token snapshots; broader logsContainSensitive
 * - AGT-123: added DSP API, client portal endpoint, Slack webhook URL configured-by patterns
 * - AGT-124: added detach_iam_role, modify_security_group, update_permission_policy,
 *            terminate_ec2_instance, deploy_remediation_script, create_service_token
 * - AGT-126: added "remain in their modified state", "do not have automatic expiry",
 *            "stay active until manually disabled"
 * - AGT-098: added deliver_to_client_portal and portal/delivery tools as export signal;
 *            added support ticket, pulse survey, absence, feedback score categories
 * - AGT-134: added build_insight_template, run_insight_template, build_report_template,
 *            run_report_template, "whenever new data is ingested", "each month when"
 */
export const runConceptRules = (parsed: ParsedConfig): Finding[] => {
  const c = parsed.content;
  const has = (r: RegExp) => r.test(c);
  const found = new Map<string, Finding>();
 
  const add = (id: string, excerptRegex?: RegExp, severity?: Finding['severity']) => {
    if (found.has(id)) {
      if (severity) found.get(id)!.severity = severity;
      return;
    }
    const excerpt = excerptRegex ? c.match(excerptRegex)?.[0] : undefined;
    const f = finding(id, excerpt);
    if (severity) f.severity = severity;
    found.set(id, f);
  };
 
  // ============================================================
  // SUPPRESSOR
  // ============================================================
  const hasStrongPrivacyControls =
    has(/\b(?:pii_redaction|field_allowlist|sanitize_output|sensitive_tables\s*:\s*false|tenant_id|data_retention_days|data_residency)\b/i) &&
    has(/\b(?:requires_approval|human_oversight|human_approval|kill_switch|output_rails|input_rails)\b/i);
 
  // ============================================================
  // TRUST PRIMITIVES
  // ============================================================
  const trustSubjects = '(?:adjuster|requestor|requester|engineer|employee|manager|user|rep|sales|support|caller|partner|vendor|contact|customer|client|sales\\s+team\\s+member|team\\s+lead|lead|coordinator|nurse|care\\s+coordinator|on.call|clinician|physician|pharmacist|operator|analyst|administrator|auditor|advisor|consultant|sponsor)';
 
  const trustOnClaimDirect =
    has(new RegExp(`\\b(if|when)\\b[^.\\n]{0,60}\\b${trustSubjects}\\b[^.\\n]{0,80}\\b(says?|claims?|states?|indicates?|tells?|describes?|confirms?|requests?|mentions?|asserts?|flags?|marks?|labels?|signals?|reports?|contacts?\\s+us\\s+to\\s+say)\\b`, 'i')) ||
    has(new RegExp(`\\bbased\\s+on\\s+(?:a|an|the)?\\s*\\b${trustSubjects}\\b[^.\\n]{0,80}\\b(message|request|statement|claim|word|note|email|slack|description|attestation|flag|mark)\\b`, 'i')) ||
    has(new RegExp(`\\bif\\s+a?\\s*\\b(\\w+\\s+){0,2}${trustSubjects}\\b[^.\\n]{0,80}\\bproceed`, 'i')) ||
    has(/\b(?:supplier|vendor|partner)\s+representative\s+contacts\s+us\s+to\s+say\b/i) ||
    has(/\b(?:supplier|vendor|partner)\s+(?:representative\s+)?contacts?\s+us\s+and\s+says?\b/i);
 
  const selfApproval =
    has(/(approve\s+(their|his|her)\s+own|approve\s+own\s+changes?|self.approval)/i) ||
    has(/\b(engineer|employee|user|requestor|requester)\s+(on\s+call\s+)?may\s+approve/i);
 
  const ruleBypass =
    has(/\b(no\s+other\s+approver|no\s+approver\s+available|no\s+second\s+approval|no\s+separate\s+(approval|change\s+window|review))\b/i) ||
    has(/\b(without|no)\s+(?:an?\s+)?(?:additional|extra|separate|independent|manual|second)\s+(?:approval|review|verification|change\s+window|sign.off|change\s+advisory\s+board)\b/i) ||
    has(/\bwithout\s+waiting\s+for\s+a\s+change\s+window\b/i);
 
  const hasAuthoritative =
    has(/(identity\s+provider|idp|ticketing\s+system|change\s+management|verified\s+(through|by|via)\s+(?:the\s+)?(?:hris|idp|portal)|customer\s+portal|out.of.band|verified\s+owner|hris)/i) ||
    has(/(verify\s+role|verify\s+identity|verified\s+consent|do\s+not\s+(rely|trust)\s+(on\s+)?(user|requester)\s+claims?)/i);
 
  const trustClaimSignal = trustOnClaimDirect || selfApproval || ruleBypass;
 
  // ============================================================
  // AGT-133
  // ============================================================
  if (trustClaimSignal && !hasAuthoritative) {
    const hasPrivilegedAction = has(/(impersonat\w*|reset.*(password|login|cred|token)|grant\w*\s+access|provision\s+access|update\w*\s+iam|terraform|deploy|create\w*\s+(user|api.key|service.account|service.token)|update\w*\s+auth.polic|delete\w*\s+resource|modify\w*\s+iam|detach\w*\s+iam|terminate\w*\s+instance|modify\w*\s+security\s+group|update\w*\s+permission)/i);
    add('AGT-133',
      /(?:if\s+(?:an?\s+)?\w[\w\s]*?\s+(?:says?|describes?|flags?|claims?|contacts\s+us)|no\s+second\s+approval|may\s+approve)/i,
      hasPrivilegedAction ? 'critical' : 'high'
    );
  }
 
  // ============================================================
  // AGT-098
  // ============================================================
  const dataCategories: Record<string, RegExp> = {
    health:       /(medical|health|wellness|diagnosis|treatment|patient|stress|leave\s+record|sentiment\s+score|performance\s+flag|pulse\s+survey|absence|feedback\s+score|manager\s+feedback)/i,
    financial:    /(billing|payment|invoice|revenue|arr|spend|charge|transaction|financial|tax\s+info|ach|bank|wire|claim\s+(?:amount|cost|decision|denial)|insurance|mortgage|preapproval|commission|cancellation|cost)/i,
    identity:     /(name|email|phone|contact|address|ssn|customer\s+id|user\s+id|company\s+name|primary\s+contact|account\s+name|buyer\s+profile|customer\s+(?:profile|name)|individual\s+profile|employee\s+id)/i,
    behavior:     /(usage|engagement|browsing|click|purchase\s+history|nps|churn|cancellation|interaction|behavioral|behaviour|listing\s+activity|browsing\s+behavior|usage\s+history|web\s+analytics|email\s+engagement|interest\s+categor|feature\s+usage|open\s+rate|purchase\s+event|churn\s+signal|feedback\s+form)/i,
    employment:   /(employee|payroll|salary|bonus|performance\s+review|termination|disciplinary|leave\s+record|department\s+head|manager\s+feedback|absence\s+record|team\s+report|hr)/i,
    auth:         /(token|cookie|session|credential|password|api.key|auth\s+claim|bearer|oauth)/i,
    realestate:   /(property\s+listing|buyer|mortgage|listing\s+activity|real\s+estate|property|listing|seller|broker)/i,
    demographics: /(demographic|age|gender|location\s+data|income|household|geographic\s+location)/i,
    support:      /(support\s+ticket|ticket\s+count|support\s+data|help\s+desk|incident\s+count)/i,
  };
  const presentCategories = Object.values(dataCategories).filter(r => has(r));
  const hasExternalRecipient = has(/(external|consultant|advisor|third.party|partner|sponsor|outside|customer\s+organization|ad\s+platform|crm\s+webhook|sftp\s+endpoint|claims\s+auditing|policyholder|senior\s+leadership|people\s+analytics|referring\s+physician|care\s+network)/i);
  const hasExportTool = has(/(export|send_email|send_csv|send_xlsx|send_to|push.*to|webhook|sftp|deliver_to|deliver\s+to|push_to|posted?\s+to|share\s+with)/i);
  if (presentCategories.length >= 3 && (hasExternalRecipient || hasExportTool) && !hasStrongPrivacyControls) {
    add('AGT-098', /(?:medical|health|salary|payroll|customer\s+name|primary\s+contact|engagement|purchase|browsing|mortgage|listing|billing|support\s+ticket|churn|usage|pulse\s+survey|absence)/i);
  }
 
  // ============================================================
  // AGT-126
  // ============================================================
  const noExpirationDirect =
    has(/\b(?:do\s+not|don.?t|never)\s+expire\b/i) ||
    has(/\b(?:do\s+not\s+have|don.?t\s+have)\s+automatic\s+expir/i) ||
    has(/\bremain\s+(?:in\s+effect\s+)?(?:valid|active|open|alive)?\s*(?:permanently|forever|indefinitely)\b/i) ||
    has(/\bremain\s+in\s+effect\s+permanently\b/i) ||
    has(/\bremain\s+valid\s+until\s+(?:explicitly|manually)\s+(?:revoked|removed|deactivated)\b/i) ||
    has(/\bremain\s+in\s+their\s+(?:modified|current|changed)\s+state\s+until\s+manually\b/i) ||
    has(/\b(?:stay|remain)\s+active\s+until\s+manually\s+(?:disabled|revoked|removed|reviewed)\b/i) ||
    has(/\b(?:retain|keep|maintain|hold)\b[^.\n]{0,40}(?:access|permission|credential|membership)[^.\n]{0,40}\b(?:until|unless)\s+(?:manually|explicitly)\s+(?:revoked|removed)/i) ||
    has(/\bno\s+(?:automatic|auto)\s+(?:expiration|expiry|revocation|ttl|timeout)\b/i) ||
    has(/\b(?:temporary|short.term|time.limited)\b[^.\n]{0,80}\b(?:stay|remain|persist|machine\s+identit|access)/i) ||
    has(/\b(?:api\s+keys?|tokens?|access|service\s+tokens?)\s+(?:do\s+not\s+(?:have\s+automatic\s+expiry|expire\s+automatically)|never\s+expire|do\s+not\s+expire)\b/i) ||
    has(/\bexpiration\s+is\s+optional\b/i) ||
    has(/\bno\s+second\s+approval\b/i) ||
    has(/\btemporary\s+machine\s+identit/i) ||
    has(/\b(?:deleted|modified|detached|terminated)\s+(?:\w+\s+)*\b(?:remain|stay|persist)\s+in\s+(?:effect|their)\s+(?:permanently|modified\s+state)\b/i);
  const bulkGrants =
    has(/\bbulk\s+(?:grant|provision|access)/i) ||
    has(/\bbulk\s+(?:resource\s+)?(?:deletion|provisioning|access)\s+(?:is\s+)?allowed\b/i);
  if (noExpirationDirect || bulkGrants) {
    add('AGT-126', /(?:permanently|do\s+not\s+expire|do\s+not\s+have\s+automatic\s+expiry|stay\s+active\s+until\s+manually|remain\s+in\s+their\s+modified\s+state|no\s+second\s+approval|bulk\s+(?:grant|deletion|provisioning))/i);
  }
 
  // ============================================================
  // AGT-124
  // ============================================================
  const iamWriteAction =
    has(/\b(?:update|modify|attach|change|create|provision|grant|assign|deploy|detach|terminate|revoke)\b[^.\n]{0,40}\b(?:iam|access\s+polic|auth\s+polic|service\s+account|role|terraform|infrastructure|permission\s+(?:boundar|polic)|api\s+key|gateway\s+config|rate\s+limit\s+chang|security\s+group|service\s+token|feature\s+access)\b/i) ||
    has(/\b(?:terraform_apply|update_iam|attach_policy|grant_role|create_service_account|update_iam_policies|update_iam_boundaries|update_auth_policies|deploy_gateway_config|create_api_key|detach_iam_role|modify_security_group|deploy_remediation_script|terminate_ec2_instance|update_permission_policy|grant_feature_access|create_service_token|revoke_feature_access)\b/i);
  const infraBypass =
    has(/(?:apply|deploy|update|change|modify|terminate|detach|grant)\b[^.\n]{0,80}(?:directly|immediately|without\s+(?:approval|review|change\s+window|waiting\s+for))/i) ||
    has(/\b(?:hotfix|urgent|emergency|active\s+incident|active\s+customer\s+integration|bypass\s+ci|skip\s+review)\b[^.\n]{0,80}\b(?:apply|deploy|grant|update|approve|allow|proceed)\b/i) ||
    has(/\bdo\s+not\s+require\s+(?:a\s+)?(?:separate\s+)?(?:change\s+window|change\s+advisory\s+board\s+review|cab\s+review)\b/i) ||
    has(/\bwithout\s+waiting\s+for\s+a\s+change\s+window\b/i);
  if (iamWriteAction && (infraBypass || trustClaimSignal || selfApproval || ruleBypass)) {
    add('AGT-124', /(?:update_iam|terraform|create_service_account|deploy_gateway|create_api_key|update_iam_boundaries|attach_policy|detach_iam_role|modify_security_group|update_permission_policy|terminate_ec2_instance|deploy_remediation_script)/i);
  }
 
  // ============================================================
  // AGT-131
  // ============================================================
  const numberWord = /(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty|fifty|hundred|\d+\s*hundred)/i;
  const smallCohort =
    new RegExp(`\\b(?:fewer|less|under|below)\\s+than\\s+${numberWord.source}\\b`, 'i').test(c) ||
    has(/\bsmall\s+(?:teams?|cohorts?|segments?|groups?|slices?|accounts?|sets?)\b/i) ||
    has(/\b(?:high.value|premium)\s+segments?\s+with\s+(?:under|fewer\s+than)/i);
  const individualInclusion =
    has(/\b(?:individual|specific|raw|direct|identifiable|example|per.user|user.level)\s+(?:\w+\s+)?(?:profiles?|accounts?|records?|users?|customers?|companies|usage\s+details?|data|scores?|examples?|details?|contact\s+records?|score\s+breakdowns?)/i) ||
    has(/\b(?:individual|example|specific)\s+\w+\s+(?:may\s+be\s+|are\s+)?(?:included|exposed|shown|exported|displayed|added)/i);
  const noCohortMin =
    has(/\bno\s+(?:minimum\s+)?(?:cohort|team\s+size|group\s+size|segment\s+size|threshold|cohort\s+size\s+floor|minimum\s+(?:team|group|cohort)\s+size)\s+(?:threshold\s+)?(?:is\s+)?(?:enforced|required|configured|defined|set|applied|is\s+applied)\b/i) ||
    has(/\bno\s+(?:cohort\s+size\s+floor|data\s+privacy\s+review|privacy\s+review)\s+is\s+(?:applied|required)\b/i);
  const identifiersInExport =
    has(/\b(?:name|email|phone|contact|company\s+name|primary\s+contact|customer\s+id|user\s+id|account\s+name|role\s+title|employee\s+id)\b/i) &&
    has(/\b(?:arr|revenue|spend|usage|churn|nps|complaint|cancellation|engagement|browsing|purchase|score|plan|sentiment|stress|performance|leave|wellness|behavioral|feedback|absence)\b/i);
  const reidWeakAnonymization =
    has(/\b(?:role\s+titles?|pseudonym|tokenized|employee\s+ids?).{0,80}(?:may\s+still\s+|still\s+|can\s+still\s+|can\s+often\s+be\s+).{0,40}(?:identif|matched\s+to)/i);
  if ((smallCohort || noCohortMin || reidWeakAnonymization) && (individualInclusion || identifiersInExport)) {
    add('AGT-131', /(?:fewer\s+than\s+\w+|small\s+(?:teams?|segments?|cohorts?)|under\s+\d+\s+members?|individual\s+(?:profiles?|usage|scores?|contact\s+records?|score\s+breakdowns?)|no\s+(?:minimum|privacy\s+review|cohort\s+size\s+floor))/i);
  }
 
  // ============================================================
  // AGT-134
  // ============================================================
  const workflowToolPresent = has(/\b(?:save_(?:\w+_)?template|run_(?:\w+_)?template|build_(?:\w+_)?template|create_(?:\w+_)?template|store_(?:\w+_)?template|save_workflow|create_(?:data_sharing_|workflow_)?pipeline|store_workflow|build_segment|build_audience)\b/i);
  const templateFromUser =
    has(/\b(?:user|requester|product\s+manager|engineer|partner\s+representative|agent|marketer|analyst|employee|account\s+manager)s?\s+(?:may\s+|can\s+|will\s+)?(?:define|create|build|compose|design|specify)\s+(?:custom\s+|reusable\s+|their\s+own\s+)?(?:report\s+|insight\s+|audience\s+|workflow\s+)?(?:template|workflow|pipeline|automation|integration|segment|audience)/i) ||
    has(/\buser.defined\s+(?:workflows?|pipelines?|automations?|templates?)/i) ||
    has(/\bcustom\s+(?:report\s+|insight\s+|workflow\s+)?(?:template|workflow|pipeline)/i) ||
    has(/\b(?:turn|convert)\s+(?:user\s+)?(?:requests?|input)\s+(?:into|to)\s+(?:reusable|saved)?\s*(?:template|workflow|pipeline|integration)/i);
  const autoRunFuture =
    has(/\b(?:template|workflow|pipeline|automation|segment)s?\s+(?:run|execute|trigger|activate|fire|are\s+(?:triggered|run|executed))\s+(?:automatically|on\s+(?:new|incoming|matching|similar|the\s+agreed)|when\s+(?:new|matching|similar))/i) ||
    has(/\b(?:saved\s+|stored\s+)?templates?\s+(?:can\s+|may\s+|will\s+)?(?:run|execute)\s+automatically\s+(?:when|on|each)/i) ||
    has(/\b(?:run|execute|trigger|triggered)\s+automatically\s+(?:on\s+|when\s+|whenever\s+)(?:new\s+data|the\s+agreed\s+schedule|matching|similar|new\s+billing|data\s+is\s+ingested)/i) ||
    has(/\bwhenever\s+new\s+data\s+is\s+ingested\b/i) ||
    has(/\beach\s+month\s+when\s+new\s+(?:billing|data)\s+(?:becomes\s+available|is\s+available)\b/i) ||
    has(/\b(?:saved|stored|persisted|reused)\s+(?:and\s+\w+\s+)?(?:automatically|when|on\s+(?:new|matching|similar))/i);
  const externalEndpointForTemplate =
    has(/\b(?:webhook|integration|callback|sftp|ad\s+platform\s+api|external\s+endpoint|crm\s+webhook|partner\s+sftp|client\s+portal|slack\s+webhook|dsp\s+api|demand.side\s+platform)\b/i) ||
    has(/\bdeliver_to_\w+(?:portal|endpoint|webhook|channel)\b/i) ||
    has(/\bpush_to_\w+(?:slack|webhook|endpoint|channel)\b/i);
  const noTemplateReview =
    has(/\bno\s+(?:template\s+|legal\s+|privacy\s+|security\s+)?review\s+(?:gate\s+)?(?:is\s+required|exists|is\s+applied)\b/i) ||
    has(/\bno\s+(?:legal\s+)?re.review\s+is\s+required\b/i) ||
    has(/\bdo\s+not\s+need\s+review\b/i);
  const wfScore =
    (workflowToolPresent ? 3 : 0) +
    (templateFromUser ? 3 : 0) +
    (autoRunFuture ? 3 : 0) +
    (externalEndpointForTemplate ? 2 : 0) +
    (noTemplateReview ? 2 : 0);
  if (wfScore >= 6) {
    add('AGT-134', /(?:saved?\s+(?:template|workflow|pipeline)|reusable|user.defined|run\s+automatically|triggered\s+automatically|whenever\s+new\s+data|each\s+month\s+when)/i,
      wfScore >= 10 ? 'critical' : 'high');
  }
 
  // ============================================================
  // AGT-123
  // ============================================================
  const webhookExfil =
    has(/\b(?:webhook|integration|callback|endpoint|sftp|api)\s+(?:url|endpoint|destination|address)?s?\s+(?:are\s+|is\s+|may\s+be\s+|can\s+be\s+)?(?:specified|provided|defined|configured|given|set)\s+(?:by|in)\s+(?:the\s+)?(?:user|requester|engineer|marketer|product\s+manager|agent|partner|account\s+manager|campaign\s+manager)\b/i) ||
    has(/\b(?:specified|configured|provided)\s+by\s+the\s+(?:agent|engineer|marketer|product\s+manager|requester|user|partner|account\s+manager|campaign\s+manager)\s+(?:creating\s+the\s+template|at\s+runtime|in\s+the\s+template|during\s+template\s+setup)\b/i) ||
    has(/\bpushed\s+to\s+(?:crm\s+)?webhook\s+urls?\s+specified\b/i) ||
    has(/\b(?:partner\s+)?sftp\s+endpoints?\s+specified\b/i) ||
    has(/\bdemand.side\s+platform\s+apis?\s+(?:as\s+)?configured\s+by\s+the\s+(?:campaign\s+manager|marketer|user)\b/i) ||
    has(/\bexported?\s+directly\s+to\s+(?:demand.side\s+platform|dsp|ad\s+platform|advertising\s+platform)\s+apis?\s+(?:as\s+)?configured\b/i) ||
    has(/\b(?:advertising|ad)\s+platform\s+apis?\s+configured\s+by\s+the\s+(?:campaign\s+manager|marketer|user)\b/i) ||
    has(/\bclient\s+portal\s+endpoints?\s+configured\s+by\s+the\s+(?:account\s+manager|user|requester)\b/i) ||
    has(/\bdelivered?\s+to\s+client\s+portal\s+endpoints?\s+configured\b/i) ||
    has(/\bslack\s+webhook\s+urls?\s+that\s+each\s+(?:product\s+manager|user|pm|manager)\s+configures?\b/i) ||
    has(/\b(?:results?|outputs?|reports?)\s+(?:are\s+)?pushed\s+to\s+(?:slack\s+)?webhook\s+urls?\s+(?:that|which|configured|specified)/i) ||
    has(/\b(?:portal|slack|dsp|crm|ad\s+platform)\s+(?:endpoint|url|webhook|api)s?\s+(?:are\s+|that\s+(?:each\s+)?)?\b(?:user|manager|pm|account\s+manager|product\s+manager|campaign\s+manager)\s+(?:configures?|sets?|specifies?|provides?)\b/i);
  if (webhookExfil) {
    add('AGT-123', /(?:webhook|endpoint|sftp|dsp|ad\s+platform|client\s+portal|slack\s+webhook).{0,60}(?:configured|specified|provided)/i);
  }
 
  // ============================================================
  // AGT-099
  // ============================================================
  const schedulingTool = has(/\b(?:schedule_(?:\w+_)?(?:task|report|delivery|export)|recurring|weekly\s+report|daily\s+report|monthly\s+report|automated\s+report|scheduled\s+(?:tasks?|reports?))\b/i);
  const schedulingMutability =
    has(/\b(?:delivery|destination|recipient|address|webhook|folder|endpoint|template|fields?)\s+(?:may\s+be\s+|can\s+be\s+|are\s+)?(?:edited|changed|updated|modified)\s+(?:later|after|by\s+anyone|mid.agreement)\b/i) ||
    has(/\b(?:template|schedule|recurring\s+(?:task|report))\s+(?:may\s+|can\s+)?be\s+updated\s+(?:if|when|once)\b/i) ||
    has(/\b(?:if|when)\s+a?\s*(?:partner|user|requester|engineer)\s+(?:requests|asks\s+for)\s+(?:additional\s+)?(?:fields?|recipients?|destinations?)\b/i);
  const schedRevalidation =
    has(/\bdoes\s+not\s+revalidat/i) ||
    has(/\bdo\s+not\s+re.validate/i) ||
    has(/\bno\s+(?:legal\s+)?re.review\s+is\s+required\s+for\s+field\s+additions\b/i);
  const schedInheritsPerms =
    has(/\b(?:scheduled\s+tasks?|recurring\s+(?:reports?|tasks?))\s+(?:inherit|reuse|carries|retains?)\s+(?:the\s+)?(?:original|requester|initial|user)\b/i) ||
    has(/\b(?:reuse|inherit)\s+(?:the\s+)?(?:original|requester'?s?|initial)\s+(?:permission|approval|access|authorization)\b/i);
  if (schedulingTool && (schedulingMutability || schedRevalidation || schedInheritsPerms)) {
    add('AGT-099', /(?:schedule|recurring|mutable|revalidat|inherit.*permission|do\s+not\s+re.validate)/i);
  }
 
  // ============================================================
  // AGT-104
  // ============================================================
  const ingestionAction =
    has(/\b(?:ingest|index|add\s+to\s+(?:the\s+)?(?:index|knowledge\s+base|kb|corpus|search|research\s+index|legal\s+index))\b/i) ||
    has(/\bingest_\w+\b/i) ||
    has(/\bupdate_(?:search_index|research_index|legal_index|kb|index)\b/i);
  const untrustedSource =
    has(/\b(?:forum\s+discussion|blog\s+post|community\s+contributor|external\s+(?:researcher|article|guide|paper|parties?|counsel)|user.submitted|customer.submitted|client.submitted|appeal|ticket\s+comment|uploaded\s+(?:document|note|file)|opposing\s+counsel|third.party\s+(?:legal\s+)?analysis)\b/i);
  const futureUseTrusted =
    has(/\b(?:treated\s+as\s+(?:peer.reviewed|equivalent|equally\s+reliable|reliable|trusted|authoritative)|equivalent\s+to\s+peer.reviewed|considered\s+reliable|equally\s+reliable\s+for\s+generating)\b/i) ||
    has(/\b(?:available\s+for\s+queries|used\s+as\s+(?:reliable\s+)?background|future\s+(?:queries|users|answers))\b/i) ||
    has(/\bimmediately\s+available\s+for\s+queries\b/i);
  const noModeration =
    has(/\b(?:added\s+directly\s+without\s+(?:moderation|independent\s+verification)|without\s+(?:moderation|review|source\s+(?:verification|review|validation)|independent\s+verification)|no\s+source\s+(?:verification|review|validation)|routine\s+ingestion\s+(?:proceeds?\s+)?(?:without|does\s+not\s+require))\b/i);
  const kbScore =
    (ingestionAction ? 3 : 0) +
    (untrustedSource ? 3 : 0) +
    (futureUseTrusted ? 3 : 0) +
    (noModeration ? 2 : 0);
  if (kbScore >= 6) {
    add('AGT-104', /(?:ingest|index|forum\s+discussion|blog\s+post|community\s+contributor|client.submitted|opposing\s+counsel|available\s+for\s+queries|without\s+(?:moderation|independent\s+verification))/i);
  }
 
  // ============================================================
  // AGT-097
  // ============================================================
  const docFromExternal = has(/\b(?:attachment|document|pdf|invoice|email|contract|redline|counterparty(?:\s+attachment|\s+document)?)\b/i);
  const followsDocContent =
    has(/\b(?:if|when)\s+(?:an?|the)\s+(?:attachment|document|counterparty(?:\s+attachment)?|email|invoice|pdf)\s+(?:contains?|includes?|specifies?|provides?|says?|indicates?|instructs?)\b/i) ||
    has(/\b(?:follow|act\s+on|honor|apply|incorporate|use|adopt|implement)\s+(?:the\s+)?(?:instructions?|directives?|content|preferred\s+language|terms?|changes?|positions?|proposals?)\s+(?:from|in|within|inside|contained\s+in)\s+(?:attachments?|documents?|counterparty|emails?)\b/i) ||
    has(/\b(?:proposed\s+changes?|preferred\s+language)\s+from\s+counterparties?\s+(?:are\s+treated\s+as|may\s+be\s+(?:incorporated|applied|adopted))\b/i) ||
    has(/\bmay\s+be\s+incorporated\s+into\s+(?:the\s+)?(?:working\s+)?draft\b/i) ||
    has(/\burls?\s+embedded\s+in\s+(?:counterparty\s+)?documents?\s+may\s+be\s+fetched\b/i) ||
    has(/\b(?:treated\s+as\s+)?good.faith\s+starting\s+points?\s+(?:and\s+)?applied\b/i);
  if (docFromExternal && followsDocContent) {
    add('AGT-097', /(?:if\s+(?:an?\s+)?(?:attachment|document|counterparty)|preferred\s+language|incorporated\s+into|good.faith\s+starting)/i);
  }
 
  // ============================================================
  // AGT-101
  // ============================================================
  const bankingContext = has(/\b(?:banking|payment|wire|ach|routing|tax\s+(?:info|information)|account\s+(?:number|info)|invoice|vendor\s+(?:account|record|profile)|bank\s+account\s+details?|payment\s+(?:record|update|detail))\b/i);
  const vendorAttests =
    has(/\bif\s+(?:a\s+|the\s+)?(?:vendor|partner|supplier|contractor|counterparty|contact)\s+(?:representative\s+)?(?:says?|confirms?|indicates?|states?|requests?|attests?|tells?)\b/i) ||
    has(/\bif\s+(?:a\s+|the\s+)?(?:vendor|partner|supplier|contractor|counterparty|contact|customer)\s+(?:email|message|note|representative|contact)\s+(?:says?|confirms?|indicates?|states?|requests?)\b/i) ||
    has(/\b(?:supplier|vendor|partner)\s+representative\s+contacts\s+us\s+to\s+say\b/i) ||
    has(/\b(?:supplier|vendor|partner)\s+(?:representative\s+)?contacts?\s+us\s+and\s+says?\b/i) ||
    has(/\bonce\s+the\s+(?:supplier|vendor|partner)\s+confirms?\b/i);
  const updateBasedOnVendorClaim = has(/\b(?:update|set|record|change|modify)[^.\n]{0,60}\b(?:vendor\s+record|banking|payment|ach|account\s+(?:detail|info)|packet|payment\s+record)\b/i);
  if ((bankingContext && vendorAttests) || (updateBasedOnVendorClaim && vendorAttests)) {
    add('AGT-101', /(?:bank\s+account\s+details?|payment\s+record|banking|ach|vendor\s+record|packet).{0,80}(?:says?|confirms?|contacts\s+us|changed|update)/i);
  }
 
  // ============================================================
  // AGT-130
  // ============================================================
  const impersonationTool = has(/\b(?:view_as|act_as|impersonat\w*|session.replay|replay_user_session|reconstruct_user_actions|customer.equivalent|browse_as|open_as_user|reproduce.as|capture_(?:dom_snapshot|screen_state)|fetch_user_session|view\s+as\s+\w+|switch\s+(?:to\s+)?(?:user|account))\b/i);
  const credentialReset = has(/\b(?:reset_(?:account_)?credentials?|reset_password|reset_login|reset_customer_login|reset_user_token|password\s+reset|change\s+credentials?|reset\s+(?:customer\s+)?(?:login|password|credentials?|token))\b/i);
  const supportConsentClaim =
    has(/\b(?:support\s+(?:rep|engineer|agent|employee|may)?|engineer|team\s+lead)\s+(?:says?|may)\s+(?:the\s+)?(?:customer|user|consented|impersonate)\b/i) ||
    has(/\b(?:team\s+lead|support)\s+says\s+(?:the\s+)?(?:customer|user)\s+(?:agreed|consented|approved|gave\s+(?:verbal\s+)?consent|gave\s+permission)\b/i) ||
    has(/\bverbal\s+consent\b/i);
  const sessionDataExternal = has(/\b(?:session\s+(?:replay|recording|state|bundles?)|screen\s+capture|account\s+(?:state\s+)?details?|token\s+snapshots?)\s+(?:may\s+be\s+|can\s+be\s+|are\s+)?(?:posted|shared|sent|emailed)\b/i);
  const auditWeak =
    has(/\b(?:abbreviated|shortened|summarized|truncated|minimal|brief|reduced)\s+(?:session\s+)?(?:summaries|logs|audit\s+entries|audit\s+trail)\s+(?:are\s+)?(?:preferred|required|used)\s+(?:over|instead\s+of)\s+(?:full\s+)?(?:audit\s+logs?|logs)\b/i) ||
    has(/\baudit\s+logs?\s+(?:may\s+be\s+|are\s+|can\s+be\s+)?(?:shortened|truncated|deleted|removed|cleared|pruned|summarized|abbreviated|reduced)\b/i) ||
    has(/\b(?:audit|log)\s+(?:trail|entries|records?)\s+(?:may\s+be\s+|are\s+|can\s+be\s+)?(?:shortened|truncated|summarized|abbreviated|reduced|concise)\b/i) ||
    has(/\b(?:logs?|audit)\s+(?:may\s+be\s+|are\s+|can\s+be\s+)?(?:deleted|removed|cleared)\b/i);
  if (impersonationTool && (credentialReset || supportConsentClaim || sessionDataExternal || auditWeak)) {
    const score =
      (impersonationTool ? 3 : 0) + (credentialReset ? 3 : 0) +
      (supportConsentClaim ? 2 : 0) + (sessionDataExternal ? 2 : 0) + (auditWeak ? 2 : 0);
    add('AGT-130',
      /(?:impersonat\w*|replay_user_session|reconstruct_user_actions|customer.equivalent|reset_(?:password|login|credentials?|user_token)|verbal\s+consent)/i,
      score >= 8 ? 'critical' : 'high'
    );
  }
 
  // ============================================================
  // AGT-113
  // ============================================================
  if (auditWeak) {
    add('AGT-113', /(?:audit\s+logs?\s+(?:may\s+be\s+)?(?:shortened|truncated|deleted|summarized)|abbreviated\s+(?:session\s+)?summaries)/i);
  }
 
  // ============================================================
  // AGT-132
  // ============================================================
  const logsContainSensitive =
    has(/\b(?:log|bundle|debug|diagnostic|trace|payload|session\s+bundle)s?\s+(?:and\s+token\s+snapshots?\s+)?(?:may\s+(?:include|contain)|include|contain|capture)\s+(?:[\w\s,]*?)(?:authentication\s+(?:tokens?|events?)|session\s+tokens?|environment\s+variable|cookies?|auth\s+claims?|customer\s+records?|request\s+headers?|raw\s+request\s+payloads?|database\s+rows?|credentials?|secrets?|tokens?|active\s+authentication)\b/i) ||
    has(/\b(?:full|complete|raw|all|entire)\s+(?:user\s+)?session\s+(?:including|with)\s+.{0,60}(?:authentication\s+tokens?|active\s+(?:auth|token)|dom\s+state|network\s+calls?)\b/i) ||
    has(/\b(?:full|complete|raw|all|entire)\s+(?:request\s+)?context\s+(?:into|in)\s+(?:debug\s+)?(?:bundles?|logs?)\b/i) ||
    has(/\bsession\s+bundles?\s+and\s+token\s+snapshots?\b/i) ||
    has(/\btoken\s+snapshots?\s+(?:may\s+be\s+|are\s+|can\s+be\s+)?(?:posted|shared|sent)\b/i);
  const logsExternalSink =
    has(/\b(?:upload|send|forward|export|deliver|push)\s+(?:logs?|bundles?|debug)\b/i) ||
    has(/\b(?:s3|bucket|external\s+(?:monitoring|endpoint|observability))\s+(?:paths?|endpoints?)?\s+(?:specified|provided|configured)\s+by\s+(?:the\s+)?(?:engineer|user|requester|developer|incident)\b/i) ||
    has(/\b(?:bundles?|logs?|snapshots?)\s+(?:are\s+|may\s+be\s+|can\s+be\s+)?(?:uploaded|sent|exported|posted)\s+to\b/i) ||
    has(/\bposted\s+to\s+(?:the\s+)?(?:engineering\s+)?(?:slack|teams?|chat|channel|workspace)\b/i) ||
    has(/\b(?:session\s+bundles?|token\s+snapshots?)\s+(?:may\s+be\s+|are\s+)?(?:posted|shared|sent)\s+to\b/i);
  const noLogRedaction =
    has(/\bno\s+(?:separate\s+)?redaction\s+(?:is\s+)?(?:applied|required|configured)\b/i) ||
    has(/\b(?:full\s+context|raw\s+context|complete\s+context)\s+is\s+needed\b/i) ||
    has(/\bdetailed\s+session\s+logs?\s+are\s+preferred\b/i);
  if (logsContainSensitive && (logsExternalSink || noLogRedaction)) {
    add('AGT-132',
      /(?:debug\s+bundles?|session\s+bundles?|token\s+snapshots?|external\s+(?:monitoring|observability)|no\s+redaction|auth\s+claims?|session\s+tokens?|posted\s+to\s+(?:engineering\s+)?slack)/i,
      logsContainSensitive && logsExternalSink ? 'critical' : 'high'
    );
  }
 
  // ============================================================
  // AGT-118
  // ============================================================
  const readsAuth = has(/\b(?:read\w*_(?:token|oauth|secret|credential|api.key|auth)|session\s+tokens?|auth\s+claims?|read_auth_logs?|read_env|environment\s+variable\s+snapshots?|authentication\s+(?:events?|tokens?))\b/i);
  const sendsExternal = has(/\b(?:send\w*_(?:email|webhook|http|slack|sms|sftp)|export\w*_(?:csv|xlsx|pdf)|upload_to|post_to|post_to_engineering_slack|external\s+(?:monitoring|endpoint|recipients?|destinations?))\b/i);
  if (readsAuth && sendsExternal) {
    add('AGT-118', /(?:token|credential|auth\s+claim|session\s+token|environment\s+variable|authentication\s+token)/i, 'critical');
  }
 
  // ============================================================
  // AGT-040
  // ============================================================
  const sendsPII = has(/\b(?:send_email|export|emailed|export_csv|export_xlsx|send_to|forward|deliver)\b/i);
  const personalData = has(/\b(?:name|email|phone|ssn|medical|patient|diagnosis|treatment|salary|payroll|customer\s+name|primary\s+contact|address)\b/i);
  const noRedaction = !has(/\b(?:redact|anonymiz|pseudonymi|mask\s+(?:pii|name|email)|no\s+pii|pii\s+(?:redact|removal)|pii_redaction\s*:\s*true)\b/i);
  if (sendsPII && personalData && noRedaction && !hasStrongPrivacyControls) {
    add('AGT-040', /(?:name|email|phone|ssn|medical|patient|salary|payroll|customer\s+name|primary\s+contact)/i);
  }
 
  return Array.from(found.values());
};