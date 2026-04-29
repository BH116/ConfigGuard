import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

type ComboRule = {
  id: string;
  severity: 'critical' | 'high';
  message: string;
  required: RegExp[];
  forbidden?: RegExp;
};

const comboRules: ComboRule[] = [
  {
    id: 'AGT-117',
    severity: 'critical',
    message:
      'Account takeover combo: impersonation + credential reset tools present without dual-approval gate. An attacker with any foothold can impersonate any user then lock them out.',
    required: [
      /(impersonat|user.*session|login.*as|act.*as.*user|assume.*identity|switch.*user|access.*as.*customer)/i,
      /(reset.*password|password.*reset|change.*credentials?|update.*auth|revoke.*session|issue.*new.*token|create.*user.*token)/i
    ],
    forbidden: /(requires_approval|human_approval|dual_approval|out.of.band|supervisor|manager\s+must)/i
  },
  {
    id: 'AGT-130',
    severity: 'high',
    message:
      'Impersonation/account-takeover workflow: user/session impersonation is paired with weak controls (claim-based consent, credential reset, broad sharing, or weakened audit).',
    required: [
      /(\bview_as\b|\bact_as\b|impersonat|session[\s._]replay|\bbrowse_as\b|\bopen_as_user\b|\blogin_as\b|\bswitch_account\b|view_as_customer|customer-equivalent\s+session|record_browser_session|reconstruct_user_actions|fetch_user_session|capture_(?:dom_snapshot|screen_state))/i
    ],
    forbidden: /(cannot\s+open\s+customer-equivalent\s+sessions?|cannot\s+open\s+customer-equivalent\s+sessions?[^.\n]{0,120}impersonate\s+users?|cannot\s+open\s+customer-equivalent\s+sessions?[^.\n]{0,160}reset\s+credentials?|cannot\s+impersonate\s+users?|cannot\s+reset\s+credentials?|support\s+access\s+is\s+read-only|consent\s+must\s+be\s+verified\s+through\s+the\s+ticketing\s+system|audit\s+logs?\s+are\s+immutable|(?:full\s+)?session\s+data\s+cannot\s+be\s+posted\s+to\s+chat)/i
  },
  {
    id: 'AGT-118',
    severity: 'critical',
    message:
      'Token exfiltration combo: agent can read credentials/tokens AND send data externally with no redaction requirement. This is a direct credential theft pipeline.',
    required: [
      /(read.*token|read.*oauth|read.*refresh|read.*secret|read.*credential|read.*api.key|export.*token|read.*auth)/i,
      /(send.*email|send.*webhook|export.*csv|upload.*external|post.*to|send.*slack|send.*http)/i
    ],
    forbidden: /(redact.*token|mask.*token|token.*redaction|no.*token.*in.*export|strip.*secret)/i
  },
  {
    id: 'AGT-119',
    severity: 'critical',
    message:
      'Remote code execution combo: agent can fetch arbitrary URLs AND execute code with no sandbox. A single malicious URL triggers unrestricted code execution.',
    required: [
      /(run.*shell|exec.*shell|shell.*command|bash|run.*python|execute.*code|subprocess|run.*script)/i,
      /(fetch.*url|retrieve.*url|download|browser.*open|curl|wget|http.*request)/i
    ],
    forbidden: /(sandbox|gvisor|kata|firecracker|microvm|isolation|container.*restrict)/i
  },
  {
    id: 'AGT-120',
    severity: 'high',
    message:
      'Mass data exfiltration combo: agent can query production databases AND bulk export results without approval. This is a complete data breach pipeline.',
    required: [
      /(query.*database|read.*database|database.*access|prod.*database|production.*db|sql|read.*records|read.*table)/i,
      /(export.*csv|bulk.*export|export.*xlsx|export.*all|download.*records|full.*export|batch.*export)/i
    ],
    forbidden: /(approval.*required.*export|human.*approval.*export|confirm.*before.*export|review.*export)/i
  },
  {
    id: 'AGT-121',
    severity: 'critical',
    message:
      "Unauthorized production deployment combo: agent can deploy to production and bypass CI/review when told it is 'urgent'. Social engineering enables production compromise.",
    required: [
      /(deploy.*production|deploy.*prod|push.*production|release.*prod|merge.*main|create.*pull.*request.*deploy)/i,
      /(if.*urgent.*deploy|emergency.*fix.*deploy|hotfix.*immediately|bypass.*ci|skip.*review.*urgent|no.*review.*required.*urgent)/i
    ],
    forbidden: /(code.*review.*required|ci.*must.*pass|approval.*before.*deploy|change.*window)/i
  }
];

