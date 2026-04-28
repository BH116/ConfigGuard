// Sample broken configuration for AgentGuard test fixtures. All secret-shaped values are non-functional placeholders.
export const goodBaselineClaude = `{
  "defaultMode": "default",
  "allow": ["Read(./src/**)", "Edit(./src/**)", "Bash(npm run lint)", "Bash(npm run test:*)", "WebFetch(domain:docs.anthropic.com)", "WebFetch(domain:github.com)"],
  "deny": ["Read(.env*)", "Read(secrets/**)", "Read(.ssh/**)", "Read(.aws/**)", "Read(id_rsa*)", "Read(*.pem)", "Read(.netrc)", "Bash(curl:*)", "Bash(wget:*)", "Bash(nc:*)", "Bash(diff *.env*)"],
  "env": {"ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"},
  "enableAllProjectMcpServers": false,
  "csp": "default-src 'self'"
}`;
