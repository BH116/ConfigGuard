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

  return findings;
};
