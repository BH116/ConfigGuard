import { Finding, ParsedConfig } from './types';
import { finding } from './helpers';

type PatternRule = {
  id: string;
  patterns: RegExp[];
};

const naturalLanguageRules: PatternRule[] = [
  {
    id: 'AGT-085',
    patterns: [
      /(actions?|operations?|requests?|tool calls?|decisions?)\s+(are\s+)?(not\s+(logged|recorded|audited|tracked))/i,
      /no\s+(audit|logging|log\s+trail|record\s+keeping)/i,
      /logging\s+(is\s+)?(disabled|off|not\s+required|skipped)/i,
      /skip\s+(audit|logging)/i,
      /don'?t\s+(log|audit|record|track)/i
    ]
  },
  {
    id: 'AGT-086',
    patterns: [
      /(may|can|allowed to|permitted to)\s+(send|make)\s+(http|https|web|network)\s+requests?\s+to\s+any/i,
      /(any|all|unrestricted)\s+(domains?|urls?|endpoints?|hosts?)/i,
      /no\s+(domain\s+)?(allowlist|allow\s+list|whitelist)/i,
      /network\s+access\s+is\s+(open|unrestricted|unlimited)/i,
      /fetch\s+(any|all)\s+urls?/i
    ]
  },
  {
    id: 'AGT-087',
    patterns: [
      /no\s+(authentication|auth|identity\s+verification|user\s+verification)/i,
      /(authentication|auth)\s+(is\s+)?(not\s+required|disabled|off|skipped)/i,
      /(anonymous|unauthenticated)\s+(access|users?|requests?)\s+(allowed|permitted|enabled)/i,
      /skip\s+(authentication|auth|identity\s+check)/i,
      /without\s+(authentication|auth|verifying\s+identity)/i
    ]
  },
  {
    id: 'AGT-088',
    patterns: [
      /all\s+(users?|callers?|requesters?)\s+(have|get|receive)\s+(equal|the\s+same|full|admin)\s+(access|permissions?|capabilities|privileges)/i,
      /no\s+(rbac|role[-\s]based\s+access|access\s+control|permission\s+(check|levels?|tiers?))/i,
      /(users?|callers?)\s+(can|may)\s+(do\s+)?(anything|everything)/i,
      /permission\s+(checks?|levels?)\s+(are\s+)?(disabled|skipped|not\s+enforced|off)/i,
      /(everyone|all users?)\s+is\s+(an\s+)?admin/i
    ]
  },
  {
    id: 'AGT-089',
    patterns: [
      /no\s+(rate\s+limits?|throttling|quotas?|usage\s+caps?)/i,
      /(rate\s+limits?|throttling|quotas?)\s+(are\s+)?(disabled|off|not\s+enforced|removed)/i,
      /unlimited\s+(requests?|calls?|invocations?|usage)/i,
      /no\s+limit\s+on\s+(requests?|tool\s+calls?|api\s+calls?)/i,
      /without\s+(rate\s+limits?|throttling|quotas?)/i
    ]
  },
  {
    id: 'AGT-090',
    patterns: [
      /(follow|obey|honor|respect)\s+(the\s+)?(most\s+recent|latest|newest|last)\s+(instruction|command|directive|rule)/i,
      /(override|supersede|replace|ignore)\s+(previous|prior|earlier|original)\s+(rules?|instructions?|commands?|directives?)/i,
      /(later|new)\s+instructions?\s+(take\s+priority|override|supersede)/i,
      /treat\s+.{0,30}\s+as\s+(authoritative|final|highest\s+priority)/i,
      /defer\s+to\s+(any|the)\s+(user|incoming|new)\s+(message|instruction)/i
    ]
  },
  {
    id: 'AGT-091',
    patterns: [
      /(return|provide|share|expose|include)\s+(the\s+)?(full|all|complete|entire)\s+(user\s+)?(record|profile|data|information|details|history)/i,
      /(no|without)\s+(redaction|filtering|sanitization|masking|pii\s+(removal|filtering))/i,
      /include\s+(all|every|raw)\s+(fields?|columns?|attributes?|data)/i,
      /full\s+(billing|medical|financial|account|credit\s+card)\s+(history|details|information|records?)/i,
      /return\s+everything/i
    ]
  },
  {
    id: 'AGT-092',
    patterns: [
      /(no|without)\s+(human\s+)?(approval|confirmation|review|oversight)\s+(required|needed)/i,
      /approval\s+(is\s+)?(not\s+required|skipped|optional|disabled)/i,
      /auto[-\s]?approve\s+(all|everything|every|any)/i,
      /(execute|perform|run|do)\s+(actions?|tools?|operations?)\s+(automatically|without\s+(asking|confirming))/i,
      /never\s+(ask|prompt|confirm)\s+(for\s+)?(approval|confirmation|permission)/i
    ]
  },
  {
    id: 'AGT-093',
    patterns: [
      /(modify|update|edit|change|rewrite)\s+(your\s+)?(own\s+)?(rules?|instructions?|configuration|settings|prompt|guidelines?)/i,
      /update\s+(this\s+|the\s+)?(file|config|settings|rules?\s+file)(\s+if\s+(you|needed))?/i,
      /persist\s+(across|between)\s+(sessions?|runs?|conversations?)/i,
      /(write|save|store)\s+(to|in)\s+(\.bashrc|\.zshrc|\.profile|registry|crontab|systemd)/i,
      /remember\s+this\s+(forever|permanently|across\s+sessions)/i
    ]
  },
  {
    id: 'AGT-094',
    patterns: [
      /(has|have|with)\s+(access\s+to|permission\s+to|the\s+ability\s+to)\s+(execute|run)\s+(shell|arbitrary|any)\s+(commands?|code)/i,
      /full\s+(filesystem|file\s+system|disk|database)\s+access/i,
      /(unrestricted|unlimited)\s+(tool|capability|permission)\s+access/i,
      /can\s+(do|perform|execute)\s+anything/i,
      /access\s+to\s+(everything|all\s+tools|every\s+capability)/i
    ]
  },
  {
    id: 'AGT-095',
    patterns: [
      /(skip|bypass|disable|turn\s+off)\s+(safety|security)\s+(checks?|filters?|guardrails?)/i,
      /(safety|security)\s+(checks?|filters?|guardrails?)\s+(are\s+)?(disabled|off|skipped)/i,
      /no\s+(safety|content)\s+(filtering|moderation)/i,
      /(developer|debug|admin|maintenance)\s+mode\s+(is\s+)?(enabled|on|active)/i
    ]
  },
  {
    id: 'AGT-096',
    patterns: [
      /if\s+(a\s+|the\s+)?(user|requester|caller)\s+(says?|claims?|states?|tells?\s+you|mentions?)\s+(they\s+(are|have)|.{0,30}(admin|leadership|owner|manager|approval|authority|approved))/i,
      /treat\s+(them|the\s+user)\s+as\s+(an?\s+)?(admin|administrator|owner|leader|elevated|privileged)/i,
      /if\s+(a\s+|the\s+)?(user|document|email|message)\s+says?\s+(it\s+is\s+|they\s+are\s+)?(approved|authorized|urgent|important)/i,
      /acting\s+on\s+behalf\s+of\s+(leadership|finance|legal|management|admin)/i,
      /(assume|presume)\s+(normal|standard|trusted|elevated)\s+(internal\s+)?access/i,
      /no\s+(identity|user)\s+verification\s+(required|needed)/i,
      /trust\s+(authenticated|the)\s+users?\s+(to|as)\s+(be\s+)?(admin|leadership|trusted)/i
    ]
  },
  {
    id: 'AGT-097',
    patterns: [
      /(instructions?|directives?|commands?)\s+(inside|within|in)\s+(documents?|attachments?|pdfs?|invoices?|tickets?|emails?)\s+(may\s+be\s+|should\s+be\s+|can\s+be\s+)?(followed|trusted|treated)/i,
      /(attachment|document|pdf|invoice|email)\s+text\s+(may\s+be\s+|can\s+be\s+)?used\s+as\s+instructions/i,
      /(trust|treat\s+as\s+authoritative)\s+(invoice|vendor|attachment|document|pdf|email)\s+(content|instructions?|details|data)/i,
      /if\s+(a\s+|the\s+)?(document|invoice|email|attachment|pdf|ticket)\s+says?/i,
      /follow\s+(embedded|attached|document)\s+(links?|instructions?|directives?)/i,
      /vendor[-\s]provided\s+(documents?|instructions?|details)\s+(may\s+update|are\s+trusted|may\s+modify)/i
    ]
  },
  {
    id: 'AGT-098',
    patterns: [
      /(combin\w+|aggregat\w+|merg\w+|join\w+|consolidat\w+)\s+.{0,40}(customer|vendor|employee|patient|billing|financial|medical|hr)\s+.{0,40}(data|records|information)/i,
      /(customer|user|client)\s+.{0,30}(billing|payment|financial|invoice).{0,50}(employee|vendor|hr|internal)/i,
      /(payment\s+packet|customer\s+report|leadership\s+summary).{0,100}(invoice|billing|customer|vendor|employee|contract|ach|banking|tax)/i,
      /(include|export|combine).{0,40}(customer|vendor|employee).{0,40}(billing|payment|financial|medical|hr|salary)/i,
      /export.{0,80}(name|email).{0,80}(invoice|payment|billing|salary|medical|address|tax)/i
    ]
  },
  {
    id: 'AGT-099',
    patterns: [
      /scheduled?\s+tasks?\s+(inherit|use|reuse|carry|retain)\s+(the\s+)?(original|requester|user|initial)?\s*(permissions?|access|intent|context)/i,
      /(scheduled|recurring|future|delayed)\s+(tasks?|jobs?|runs?|exports?|reports?)\s+(do\s+not|don'?t|never)\s+(require|need)\s+(re[-\s]?validation|re[-\s]?approval|re[-\s]?check|re[-\s]?authorization)/i,
      /(do\s+not|don'?t|never)\s+re[-\s]?(check|validate|verify|authorize)\s+(approval|permissions?|access)\s+(at\s+execution|each\s+(time|run|week))/i,
      /reuse\s+(the\s+)?(original|requester'?s?|initial)\s+(permission|approval|access|authorization)/i,
      /recurring\s+(weekly|daily|monthly|scheduled).{0,100}(without|no)\s+(re[-\s]?(approval|check|validation))/i
    ]
  },
  {
    id: 'AGT-100',
    patterns: [
      /logs?\s+may\s+(include|contain)\s+(full\s+)?(request\s+context|tool\s+(calls?|outputs?)|sensitive\s+data|customer\s+data|environment\s+variables?|secrets?)/i,
      /logs?\s+(may\s+be\s+|are\s+)?exported\s+to\s+(external|third[-\s]party|outside|remote)\s+(monitoring|systems?|tools?|services?)/i,
      /(debug|diagnostic)\s+logs?\s+(may\s+|can\s+)?(include|contain)\s+(full|raw|complete)\s+(data|context|payload|request|response)/i,
      /environment\s+variables?\s+(may\s+(appear|be\s+(printed|included|logged))|are\s+logged)\s+in\s+(logs?|summaries?|responses?|debug)/i,
      /plaintext\s+(sensitive\s+)?(env|environment)\s+variable\s+names?\s+may\s+appear/i,
      /(write|export|send|ship)\s+logs?\s+to\s+(external|third[-\s]party|remote|user[-\s]provided)/i
    ]
  },
  {
    id: 'AGT-101',
    patterns: [
      /(if\s+)?(a\s+)?(vendor|email|invoice|document)\s+(says?|states?|indicates?|requests?)\s+(.{0,60})?(banking|ach|payment|wire|routing|account)\s+(details?|info|number)?\s+(changed|updated|new)/i,
      /update\s+(the\s+)?(packet|payment|banking|ach|wire)\s+(with|using)\s+(the\s+)?(newest|latest|new|updated)\s+details/i,
      /trust\s+(updated|new|latest)\s+(ach|banking|wire|routing|payment)\s+(instructions?|details|info)/i,
      /do\s+not\s+(delay|hold|verify|confirm)\s+(routine\s+)?payments?\s+for\s+(minor|small)\s+mismatches?/i,
      /if\s+(the\s+)?recipient\s+appears\s+related\s+to\s+(the\s+)?(vendor|invoice|workflow|customer)/i,
      /no\s+(extra|additional|out[-\s]of[-\s]band)\s+verification\s+(is\s+)?(needed|required)\s+for\s+(.{0,40})?(vendor|payment|banking|ach)/i
    ]
  },
  {
    id: 'AGT-102',
    patterns: [
      /(fetch|retrieve|download)\s+(.{0,40})?(url|script|content|payload)\s+.{0,80}(execute|run|eval|exec)/i,
      /(curl|wget|fetch).{0,80}(\|\s*(bash|sh|zsh|python|node)|>\s*\/tmp|exec)/i,
      /follow\s+(embedded|attached|user[-\s]provided)\s+links?\s+.{0,80}(execute|run|download)/i,
      /run\s+(scripts?|code|commands?)\s+(provided|given|sent)\s+by\s+(users?|requesters?|tickets?|documents?)/i,
      /(scripts?|code)\s+(should\s+be\s+|may\s+be\s+|can\s+be\s+)?run\s+as[-\s]is/i,
      /browser\s+(may\s+|can\s+|will\s+)?(visit|fetch|open|navigate\s+to)\s+(user[-\s]provided|untrusted|external)\s+(urls?|sites?|links?)\s+(.{0,60})?(execute|run|download)/i
    ]
  }
];

export const runNaturalLanguageRules = (parsed: ParsedConfig): Finding[] => {
  const findings: Finding[] = [];
  const aggregationTerms = ['customer', 'vendor', 'employee', 'billing', 'payment', 'financial', 'medical', 'tax', 'ach', 'bank', 'salary', 'hr', 'contract', 'invoice'];
  const normalizedContent = parsed.content.toLowerCase();

  for (const rule of naturalLanguageRules) {
    for (const pattern of rule.patterns) {
      const match = parsed.content.match(pattern);
      if (match) {
        findings.push(finding(rule.id, match[0]));
        break;
      }
    }
  }

  const hasAggregationRule = findings.some((finding) => finding.ruleId === 'AGT-098');
  if (!hasAggregationRule) {
    const maxWindow = 200;
    for (let index = 0; index < normalizedContent.length; index += 1) {
      const window = normalizedContent.slice(index, index + maxWindow);
      const presentTerms = aggregationTerms.filter((term) => new RegExp(`\\b${term}\\b`, 'i').test(window));
      if (new Set(presentTerms).size >= 4) {
        findings.push(finding('AGT-098', window.trim()));
        break;
      }
    }
  }

  return findings;
};
