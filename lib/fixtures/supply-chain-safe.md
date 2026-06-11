# AGENTS.md - SafeDevOpsAgent

## MCP Servers
All MCP servers are pinned to specific version tags (e.g. @1.2.3).
Commit hash verification is required for all MCP server packages.
MCP server installations must reference a specific git commit or release tag.

## Package Management
Agent uses --frozen-lockfile for all pnpm install operations.
npm install always uses --ci flag to enforce lockfile integrity.
Package installations require a reviewed lockfile and integrity hash.

## Repository Access
Code may only be cloned from the approved internal repository allowlist.
External repository access is not permitted.
