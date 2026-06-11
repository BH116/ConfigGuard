// ConfigGuard
import { Finding, ParsedConfig } from './types';
import { finding, firstMatchingLine, HITL_KEYWORDS_RE } from './helpers';

/**
 * Checks authorization controls: wildcard scopes, admin/root role assignment, missing tenant identity propagation, sensitive tools without human approval gates, HITL bypass flags, OAuth token passthrough, and long-lived credentials.
 *
 * @param parsed - The parsed config to scan.
 * @returns Findings for authorization and identity misconfigurations.
 */
export const runAuthorizationRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];
  const m23 = t.match(/(permissions.*\*|scopes.*\*|allowed_tools.*\*|\brepo\b|admin:\*|\*:write|write-all)/i);
  if (m23) f.push(finding('AGT-023', m23[0]));
  const m24 = t.match(/role:\s*(admin|root|superuser|owner|sa)\b|service_account.*shared|act_as.*superuser/i);
  if (m24) f.push(finding('AGT-024', m24[0]));
  const m25 = t.match(/(query|read_user|get_account|billing|support_ticket|search\s+across\s+all\s+tenants|compare\s+records\s+across\s+tenants|multi[-\s]?tenant)/i);
  if (/(tenant|org_id|workspace|customer_id)/i.test(t) && m25 && !/(propagate_user_id|on_behalf_of|actor_token|tenant_id|user_context)/i.test(t)) f.push(finding('AGT-025', m25[0]));
  const sensitiveTools = [...t.matchAll(/(?:name|tool)\s*[:=]\s*["']?([a-z_]+)["']?/gi)].map((m) => m[1]);
  const hasApprovalGuard = HITL_KEYWORDS_RE.test(t) || /(human|manual|manager|admin).{0,30}approval\s+(is\s+)?required|require\s+approval\s+for\s+(each|every)\s+(run|install|execution|action)|approval\s+per\s+run/i.test(t);
  const m26 = t.match(/send_email|send_http_request|update_account|delete|transfer|pay|exec|execute|export_logs|export_csv|export_xlsx|impersonate_user_session|reset_password/i);
  if ((sensitiveTools.some((name) => /^(delete|drop|truncate|purge|send|email|post|publish|tweet|transfer|pay|charge|refund|wire|purchase|order|grant|revoke|rotate|create_user|change_password|disable|terminate|deploy|exec|execute|shell|run_code|eval|apply_patch|git_push|unlock|open_door|start_engine)/i.test(name)) || m26) && !hasApprovalGuard) f.push(finding('AGT-026', sensitiveTools.join(', ') || m26?.[0]));
  const m27 = t.match(/auto_approve.*:\s*true|auto_execute_all|default_decision:\s*approve|on_timeout:\s*approve|approval_mode:\s*(never_require|never|yolo)|approval_timeout:\s*0/i);
  const m27b = t.match(/allowed_decisions.*approve/i);
  if (!/\.devcontainer/i.test(parsed.fileName ?? '') && (m27 || (m27b && !/allowed_decisions.*reject/i.test(t)))) f.push(finding('AGT-027', m27?.[0] ?? m27b?.[0]));
  const m28 = t.match(/token_passthrough:\s*true|dynamic_client_registration:\s*true[\s\S]{0,120}client_id\s*:/i);
  const m28b = t.match(/(oauth|oidc|access_token|token_endpoint)/i);
  if (m28 || (m28b && !/(audience\s*:|resource\s*:)/i.test(t))) f.push(finding('AGT-028', m28?.[0] ?? (m28b ? firstMatchingLine(t, [m28b[0]]) ?? m28b[0] : undefined)));
  const m29 = t.match(/token_lifetime:\s*(never|forever|0|-1)|token_ttl:\s*(never|0|-1)|refresh:\s*false/i);
  if (m29 || (/token/i.test(t) && !/expires_in\s*:/i.test(t))) f.push(finding('AGT-029', m29?.[0] ?? firstMatchingLine(t, ['token'])));
  return f;
};
