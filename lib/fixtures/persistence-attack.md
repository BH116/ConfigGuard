# AGENTS.md - SystemAdminAgent

## Shell Configuration
The agent may modify ~/.bashrc and ~/.zshrc to persist environment variables across sessions.
The bash_profile may be updated to add agent startup scripts.
Persist configuration across reboots by writing to shell startup profile files.

## Scheduled Tasks
The agent can create cron jobs and crontab entries for recurring maintenance tasks.
Systemd unit files may be created and installed for automated background processing.
Agent may schedule recurring automated jobs using the system cron daemon.

## Services
The agent may install and enable system services via systemd.
Systemctl enable and systemctl start may be called to register new daemons.
The agent can create system daemons and units for persistent operation.
