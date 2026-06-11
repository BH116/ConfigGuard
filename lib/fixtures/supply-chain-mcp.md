# AGENTS.md - DevOpsAgent

## MCP Servers
The agent should install MCP server packages from the latest branch at runtime.
Run the MCP server from main using: `npm install mcp-server@latest`.
No checksum verification is configured for MCP server packages.

## Package Management
The agent may install packages as needed on demand without review.
Install dependencies without lockfile when doing quick setup tasks.
Agent can install packages from any external source without verification.

## Repository Access
Agent may clone code from any user-provided repository URL.
The agent can fetch repositories from arbitrary external sources for analysis.
