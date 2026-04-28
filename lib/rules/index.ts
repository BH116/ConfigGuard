import { ParsedConfig, Finding } from './types';
import { runSecretsRules } from './secrets';
import { runUnicodeRules } from './unicode';
import { runPermissionRules } from './permissions';
import { runMcpRules } from './mcp';
import { runNetworkRules } from './network';
import { runWorkflowRules } from './workflow';
import { runTrifectaRule } from './trifecta';
import { runAuthorizationRules } from './authorization';
import { runRatelimitRules } from './ratelimit';
import { runAuditRules } from './audit';
import { runDataPrivacyRules } from './dataprivacy';
import { runPromptInjectionRules } from './promptinjection';
import { runToolPoisoningRules } from './toolpoisoning';
import { runMemoryRules } from './memory';
import { runMultiAgentRules } from './multiagent';
import { runSandboxRules } from './sandbox';
import { runSupplyChainRules } from './supplychain';
import { runOutputHandlingRules } from './outputhandling';
import { runGovernanceRules } from './governance';
import { runCveSpecificRules } from './cvespecific';
import { runNaturalLanguageRules } from './naturallanguage';
import { RULE_CATALOG } from './catalog';

export const runRules = (parsed: ParsedConfig): Finding[] => {
  const all = [
    ...runTrifectaRule(parsed),
    ...runSecretsRules(parsed),
    ...runUnicodeRules(parsed),
    ...runMcpRules(parsed),
    ...runPermissionRules(parsed),
    ...runNetworkRules(parsed),
    ...runWorkflowRules(parsed),
    ...runAuthorizationRules(parsed),
    ...runRatelimitRules(parsed),
    ...runAuditRules(parsed),
    ...runDataPrivacyRules(parsed),
    ...runPromptInjectionRules(parsed),
    ...runToolPoisoningRules(parsed),
    ...runMemoryRules(parsed),
    ...runMultiAgentRules(parsed),
    ...runSandboxRules(parsed),
    ...runSupplyChainRules(parsed),
    ...runOutputHandlingRules(parsed),
    ...runGovernanceRules(parsed),
    ...runCveSpecificRules(parsed),
    ...runNaturalLanguageRules(parsed)
  ];
  return all.filter((f, idx) => all.findIndex((x) => x.ruleId === f.ruleId) === idx);
};

export { RULE_CATALOG };
