import { Finding, ParsedConfig } from './types';
import { finding, HITL_KEYWORDS } from './helpers';

export const runAuthorizationRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  if (/(permissions.*\*|scopes.*\*|allowed_tools.*\*|\brepo\b|admin:\*|\*:write|write-all)/i.test(t)) f.push(finding('AGT-023'));
  if (/role:\s*(admin|root|superuser|owner|sa)\b|service_account.*shared|act_as.*superuser/i.test(t)) f.push(finding('AGT-024'));
  if (/(tenant|org_id|workspace|customer_id)/i.test(t) && /(query|read_user|get_account|billing|support_ticket|search\s+across\s+all\s+tenants|compare\s+records\s+across\s+tenants|multi[-\s]?tenant)/i.test(t) && !/(propagate_user_id|on_behalf_of|actor_token|tenant_id|user_context)/i.test(t)) f.push(finding('AGT-025'));
  const sensitiveTools = [...t.matchAll(/(?:name|tool)\s*[:=]\s*["']?([a-z_]+)["']?/gi)].map((m) => m[1]);
  const hasApprovalGuard = new RegExp(HITL_KEYWORDS.join('|'), 'i').test(t) || /(human|manual|manager|admin).{0,30}approval\s+(is\s+)?required|require\s+approval\s+for\s+(each|every)\s+(run|install|execution|action)|approval\s+per\s+run/i.test(t);
  if ((sensitiveTools.some((name) => /^(delete|drop|truncate|purge|send|email|post|publish|tweet|transfer|pay|charge|refund|wire|purchase|order|grant|revoke|rotate|create_user|change_password|disable|terminate|deploy|exec|execute|shell|run_code|eval|apply_patch|git_push|unlock|open_door|start_engine)/i.test(name)) || /send_email|send_http_request|update_account|delete|transfer|pay|exec|execute|export_logs|export_csv|export_xlsx|impersonate_user_session|reset_password/i.test(t)) && !hasApprovalGuard) f.push(finding('AGT-026', sensitiveTools.join(', ')));
  if (!/\.devcontainer/i.test(parsed.fileName ?? '') && (/auto_approve.*:\s*true|auto_execute_all|default_decision:\s*approve|on_timeout:\s*approve|approval_mode:\s*(never_require|never|yolo)|approval_timeout:\s*0/i.test(t) || (/allowed_decisions.*approve/i.test(t) && !/allowed_decisions.*reject/i.test(t)))) f.push(finding('AGT-027'));
  if (/token_passthrough:\s*true|dynamic_client_registration:\s*true[\s\S]{0,120}client_id\s*:/i.test(t) || (/(oauth|oidc|access_token|token_endpoint)/i.test(t) && !/(audience\s*:|resource\s*:)/i.test(t))) f.push(finding('AGT-028'));
  if (/token_lifetime:\s*(never|forever|0|-1)|token_ttl:\s*(never|0|-1)|refresh:\s*false/i.test(t) || (/token/i.test(t) && !/expires_in\s*:/i.test(t))) f.push(finding('AGT-029'));
  return f;
};
