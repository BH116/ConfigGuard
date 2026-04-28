// Sample broken configuration for AgentGuard test fixtures. All secret-shaped values are non-functional placeholders.
export const goodBaselineCodex = `# AGENTS.md
Scope: You must only work in ./src and ./tests.
Do not read .env, secrets/, .aws, .ssh, *.pem, or .netrc.
Allow tools: Read(./src/**), Edit(./src/**), Bash(npm run lint), Bash(npm run test:*), WebFetch(domain:platform.openai.com), WebFetch(domain:github.com).
Deny tools: Bash(curl:*), Bash(wget:*), Bash(nc:*), Bash(diff *.env*).
Environment placeholders only: OPENAI_API_KEY=\${OPENAI_API_KEY}.
Output filtering: csp allowlist enabled.
`;
