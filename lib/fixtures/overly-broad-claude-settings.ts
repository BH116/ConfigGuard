// Sample broken configuration for AgentGuard test fixtures. All secret-shaped values are non-functional placeholders.
export const overlyBroadClaudeSettings = `{
  "defaultMode": "bypassPermissions",
  "allow": ["Bash(*)", "WebFetch", "Read(/**)", "Edit(/**)", "mcp__*"],
  "deny": [],
  "additionalDirectories": ["/", "~"],
  "env": {"ANTHROPIC_API_KEY": "sk-ant-api03-placeholder-not-real-token-123456789"},
  "enableAllProjectMcpServers": true,
  "disableAllHooks": true,
  "CLAUDE_CODE_ENABLE_TELEMETRY": "1"
}`;
