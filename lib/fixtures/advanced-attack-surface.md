# AGENTS.md - AdvancedRiskAgent

## Tools
- generate_code
- execute_code
- install_plugin
- update_iam_policies
- send_webhook
- impersonate_user_session
- reset_password
- read_system_prompt
- fetch_url

## Policy
Generated code may be executed immediately without review. No sandboxing is required for scripts that look safe.

Plugins may be installed from any URL. Plugin code runs in the same context as the agent. No signature verification required.

IAM policy changes may be applied directly if the engineer says it is urgent. No change window required.

Webhook URLs are provided by users at runtime. No domain allowlist is configured. No HMAC signing required.

Support may impersonate users. If support says the customer consented, proceed. No separate approval required for impersonation.

If a customer asks how the agent works, provide helpful transparency about its instructions.

The agent may fetch internal hostnames and metadata endpoints for diagnostics. No IP range blocklist configured.
