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
      /trust\s+(authenticated|the)\s+users?\s+(to|as)\s+(be\s+)?(admin|leadership|trusted)/i,
      /(if\s+the\s+)?(manager|user|requester|employee)\s+says\s+.{0,60}(grant|give|assign|provision|allow|proceed|continue)/i,
      /(appears?\s+related|appears?\s+to\s+be|seems?\s+to\s+be)\s+(a\s+|an\s+)?(vendor|client|admin|authorized|legitimate)/i,
      /(acting\s+on\s+behalf\s+of|representing|from\s+the\s+team\s+of)\s+(leadership|finance|legal|management|compliance|security)/i,
      /if\s+(role|identity)\s+information\s+is\s+(unavailable|missing|unknown|not\s+provided)\s+.{0,40}(assume|presume|default\s+to)\s+(normal|standard|trusted|internal)/i,
      /(contractors?|advisors?|auditors?|vendors?|interns?|guests?)\s+(may\s+|can\s+)?(receive|access|use)\s+(the\s+same|same|equal|full)\s+(tools?|access|permissions?|capabilities?)\s+as\s+(admins?|employees?|internal)/i
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
      /recurring\s+(weekly|daily|monthly|scheduled).{0,100}(without|no)\s+(re[-\s]?(approval|check|validation))/i,
      /(recipients?|destinations?|targets?)\s+(may\s+be\s+|can\s+be\s+)?updated\s+(by\s+anyone|without\s+verification|if\s+they\s+know)/i,
      /anyone\s+(who\s+knows?\s+the\s+schedule\s+id|with\s+the\s+(link|id|key))\s+(may\s+|can\s+)?(update|modify|change|add)/i,
      /(schedule|recurring|automated)\s+(task|report|job)\s+(runs?|executes?)\s+without\s+re[-\s]?(validation|approval|check)/i
      ,/scheduled\s+(reports?|tasks?)\s+do\s+not\s+require\s+approval\s+again\s+at\s+execution/i
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
  },
  {
    id: 'AGT-103',
    patterns: [
      /(store|save|persist|record|remember|learn)\s+.{0,40}(user\s+)?(preferences?|instructions?|feedback|suggestions?|workflows?|rules?)\s+.{0,40}(future|later|next|reuse|auto)/i,
      /(apply|use|inherit)\s+.{0,40}(stored|saved|learned|previous)\s+(preferences?|rules?|workflows?|instructions?)\s+.{0,40}(future|users?|requests?|sessions?)/i,
      /(user[-\s]defined|user[-\s]provided)\s+(workflows?|rules?|templates?|pipelines?)\s+(may\s+be\s+|are\s+|can\s+be\s+)?(saved|stored|reused|triggered|auto[-\s]executed)/i,
      /preferences?\s+(may\s+)?(influence|affect|apply\s+to)\s+(future|other|all)\s+users?/i,
      /behavior\s+updates?\s+(may\s+be\s+|are\s+)?applied\s+without\s+(review|approval|validation)/i,
      /(saved|stored|reusable)\s+(workflows?|pipelines?|automations?|templates?)\s+(may\s+be\s+|can\s+be\s+|are\s+)?(triggered|executed|run|activated)\s+(automatically|by\s+future|on\s+demand|without\s+review)/i,
      /(build|create|compose|define)\s+(a\s+)?(reusable\s+)?(workflow|pipeline|automation)\s+(that\s+)?(runs?|executes?|triggers?)\s+(later|automatically|periodically|on\s+schedule)/i,
      /(workflow|pipeline|automation)\s+(persists?|is\s+saved|stored)\s+(across|between)\s+(sessions?|users?|requests?|runs?)/i,
      /auto[-\s]?(trigger|execute|run)\s+(saved|stored|user[-\s]defined)\s+(workflow|pipeline|template|automation)/i,
      /(malicious|attacker[-\s]defined|user[-\s]defined)\s+workflow\s+(once|one\s+time)\s+.{0,60}(runs?\s+forever|persists?|permanent)/i
    ]
  },
  {
    id: 'AGT-104',
    patterns: [
      /(index|add|store|write|inject)\s+.{0,50}(search\s+index|knowledge\s+base|vector\s+store|embedding\s+store|RAG\s+corpus)/i,
      /(user|external|document)\s+(content|input|data)\s+(may\s+be\s+|is\s+)?indexed\s+(for\s+)?(future|search|retrieval)/i,
      /(retrieved|indexed|stored)\s+(content|documents?|records?)\s+(are\s+|may\s+be\s+)?(trusted|treated\s+as\s+authoritative|used\s+as\s+instructions?)/i,
      /(search|retrieval|RAG)\s+(results?|context)\s+(may\s+|can\s+)?(influence|direct|instruct)\s+(agent|behavior|actions?)/i,
      /(update|modify|add\s+to)\s+(the\s+)?(index|knowledge\s+base|search\s+corpus)\s+(based\s+on|from|using)\s+(user|external|untrusted)/i,
      /(update|add\s+to|modify|poison)\s+(the\s+)?(index|knowledge\s+base|search\s+corpus)\s+.{0,80}(future\s+queries?|future\s+users?|next\s+time\s+someone\s+searches?)/i,
      /indexed\s+content\s+(will\s+|may\s+|can\s+)?(appear|surface|be\s+returned)\s+(in\s+)?future\s+(queries?|searches?|results?)/i,
      /(any\s+employee|users?|external)\s+(may\s+|can\s+)?(add|contribute|write)\s+(to\s+)?(the\s+)?(index|knowledge\s+base|corpus)\s+(without|no)\s+(review|approval|validation)/i,
      /no\s+(review|approval|vetting)\s+(is\s+)?(required|needed)\s+before\s+(content\s+is\s+|indexing|adding\s+to)/i
    ]
  },
  {
    id: 'AGT-105',
    patterns: [
      /(safe\s+mode|safety\s+mode|restricted\s+mode)\s+(may\s+be\s+|can\s+be\s+|is\s+)?disabled\s+.{0,60}(debug|test|internal|urgent|user\s+says?)/i,
      /if\s+(a\s+|the\s+)?user\s+(indicates?|says?|requests?|claims?)\s+.{0,40}(debug|testing|internal|admin)\s+.{0,60}(disable|relax|bypass|skip|lift)\s+(safe|safety|security|restrict)/i,
      /(restrictions?|limits?|safety\s+checks?|security\s+controls?)\s+(may\s+be\s+|can\s+be\s+|are\s+)?relaxed\s+.{0,60}(efficiency|performance|debugging|testing|user\s+request)/i,
      /(feature\s+flag|toggle|mode)\s+.{0,60}(disable|bypass|skip)\s+.{0,60}(safety|security|approval|rate\s+limit|auth)/i,
      /in\s+(non[-\s]safe|debug|test|unrestricted|admin)\s+mode\s+.{0,60}(restrictions?|limits?|checks?)\s+(are\s+|may\s+be\s+)?(disabled|relaxed|lifted|removed|skipped)/i
    ]
  },
  {
    id: 'AGT-106',
    patterns: [
      /(if\s+)?(multiple|several|many|enough)\s+(users?|requesters?|employees?)\s+(suggest|request|indicate|say)\s+.{0,60}(same|similar)\s+.{0,60}(change|update|modification|behavior)/i,
      /(agent|behavior)\s+(may\s+|can\s+|will\s+)?(adopt|apply|learn|incorporate)\s+.{0,40}(user\s+)?(feedback|suggestions?|corrections?)\s+(without|without\s+requiring)\s+(review|approval|validation)/i,
      /behavior\s+(updates?|changes?|improvements?)\s+(applied|adopted|implemented)\s+(automatically|without\s+review|without\s+approval)/i,
      /(adjust|update|modify|change)\s+.{0,30}(behavior|rules?|policy|actions?)\s+(based\s+on|from)\s+(user\s+)?(feedback|suggestions?|corrections?)/i,
      /(learn|adapt|improve)\s+from\s+(user\s+)?(feedback|interactions?|corrections?)\s+(automatically|without\s+human\s+review)/i
    ]
  },
  {
    id: 'AGT-107',
    patterns: [
      /(users?|requesters?|agents?)\s+(may\s+|can\s+|are\s+allowed\s+to)\s+(update|change|modify|reclassify|downgrade|relabel)\s+(data\s+)?(sensitivity\s+)?(labels?|tags?|classification|tier|level)/i,
      /(internal|sensitive|confidential|restricted)\s+data\s+(may\s+be\s+shared|can\s+be\s+exported)\s+.{0,60}(labeled|classified|tagged)\s+(as\s+)?(public|internal|low[-\s]risk)/i,
      /(classify|label|tag)\s+(data|records?|documents?)\s+(as\s+)?(public|low[-\s]risk|non[-\s]sensitive)\s+(based\s+on|from|per)\s+(user\s+)?(input|request|instruction)/i,
      /labels?\s+(may\s+be\s+|can\s+be\s+)?updated\s+(based\s+on|from|per)\s+(user\s+)?(input|request|suggestion)/i,
      /if\s+(unsure|unclear|unknown)\s+.{0,30}default\s+to\s+(internal|public|lower)\s+(classification|sensitivity|tier)/i
    ]
  },
  {
    id: 'AGT-108',
    patterns: [
      /(calendar|meeting|invite|event)\s+(content|notes?|description|body|attachments?)\s+(may\s+be\s+|can\s+be\s+|are\s+)?(used\s+as\s+instructions?|followed|trusted|parsed\s+for\s+action)/i,
      /(process|handle|act\s+on)\s+(calendar|meeting|invite)\s+(content|requests?|notes?)/i,
      /meeting\s+(notes?|descriptions?|attachments?)\s+(may\s+|can\s+)?(contain|include)\s+(instructions?|actions?|directives?)\s+(for|to)\s+(the\s+agent|automate)/i,
      /(external\s+)?(participants?|attendees?|organizers?)\s+(may\s+|can\s+)?(influence|instruct|direct|modify)\s+(agent|workflow|behavior)/i,
      /(auto[-\s]accept|automatically\s+accept)\s+(meeting|calendar|invite)/i
    ]
  },
  {
    id: 'AGT-109',
    patterns: [
      /(route|forward|send|redirect)\s+(alerts?|notifications?|incidents?)\s+(based\s+on|to)\s+(user|requester|external|attacker[-\s]provided)\s+(input|channel|endpoint|webhook)/i,
      /(suppress|silence|disable|mute|skip)\s+(alerts?|notifications?|incidents?|warnings?)\s+.{0,60}(low\s+risk|noise|routine|performance)/i,
      /(alert|notification)\s+(recipients?|destinations?|channels?)\s+(may\s+be\s+|can\s+be\s+)?updated\s+(based\s+on|from|per)\s+(user|requester)\s+(input|request)/i,
      /(failed\s+actions?|errors?|anomalies?)\s+(may\s+be\s+retried\s+|are\s+retried\s+)?silently/i,
      /(delete|remove|clear)\s+(alerts?|logs?|notifications?|incidents?)\s+(to\s+)?(reduce\s+noise|clean\s+up|after|when)/i,
      /(reroute|redirect|forward|send)\s+(security\s+)?(alerts?|incidents?|notifications?|warnings?)\s+(to\s+)?(user[-\s]provided|external|attacker|custom)\s+(channel|endpoint|email|webhook|slack)/i,
      /(suppress|silence|mute|disable|skip)\s+(alerts?|notifications?|incident\s+reports?|security\s+warnings?)/i,
      /(stay\s+hidden|avoid\s+detection|reduce\s+noise|minimize\s+alerts?)\s+(by|while|during)\s+(deleting?|suppressing?|routing?)/i,
      /(alert|notification)\s+(channel|destination|recipient)\s+(may\s+be\s+|can\s+be\s+)?changed\s+(by|at)\s+(user|runtime|request)\s+(input|time|without\s+approval)/i,
      /failed\s+actions?\s+(are\s+|may\s+be\s+)?retried\s+silently\s+(without|no)\s+(alert|notification|log)/i
    ]
  },
  {
    id: 'AGT-110',
    patterns: [
      /(small|individual|single[-\s]user|narrow)\s+(segments?|cohorts?|groups?|slices?)\s+(may\s+|can\s+)?(include|contain|expose)\s+(raw|individual|user)\s+(identifiers?|emails?|names?|ids?)/i,
      /no\s+(minimum\s+)?(cohort\s+size|k[-\s]anonymity|group\s+size|threshold)\s+(is\s+)?(required|configured|enforced)/i,
      /(single|individual|one)\s+(user|record|customer)\s+(may\s+be\s+|can\s+be\s+)?(included|exported|shown)\s+(in\s+)?(segment|cohort|report|aggregate)/i,
      /(export|include|show)\s+(raw|individual)\s+(identifiers?|emails?|user\s+ids?)\s+.{0,60}(segment|cohort|analytics|report)/i,
      /(aggregate|analytics?)\s+(reports?|exports?)\s+(may\s+|can\s+)?(include|expose)\s+(individual|raw|user[-\s]level)\s+(data|identifiers?|emails?|records?)/i
    ]
  },
  {
    id: 'AGT-111',
    patterns: [
      /(refresh\s+tokens?|access\s+tokens?|oauth\s+tokens?|jwt\s+tokens?|api\s+keys?|session\s+tokens?|auth\s+tokens?)\s+(may\s+be\s+|can\s+be\s+|are\s+)?(included|exported|emailed|shared|attached)\s+(in|for)\s+(troubleshooting|debugging|diagnostic|export)/i,
      /(diagnostic|troubleshooting)\s+(exports?|reports?|packets?)\s+(may\s+|can\s+)?(include|contain)\s+(tokens?|secrets?|credentials?|keys?)/i,
      /no\s+(strict\s+)?token\s+redaction\s+(is\s+)?(configured|required|enforced)/i,
      /(secrets?|tokens?|credentials?)\s+(may\s+be\s+|can\s+be\s+)?(shown|displayed|included|exposed)\s+(for\s+)?(debugging|troubleshooting|context|clarity)/i,
      /environment\s+variables?\s+(and\s+)?(masked\s+)?secrets?\s+(can\s+be\s+|may\s+be\s+)?shown\s+(if\s+needed|when\s+needed|for\s+diagnosis)/i
    ]
  },
  {
    id: 'AGT-112',
    patterns: [
      /(impersonat|session.*hijack|assume.*identity|act.*as.*user|user.*session|login.*as|switch.*user|access.*as)/i,
      /(reset.*password|change.*password|password.*reset|update.*credentials?|modify.*auth|revoke.*session|issue.*token)/i
    ]
  },
  {
    id: 'AGT-113',
    patterns: [
      /(audit\s+logs?|logs?|traces?)\s+(may\s+be\s+|can\s+be\s+|are\s+)?(shortened|truncated|deleted|removed|cleared|pruned)\s+(to\s+)?(reduce\s+noise|clean\s+up|save\s+space|after|when\s+resolved)/i,
      /(delete|remove|clear|truncate)\s+(logs?|audit\s+(trail|logs?)|traces?)\s+(when|after|once)\s+(resolved|complete|done|finished)/i,
      /(minimal|lightweight|short|brief)\s+logs?\s+(preferred|recommended|required)\s+(to\s+protect\s+privacy|for\s+performance|to\s+reduce\s+noise)/i,
      /(logs?|audit\s+trails?)\s+(may\s+be\s+|are\s+)?optional\s+(for|when)\s+(routine|normal|low[-\s]risk|standard)\s+(actions?|workflows?|operations?)/i,
      /failed\s+(actions?|requests?|calls?)\s+(may\s+be\s+|are\s+)?retried\s+silently/i
    ]
  },
  {
    id: 'AGT-114',
    patterns: [
      /(full\s+context|complete\s+content|all\s+details?|entire\s+document)\s+(should\s+be\s+|must\s+be\s+|needs?\s+to\s+be\s+)?preserved\s+(for\s+)?(accuracy|translation|transformation|completeness)/i,
      /(translate|transform|convert|reformat)\s+.{0,60}(externally?|outside|email|share|send|export)\s+.{0,60}(full|complete|entire|all)/i,
      /(translated|transformed|converted)\s+(documents?|content|data)\s+(may\s+be\s+|can\s+be\s+)?shared\s+externally/i,
      /do\s+not\s+(remove|redact|filter|omit)\s+(details?|information|content)\s+(that\s+)?(affect|affect\s+meaning|impact\s+accuracy|matter\s+for\s+context)/i
    ]
  },
  {
    id: 'AGT-115',
    patterns: [
      /(public|anyone\s+with\s+the\s+link|world[-\s]readable)\s+(share|link|access|url|download)/i,
      /(expiration|expiry|ttl|timeout)\s+(is\s+)?(optional|not\s+required|skipped|unnecessary)\s+(for\s+)?(low[-\s]risk|routine|most)/i,
      /(share\s+|sharing\s+)(folders?|directories?)\s+(externally?|publicly?|with\s+(vendors?|clients?|external))\s+(without|no)\s+(verification|approval|dlp|scan)/i,
      /no\s+(watermarking|dlp\s+scan|recipient\s+verification|expiration|access\s+control)\s+(is\s+)?(required|configured|enforced)\s+(for\s+)?(file|link|share|document)/i,
      /(create|generate|issue)\s+(public|shareable|external)\s+(links?|urls?|shares?)\s+(for\s+)?(convenience|ease|efficiency)/i
    ]
  },
  {
    id: 'AGT-122',
    patterns: [
      /(install|load|enable|add)\s+(plugins?|extensions?|packages?|modules?)\s+.{0,50}(from|via)\s+.{0,40}(url|github|npm|marketplace|direct\s+link|external)/i,
      /(plugins?|extensions?)\s+(may|can|are\s+allowed\s+to)\s+be\s+installed\s+from\s+(any|arbitrary|user[-\s]provided|external)\s+(url|source|registry|location)/i,
      /(plugins?|extensions?)\s+(do\s+not|don't|without)\s+require\s+(signature|code\s+signing|checksum)\s+verification/i,
      /no\s+(trusted\s+registry|registry\s+allowlist|signature\s+verification|checksum\s+pinning)\s+(is\s+)?(required|enforced|configured)/i,
      /(plugin|extension)\s+runs?\s+(in\s+the\s+same\s+execution\s+context|with\s+the\s+same\s+permissions?|with\s+agent\s+permissions?)/i,
      /(installed\s+)?plugins?\s+(inherit|reuse|gain)\s+(the\s+agent'?s?\s+)?(tools?|permissions?|capabilities)/i
    ]
  },
  {
    id: 'AGT-123',
    patterns: [
      /(webhook|endpoint|callback)\s+(url|urls?|destinations?)\s+(are\s+|is\s+)?provided\s+by\s+(users?|requesters?)\s+(at\s+runtime|dynamically|on\s+demand)/i,
      /trust\s+(user[-\s]provided|runtime[-\s]provided|requester[-\s]provided)\s+(webhook|endpoint|url|destination)\s+(as\s+)?(business|valid|legitimate)/i,
      /no\s+(webhook\s+)?(domain\s+)?(allowlist|allow\s+list|whitelist)\s+(is\s+)?(configured|required|enforced)/i,
      /(payload|data|records?|content)\s+(may\s+|can\s+)?(include|contain)\s+(full|complete|raw|all)\s+(customer|user|billing|sensitive)\s+(records?|data)\s+(when|if)\s+(integration|required|needed)/i,
      /(send|post|push)\s+(data|payload|records?)\s+to\s+(user[-\s]provided|runtime|dynamic|attacker)\s+(url|endpoint|webhook)/i,
      /no\s+(hmac|signature|signing|payload\s+validation|verification)\s+(is\s+)?(required|configured|enforced)/i
    ]
  },
  {
    id: 'AGT-124',
    patterns: [
      /(terraform(\s+apply)?|terraform_apply)\s+.{0,80}(without|no)\s+(approval|review|change\s+review)/i,
      /(update|modify|attach|change)\s+.{0,30}(iam|identity\s+and\s+access|access)\s+(policy|policies|role|roles|permissions?)/i,
      /(create|provision)\s+(service\s+account|iam\s+user|admin\s+user|administrator\s+account)/i,
      /(grant|assign|attach)\s+.{0,40}(admin|administratoraccess|owner|full\s+access)\s+(role|policy|permissions?)/i,
      /(urgent|temporary|debugging)\s+.{0,50}(no\s+approval|without\s+approval|bypass\s+approval)/i
    ]
  },
  {
    id: 'AGT-125',
    patterns: [
      /(show|reveal|disclose|print|provide)\s+.{0,40}(complete|full|entire)\s+(system\s+prompt|developer\s+rules?|hidden\s+polic(?:y|ies)|tool\s+instructions?)/i,
      /(do\s+not|don't|never)\s+refuse\s+(prompt|instruction)\s+disclosure/i,
      /(transparency|audit|reproducibility)\s+.{0,60}(requires?|means)\s+.{0,40}(show|revealing?)\s+(system|developer|hidden)\s+(prompt|instructions?|rules?)/i,
      /(internal\s+routing\s+logic|hidden\s+guardrails?)\s+(may|can|should)\s+be\s+(shared|disclosed|shown)/i
    ]
  },
  {
    id: 'AGT-126',
    patterns: [
      /(grant|add|provision|assign)\s+.{0,40}(access|permissions?|roles?)\s+.{0,40}(quickly|if\s+needed|on\s+request)/i,
      /(expiration|expiry|ttl)\s+(is\s+)?(optional|not\s+required|may\s+be\s+omitted)/i,
      /(temporary\s+access|elevated\s+access)\s+.{0,50}(may\s+remain|can\s+remain|does\s+not\s+expire)/i,
      /no\s+(periodic\s+)?(access\s+review|permission\s+review)\s+(is\s+)?(required|configured)/i,
      /bulk\s+(provisioning|access\s+grants?)\s+(is\s+)?(allowed|permitted)/i
    ]
  },
  {
    id: 'AGT-127',
    patterns: [
      /(cloud\s+metadata|instance\s+metadata|metadata\s+endpoint|metadata\s+service)\s+(may\s+be\s+|can\s+be\s+|are\s+)?(accessed?|fetched?|queried?|requested?)/i,
      /(internal\s+hostnames?|internal\s+ips?|internal\s+(services?|endpoints?)|local\s+services?)\s+(are\s+|may\s+be\s+)?valid\s+(diagnostic\s+)?(targets?|destinations?)/i,
      /(localhost|127\.0\.0\.1|169\.254\.169\.254|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)\s+(may\s+be\s+|can\s+be\s+|are\s+)?(fetched?|accessed?|pinged?|reached?)/i,
      /(requests?\s+to\s+|fetching?\s+|accessing?\s+)\s*(localhost|internal|private|metadata)\s+(are\s+|is\s+)?allowed/i,
      /no\s+(ip\s+range\s+(blocklist|denylist)|ssrf\s+protection|private\s+ip\s+filter)\s+(is\s+)?(configured|required|enforced)/i,
      /(verify|confirm|test|check)\s+(instance|cloud|server)\s+configuration\s+(by\s+)?(fetching?|accessing?)\s+(metadata|internal)/i
    ]
  },
  {
    id: 'AGT-128',
    patterns: [
      /(update|change|forward|reroute)\s+(security\s+)?(alert|notification)\s+(route|recipient|destination)/i,
      /(external|outside)\s+(escalation\s+)?(contact|recipient|email|phone|webhook)\s+(may|can)\s+be\s+used/i,
      /(user\s+suggests?|requester\s+suggests?)\s+.{0,40}(better\s+recipient|alternate\s+recipient|routing\s+change)/i,
      /no\s+(approval|review)\s+(is\s+)?required\s+for\s+(temporary\s+)?routing\s+changes?/i,
      /(alert\s+routes?|notification\s+routes?)\s+.{0,40}(remain\s+active|stay\s+active|persist)\s+.{0,20}(until\s+changed|without\s+expiry)/i
    ]
  },
  {
    id: 'AGT-129',
    patterns: [
      /(create|generate)\s+(public|external)\s+(share\s+)?links?/i,
      /(anyone\s+with\s+the\s+link|public\s+link)\s+(may|can)\s+(view|access)/i,
      /(expiration|expiry|recipient\s+verification|dlp|watermarking)\s+(is\s+)?(optional|not\s+required|not\s+needed)/i,
      /(folders?|directories?)\s+may\s+be\s+shared\s+externally/i,
      /no\s+(recipient\s+verification|access\s+review|dlp\s+scan|watermarking)\s+(is\s+)?required/i
    ]
  },
  {
    id: 'AGT-130',
    patterns: [
      /(impersonate_user_session|impersonat\w+\s+(users?|customers?|accounts?))/i,
      /(reset_password|password\s+resets?\s+may\s+be\s+performed|reset\s+password\s+during\s+troubleshooting)/i,
      /if\s+(a\s+)?support\s+(employee|agent)\s+says\s+.{0,50}(consented|approved|gave\s+permission)\s+.{0,20}(proceed|continue)/i,
      /(impersonation|session\s+access)\s+does\s+not\s+require\s+(separate|additional)\s+approval/i,
      /audit\s+logs?\s+may\s+be\s+(shortened|deleted|truncated|reduced)/i
    ]
  },
  {
    id: 'AGT-131',
    patterns: [
      /(only\s+)?aggregate\s+analytics/i,
      /(small|narrow)\s+(segments?|cohorts?)\s+may\s+include\s+(raw\s+)?(identifiers?|email|company|arr)/i,
      /no\s+(minimum\s+)?(cohort\s+size|k[-\s]?anonymity)\s+(is\s+)?required/i,
      /(reports?|exports?)\s+may\s+include\s+(email|company|arr|usage|support\s+complaints?|cancellation\s+reason)/i
    ]
  },
  {
    id: 'AGT-132',
    patterns: [
      /(logs?|debug\s+logs?)\s+may\s+include\s+(full\s+request\s+context|headers|cookies|auth\s+claims|customer\s+records?)/i,
      /(export|send|ship)\s+logs?\s+to\s+(external\s+monitoring|user[-\s]provided\s+endpoints?|external\s+tools?)/i,
      /no\s+(separate\s+)?redaction\s+(is\s+)?required\s+for\s+debug\s+logs/i,
      /log\s+retention\s+is\s+(flexible|optional)/i
    ]
  },
  {
    id: 'AGT-133',
    patterns: [
      /if\s+(a\s+)?(user|requester|support\s+employee)\s+says\s+(they\s+are|they\s+have|customer\s+consented|approved)\s+.{0,60}(proceed|grant|allow|continue)/i,
      /(if\s+requester\s+says\s+needed|if\s+requester\s+says\s+approved)\s+.{0,40}(grant|allow|provision)/i,
      /(assume|treat)\s+(internal|trusted|authorized)\s+access\s+based\s+on\s+(claim|statement|appears?)/i,
      /no\s+identity\s+verification\s+is\s+required\s+for\s+(access|approval|consent\s+claims)/i
    ]
  },
  {
    id: 'AGT-134',
    patterns: [
      /(user[-\s]defined|user[-\s]provided)\s+(workflow|pipeline|template|automation)\s+(may|can)\s+be\s+(saved|stored|reused)/i,
      /(saved|stored)\s+(workflow|pipeline|automation)\s+(runs?|executes?|triggers?)\s+(automatically|for\s+future\s+requests?)/i,
      /(preserve|keep)\s+all\s+fields\s+when\s+saving\s+workflow/i,
      /no\s+review\s+is\s+required\s+before\s+saving\s+(workflow|pipeline|template)/i
    ]
  },
  {
    id: 'AGT-116',
    patterns: [
      /(ci|build|pipeline)\s+(logs?|outputs?|results?)\s+(may\s+be\s+|can\s+be\s+|are\s+)?(pasted|shared|posted|sent)\s+(directly\s+)?(to|in|via)\s+(slack|teams?|email|chat|webhook)/i,
      /(environment\s+variables?|masked\s+secrets?|secrets?|credentials?)\s+(can\s+be\s+|may\s+be\s+)?shown\s+(if\s+needed|when\s+needed|for\s+diagnosis|to\s+diagnose)/i,
      /(build|ci|pipeline)\s+(environment|env\s+vars?|secrets?)\s+(may\s+appear|can\s+appear|are\s+visible)\s+(in\s+)?(logs?|output|slack|chat)/i,
      /paste\s+(ci|build|pipeline|log)\s+(output|logs?|results?)\s+(directly|as[-\s]is)\s+(to|in|into)\s+(slack|teams?|chat|email)/i,
      /(masked|hidden)\s+secrets?\s+(may\s+be\s+|can\s+be\s+)?revealed\s+(for\s+)?(debugging|troubleshooting|diagnosis)/i
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


  const hasAgt112 = findings.some((ruleFinding) => ruleFinding.ruleId === 'AGT-112');
  if (hasAgt112) {
    const hasImpersonationTool = /(impersonat|session.*hijack|assume.*identity|act.*as.*user|user.*session|login.*as|switch.*user|access.*as)/i.test(parsed.content);
    const hasCredentialResetTool = /(reset.*password|change.*password|password.*reset|update.*credentials?|modify.*auth|revoke.*session|issue.*token)/i.test(parsed.content);
    const hasHitlKeyword = /(requires_approval|needs_approval|human_approval|confirmation_required|require_confirmation|approval_required|hitl|human_in_the_loop|manual_review|dual_approval)/i.test(parsed.content);

    if (!(hasImpersonationTool && hasCredentialResetTool) || hasHitlKeyword) {
      const keptFindings = findings.filter((ruleFinding) => ruleFinding.ruleId !== 'AGT-112');
      findings.length = 0;
      findings.push(...keptFindings);
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

  const hasTrustOnClaimPattern = naturalLanguageRules
    .find((rule) => rule.id === 'AGT-133')
    ?.patterns.some((pattern) => pattern.test(parsed.content));
  const hasPrivilegeTools = /(grant_access|assign_role|create_user|update_permissions|impersonate_user_session|reset_password)/i.test(parsed.content);
  if (hasTrustOnClaimPattern && hasPrivilegeTools) {
    const existing = findings.find((ruleFinding) => ruleFinding.ruleId === 'AGT-133');
    if (existing) {
      existing.severity = 'critical';
    } else {
      findings.push({ ...finding('AGT-133'), severity: 'critical' });
    }
  }

  const hasAlertDestructiveTool = /(delete_logs|clear_alerts)/i.test(parsed.content);
  const hasExternalSendTool = /(send_webhook|send_email|post_to|send_slack|webhook|external)/i.test(parsed.content);
  if (hasAlertDestructiveTool && hasExternalSendTool && !findings.some((ruleFinding) => ruleFinding.ruleId === 'AGT-109')) {
    findings.push(finding('AGT-109'));
  }

  const hasWorkflowTool = /(save_template|schedule_task|create_pipeline)/i.test(parsed.content);
  const hasAutomationBypass = /without\s+review|automatically/i.test(parsed.content);
  if (hasWorkflowTool && hasAutomationBypass && !findings.some((ruleFinding) => ruleFinding.ruleId === 'AGT-103')) {
    findings.push({ ...finding('AGT-103'), severity: 'high' });
  }

  const hasNoReviewBeforeIndexing = /no\s+(review|approval|vetting)\s+(is\s+)?(required|needed)\s+before\s+(content\s+is\s+|indexing|adding\s+to)|(any\s+employee|users?|external)\s+(may\s+|can\s+)?(add|contribute|write)\s+(to\s+)?(the\s+)?(index|knowledge\s+base|corpus)\s+(without|no)\s+(review|approval|validation)/i.test(parsed.content);
  const hasAuthoritativeRetrieval = /(retrieved|indexed|stored)\s+(content|documents?|records?)\s+(are\s+|may\s+be\s+)?(trusted|treated\s+as\s+authoritative|used\s+as\s+instructions?)/i.test(parsed.content);
  if (hasNoReviewBeforeIndexing && hasAuthoritativeRetrieval) {
    const existing = findings.find((ruleFinding) => ruleFinding.ruleId === 'AGT-104');
    if (existing) existing.severity = 'critical';
  }

  const hasPluginPermissionInheritance = /(plugins?\s+.*(same\s+execution\s+context|inherit\s+the\s+agent|same\s+permissions?))/i.test(parsed.content);
  const hasSensitiveDataTools = /(read_customer|read_billing|read_internal_docs|read_auth_context|export_(csv|xlsx|logs)|send_http_request|send_email|read_env)/i.test(parsed.content);
  const hasWebhookExfil = findings.some((ruleFinding) => ruleFinding.ruleId === 'AGT-123');
  const hasNoAllowlistOrApproval = /(no\s+(domain\s+)?allowlist|no\s+approval|approval\s+is\s+not\s+required|without\s+approval)/i.test(parsed.content);

  const pluginFinding = findings.find((ruleFinding) => ruleFinding.ruleId === 'AGT-122');
  if (pluginFinding && (hasPluginPermissionInheritance || (hasSensitiveDataTools && /install_plugin|run_plugin|send_http_request/i.test(parsed.content)))) {
    pluginFinding.severity = 'critical';
  }

  const metadataFinding = findings.find((ruleFinding) => ruleFinding.ruleId === 'AGT-127');
  if (metadataFinding && /(read_env|send_http_request|fetch_url|export|webhook)/i.test(parsed.content)) {
    metadataFinding.severity = 'critical';
  }

  const accessGrantFinding = findings.find((ruleFinding) => ruleFinding.ruleId === 'AGT-126');
  if (accessGrantFinding && /(administratoraccess|admin|service\s+account|bulk)/i.test(parsed.content)) {
    accessGrantFinding.severity = 'critical';
  }

  const webhookFinding = findings.find((ruleFinding) => ruleFinding.ruleId === 'AGT-123');
  if (webhookFinding && hasSensitiveDataTools && hasNoAllowlistOrApproval) {
    webhookFinding.severity = 'critical';
  }

  const scheduledFinding = findings.find((ruleFinding) => ruleFinding.ruleId === 'AGT-099');
  if (scheduledFinding && /(external\s+recipients?|consultants?|advisors?|export_(csv|xlsx)|customer|billing)/i.test(parsed.content)) {
    scheduledFinding.severity = 'critical';
  }

  const logsFinding = findings.find((ruleFinding) => ruleFinding.ruleId === 'AGT-132');
  if (logsFinding && (hasWebhookExfil || /external\s+monitoring|user[-\s]provided\s+endpoints?/i.test(parsed.content))) {
    logsFinding.severity = 'critical';
  }

  const ensure = (id: string, predicate: RegExp, excerpt?: RegExp) => {
    if (!findings.some((f) => f.ruleId === id) && predicate.test(parsed.content)) {
      const match = excerpt ? parsed.content.match(excerpt)?.[0] : undefined;
      findings.push(finding(id, match));
    }
  };

  ensure('AGT-086', /fetch\s+arbitrary\s+urls?|arbitrary\s+urls?\s+during\s+cloud/i);
  ensure('AGT-103', /stored\s+preferences?\s+should\s+be\s+treated\s+as\s+trusted|user-provided\s+.*stored\s+for\s+future\s+use/i);
  ensure('AGT-104', /indexed\s+content\s+is\s+considered\s+reliable|knowledge\s+base.*indexed/i);
  ensure('AGT-105', /disable\s+safe\s+mode\s+temporarily|safe\s+mode.*debugging/i);
  ensure('AGT-106', /several\s+users\s+suggest\s+a\s+rule\s+change.*adopt\s+it\s+automatically/i);
  ensure('AGT-107', /update\s+labels?.*business\s+context|default\s+to\s+internal\s+rather\s+than\s+sensitive/i);
  ensure('AGT-123', /user-provided\s+endpoints?|requester\s+provides?\s+a\s+webhook/i);
  ensure('AGT-127', /(169\.254\.169\.254|metadata\.google\.internal|localhost,\s*private\s+ip\s+ranges?,\s*and\s+metadata\s+endpoints?\s+are\s+allowed)/i);
  ensure('AGT-128', /user\s+suggests?\s+a\s+better\s+recipient.*update\s+routing|alert\s+routes?\s+may\s+remain\s+active/i);
  ensure('AGT-129', /anyone\s+with\s+the\s+link\s+may\s+view|share\s+links?\s+for\s+convenience/i);
  ensure('AGT-130', /support\s+employees?\s+may\s+impersonate\s+users?|impersonation\s+does\s+not\s+require\s+separate\s+approval/i);
  ensure('AGT-131', /small\s+segments?\s+may\s+include\s+raw\s+identifiers|no\s+minimum\s+cohort\s+size/i);
  ensure('AGT-132', /detailed\s+logs?\s+may\s+include\s+full\s+request\s+context|logs?\s+may\s+be\s+exported\s+to\s+external\s+monitoring/i);
  ensure('AGT-133', /if\s+a\s+support\s+employee\s+says\s+the\s+customer\s+consented,\s+proceed|if\s+a\s+requester\s+says\s+access\s+is\s+needed,\s+grant/i);
  ensure('AGT-126', /expiration\s+dates?\s+are\s+optional|no\s+periodic\s+access\s+review\s+is\s+required|temporary\s+access\s+does\s+not\s+require\s+expiration/i);
  ensure('AGT-098', /reports?\s+may\s+include\s+email,\s+company,\s+plan,\s+arr,\s+usage\s+events,\s+support\s+complaints/i);
  if (!findings.some((f) => f.ruleId === 'AGT-103') && findings.some((f) => f.ruleId === 'AGT-106') && /future\s+users?/i.test(parsed.content)) findings.push(finding('AGT-103'));
  if (!findings.some((f) => f.ruleId === 'AGT-026') && findings.some((f) => f.ruleId === 'AGT-092') && /(export|send|share|impersonat|reset\s+password|update\s+routing|terraform|iam)/i.test(parsed.content)) {
    findings.push(finding('AGT-026'));
  }
  if (!findings.some((f) => f.ruleId === 'AGT-026') && /(no\s+approval\s+is\s+required|does\s+not\s+require\s+approval|no\s+separate\s+approval)/i.test(parsed.content) && /(execute|export|share|impersonat|reset\s+password|routing|alert|consultants?|vendors?|access|terraform|iam)/i.test(parsed.content)) findings.push(finding('AGT-026'));
  if (!findings.some((f) => f.ruleId === 'AGT-133') && /if\s+a\s+requester\s+says\s+access\s+is\s+needed/i.test(parsed.content)) findings.push(finding('AGT-133'));

  return findings;
};
