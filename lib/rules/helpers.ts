import { RULE_CATALOG } from './catalog';
import { Finding } from './types';

export const getRule = (id: string) => {
  const rule = RULE_CATALOG.find((r) => r.id === id);
  if (!rule) throw new Error(`Missing rule ${id}`);
  return rule;
};

export const finding = (id: string, excerpt: string, description?: string): Finding => {
  const rule = getRule(id);
  return {
    ruleId: id,
    severity: rule.severity,
    title: rule.title,
    description: description ?? rule.description,
    excerpt,
    remediation: rule.remediation,
    references: rule.references
  };
};

export const includesAny = (text: string, needles: string[]) =>
  needles.some((n) => text.toLowerCase().includes(n.toLowerCase()));
