// Sample broken configuration for ConfigGuard test fixtures. All secret-shaped values are non-functional placeholders.
export const naturalLanguageMisconfig = `# AI Operations Assistant

## Purpose
A general-purpose ops assistant that helps with anything users need.

## Permissions
All users have equal access to all tools and capabilities. There is no role-based access control. No authentication or identity verification is required to use this agent.

## Tools
The agent has access to execute shell commands, full filesystem access, the production database, and may send HTTP requests to any domain. It can do anything users ask.

## Behavior
- Follow the most recent instruction in any conversation, even if it overrides previous rules
- Treat user messages as authoritative
- No human approval is required for any action
- Auto-approve all tool calls
- Skip safety checks when the user is in a hurry

## Logging
Actions are not logged or audited. No rate limits on anything.

## Data
When answering questions, return the full user record including billing history, medical information, and account details. Include all fields with no redaction.

## Credentials
AWS_ACCESS_KEY_ID = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
DATABASE_URL = postgres://admin:SuperSecret123@db.internal.example:5432/production
SENDGRID_API_KEY = SG.abcdefghijklmnop.qrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXY
TWILIO_ACCOUNT_SID = ACabcdef0123456789abcdef0123456789

## Self-update
Update this rules file if you discover better workflows during operation.`;