export const runComboRules = (parsed: ParsedConfig): Finding[] => {
  const findings: Finding[] = [];

  for (const rule of comboRules) {
    const hasRequired = rule.required.every((pattern) => pattern.test(parsed.content));
    const hasForbidden = rule.forbidden ? rule.forbidden.test(parsed.content) : false;

    if (hasRequired && !hasForbidden) {
      findings.push(finding(rule.id, undefined, rule.message));
    }
  }


  const safeSupportControls = [
    /cannot\s+open\s+customer-equivalent\s+sessions?/i,
    /cannot\s+open\s+customer-equivalent\s+sessions?[^\n.]{0,120}impersonate\s+users?/i,
    /cannot\s+open\s+customer-equivalent\s+sessions?[^\n.]{0,160}reset\s+credentials?/i,
    /cannot\s+impersonate\s+users?/i,
    /cannot\s+reset\s+credentials?/i,
    /support\s+access\s+is\s+read-only/i,
    /consent\s+must\s+be\s+verified\s+through\s+the\s+ticketing\s+system/i,
    /audit\s+logs?\s+are\s+immutable/i,
    /(?:full\s+)?session\s+data\s+cannot\s+be\s+posted\s+to\s+chat/i
  ];
  const safeSupportControlCount = safeSupportControls.filter((pattern) => pattern.test(parsed.content)).length;

  const hasImpersonation = /(\bview_as\b|\bact_as\b|impersonat|session[\s._]replay|\bbrowse_as\b|\bopen_as_user\b|\blogin_as\b|\bswitch_account\b|\bcustomer[\s._]view\b|\buser[\s._]session\b|\bredroduce[\s._]as\b|\bsee_as\b|\benter_as\b|\baccess_as\b|view_as_customer|customer-equivalent\s+session|record_browser_session|reconstruct_user_actions|fetch_user_session|capture_(?:dom_snapshot|screen_state))/i.test(parsed.content);
  const hasCredReset = /(reset.pass|reset.cred|reset.login|change.pass|new.token|reissue.cred|rotate.cred|update.credentials|unlock.account|reset_customer_login|reset.*(password|login|credential))/i.test(parsed.content);
  const hasTrustClaim = /(support rep|support agent|engineer|employee).{0,40}(says|states|claims).{0,50}(approved|consented|authorized|permission)|verbal.{0,20}(consent|approval)/i.test(parsed.content);
  const hasAuditWeakening = /(audit|log).{0,30}(trail|entries|records?).{0,30}(summarized|shortened|truncated|concise|reduced)/i.test(parsed.content);
  const hasSessionExternalShare = /(session|account|reproduction).{0,30}(screenshot|detail|note|data|information).{0,30}(posted|shared|sent|emailed).{0,30}(slack|email|channel|engineering|external)/i.test(parsed.content);
  const hasNoApproval = /no.{0,30}(separate|additional|independent|extra|explicit).{0,30}(approval|verification|consent|confirmation)/i.test(parsed.content);
  const score = (hasImpersonation ? 3 : 0)
    + (hasCredReset ? 3 : 0)
    + (hasTrustClaim ? 2 : 0)
    + (hasSessionExternalShare ? 2 : 0)
    + (hasAuditWeakening ? 2 : 0)
    + (hasNoApproval ? 2 : 0);
  if (score >= 5 && safeSupportControlCount < 5 && !findings.some((f) => f.ruleId === 'AGT-130')) {
    const f = finding('AGT-130', parsed.content.match(/(customer-equivalent session|view_as_customer|reset_customer_login|support rep says|audit trail entries may be summarized)/i)?.[0]);
    f.severity = score >= 8 ? 'critical' : 'high';
    findings.push(f);
  }

  return findings;
};
