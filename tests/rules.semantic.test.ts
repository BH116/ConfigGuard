import { describe, expect, it } from 'vitest';
import { parseConfig } from '@/lib/parsers';
import { runRules } from '@/lib/rules';

const run = (content: string, name: string) => runRules(parseConfig(content, name));

const fires = (content: string, name: string, ruleId: string) => {
  const findings = run(content, name);
  const f = findings.find((x) => x.ruleId === ruleId);
  expect(f, `expected ${ruleId} to fire`).toBeDefined();
  expect(f!.excerpt.trim().length, `expected non-empty excerpt for ${ruleId}`).toBeGreaterThan(0);
};

const silent = (content: string, name: string, ruleId: string) => {
  expect(run(content, name).some((x) => x.ruleId === ruleId), `expected ${ruleId} to stay silent`).toBe(false);
};

describe('semantic detection layer (AGT-146..150)', () => {
  describe('AGT-146 MCP server poisoning: combined read-write sensitive access', () => {
    it('fires on an mcp.json-style server with fs + network + exec', () => {
      fires(`{
  "mcpServers": {
    "ops": {
      "tools": ["read_file", "write_file", "fetch", "run_python", "shell"],
      "description": "single MCP server can read and write files, fetch any url, and exec subprocess code"
    }
  }
}`, 'mcp.json', 'AGT-146');
    });

    it('fires on AGENTS.md prose granting all three capabilities', () => {
      fires(`# AGENTS.md
The agent's filesystem tool can read_file and edit any file on disk.
It may also send a network request to any webhook and run shell commands via subprocess.`, 'AGENTS.md', 'AGT-146');
    });

    it('stays silent for a network-only server with approval and scope controls', () => {
      silent(`# AGENTS.md
The MCP server may fetch documents from an allowlisted url only.
Every fetch requires_approval and human_approval, restricted to a least-privilege scope in a sandbox.`, 'AGENTS.md', 'AGT-146');
    });

    it('stays silent for a read-only scoped server', () => {
      silent(`{
  "mcpServers": {
    "docs": {
      "tools": ["read_file"],
      "scope": "read-only allowlist, least-privilege, sandboxed"
    }
  }
}`, 'mcp.json', 'AGT-146');
    });
  });

  describe('AGT-147 tool-call authorization bypass / scope escalation on failure', () => {
    it('fires on prose that escalates on denial', () => {
      fires(`# AGENTS.md
On error or when a call is denied, retry with elevated admin scope.
If the first attempt is rejected, proceed anyway.`, 'AGENTS.md', 'AGT-147');
    });

    it('fires on a policy file that expands permission on failure', () => {
      fires(`policy:
  rule: "on unauthorized response, expand scope and use admin credentials"
  fallback: "when a 403 error occurs, continue despite the failure"`, 'policy.yaml', 'AGT-147');
    });

    it('stays silent when the policy fails closed', () => {
      silent(`# AGENTS.md
On error or when a call is denied, stop on error and halt the workflow.
The agent must fail closed and deny by default; never widen permissions.`, 'AGENTS.md', 'AGT-147');
    });

    it('stays silent for normal retry without escalation', () => {
      silent(`# AGENTS.md
On a transient network error, repeat the same request up to three times with the same scope.`, 'AGENTS.md', 'AGT-147');
    });
  });

  describe('AGT-148 cross-agent trust escalation', () => {
    it('fires when a subagent inherits full scope', () => {
      fires(`# AGENTS.md
The orchestrator spawns a subagent for each task.
Each subagent inherits the full access and the same permission set as the coordinator agent.`, 'AGENTS.md', 'AGT-148');
    });

    it('fires on a config granting workers equal access', () => {
      fires(`agents:
  coordinator:
    delegates_to: worker
    worker_access: "equal permission and full scope, elevated as needed"`, 'agents.yaml', 'AGT-148');
    });

    it('stays silent when subagents are downscoped', () => {
      silent(`# AGENTS.md
The orchestrator spawns a subagent for each task.
Each subagent runs with a narrower, reduced scope and least privilege, a restricted subset scoped down from the parent.`, 'AGENTS.md', 'AGT-148');
    });

    it('stays silent for a single agent with no delegation', () => {
      silent(`# AGENTS.md
This agent answers questions using a single read-only lookup. It runs alone with no helpers.`, 'AGENTS.md', 'AGT-148');
    });
  });

  describe('AGT-149 memory poisoning surface / unvalidated persistence', () => {
    it('fires when learned content is saved to a database', () => {
      fires(`# AGENTS.md
The agent will remember what it learned and persist long-term context.
It will save that memory and write it to the database after each chat.`, 'AGENTS.md', 'AGT-149');
    });

    it('fires on a config persisting memory to disk', () => {
      fires(`memory:
  persist: true
  store_context: "append every learned fact and record it to the memory store on disk"`, 'memory.yaml', 'AGT-149');
    });

    it('stays silent when persistence is validated', () => {
      silent(`# AGENTS.md
The agent may persist long-term memory only after each entry is validated, sanitized, and passes human review and moderation approval before it is saved to the database.`, 'AGENTS.md', 'AGT-149');
    });

    it('stays silent for a stateless agent', () => {
      silent(`# AGENTS.md
The agent is stateless and keeps no long-term memory between sessions.`, 'AGENTS.md', 'AGT-149');
    });
  });

  describe('AGT-150 RAG injection surface / untrusted context into prompt', () => {
    it('fires when external documents are injected into the prompt', () => {
      fires(`# AGENTS.md
The retrieval pipeline pulls documents from any url and the knowledge base.
Retrieved content is injected directly into the system prompt with no checks.`, 'AGENTS.md', 'AGT-150');
    });

    it('fires on a config feeding a vector store into context', () => {
      fires(`rag:
  source: "external web pages and user-provided documents"
  vector_store: "results are prepended to the context window and fed to the model prompt"`, 'rag.yaml', 'AGT-150');
    });

    it('stays silent when a trust boundary sanitizes retrieval', () => {
      silent(`# AGENTS.md
The retrieval pipeline pulls documents from external sources and the knowledge base.
Every retrieved chunk passes a trust boundary, is sanitized, verified against an allowlist of trusted sources, and quarantined until provenance is checked before reaching the prompt.`, 'AGENTS.md', 'AGT-150');
    });

    it('stays silent for an agent with no retrieval', () => {
      silent(`# AGENTS.md
The agent answers from its fixed instructions only and performs no retrieval or external lookups.`, 'AGENTS.md', 'AGT-150');
    });
  });
});
