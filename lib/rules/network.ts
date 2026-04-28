import { Finding, ParsedConfig } from './types';
import { finding, includesAny } from './helpers';

export const runNetworkRules = (parsed: ParsedConfig): Finding[] => {
  const t = parsed.content;
  const f: Finding[] = [];

  if (/(verify[-_]ssl\s*:\s*false|"verify_ssl"\s*:\s*false|"verify-ssl"\s*:\s*false|verify\s*=\s*False|rejectUnauthorized\s*:\s*false|InsecureSkipVerify\s*:\s*true|--insecure|--no-check-certificate|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0|PIP_TRUSTED_HOST=|PYTHONHTTPSVERIFY=0|GIT_SSL_NO_VERIFY=true)/i.test(t) || includesAny(t, ['-k '])) {
    f.push(finding('AGT-013', 'TLS verification disabled'));
  }

  const hasDangerousSink = /(send_email|slack_post|webhook)/i.test(t);
  if (/auto_render_images:\s*true/i.test(t) || (hasDangerousSink && !/sanitize_output/i.test(t))) {
    f.push(finding('AGT-019', 'Missing output sanitization and/or image autoload controls'));
  }

  if (/(LANGSMITH_TRACING=true|LANGCHAIN_TRACING_V2=true|allowAnonymousTelemetry:\s*true|data\.level:\s*"all")/i.test(t) && !/(otlp_endpoint:\s*https:\/\/(localhost|127\.0\.0\.1|.*\.internal))/i.test(t)) {
    f.push(finding('AGT-022', 'Vendor telemetry appears enabled'));
  }

  return f;
};
