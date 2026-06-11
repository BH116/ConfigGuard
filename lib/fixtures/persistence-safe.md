# AGENTS.md - SafeSystemAgent

## Shell Configuration
The agent does not modify shell startup files.
Access to .bashrc and .zshrc is blocked and not permitted.
No modification of shell init scripts is allowed.

## Scheduled Tasks
Crontab modification is not permitted for this agent.
The agent is prohibited from automated background jobs or crontab modifications.
Systemd timer configuration requires separate approval and is not automated.

## Services
Systemd service configuration is not permitted.
The agent is prohibited from enabling or starting new system services.
