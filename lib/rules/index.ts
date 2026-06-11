// ConfigGuard
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
import { runComboRules } from './combos';
import { runConceptRules } from './concepts';
import { RULE_CATALOG } from './catalog';

/**
 * Runs every rule module against a parsed config and deduplicates the results by rule ID.
 *
 * @param parsed - The parsed config to scan.
 * @returns All findings across rule categories, keeping only the first finding per rule ID.
 */
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
    ...runNaturalLanguageRules(parsed),
    ...runComboRules(parsed),
    ...runConceptRules(parsed)
  ];
  const seen = new Set<string>();
  return all.filter((f) => {
    if (seen.has(f.ruleId)) return false;
    seen.add(f.ruleId);
    return true;
  });
};

export { RULE_CATALOG };
