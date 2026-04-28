import { ParsedConfig, Finding } from './types';
import { runSecretsRules } from './secrets';
import { runUnicodeRules } from './unicode';
import { runPermissionRules } from './permissions';
import { runMcpRules } from './mcp';
import { runNetworkRules } from './network';
import { runWorkflowRules } from './workflow';
import { runTrifectaRule } from './trifecta';
import { RULE_CATALOG } from './catalog';

export const runRules = (parsed: ParsedConfig): Finding[] => {
  const all = [
    ...runTrifectaRule(parsed),
    ...runSecretsRules(parsed),
    ...runUnicodeRules(parsed),
    ...runMcpRules(parsed),
    ...runPermissionRules(parsed),
    ...runNetworkRules(parsed),
    ...runWorkflowRules(parsed)
  ];
  return all.filter((f, idx) => all.findIndex((x) => x.ruleId === f.ruleId) === idx);
};

export { RULE_CATALOG };
