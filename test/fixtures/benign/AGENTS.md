# AGENTS.md

## Scope
This agent operates only within ./src and ./tests for this repository. No
other directories are accessible.

## Permissions
permissions: ["read_code", "write_tests", "run_lint"]
deny: [".env", ".aws", ".ssh", "*.pem", "id_rsa", "secrets"]

## Network
No outbound network access is configured for this agent. All operations stay
local to the repository checkout.

## Limits
rate_limit: 60
token_budget: 8000
tool_timeout_sec: 30
max_iterations: 10

## Output
sanitize_output: true
disable_image_autoload: true

## Oversight
requires_approval: true for any destructive action, including deletes,
deploys, and schema changes.
