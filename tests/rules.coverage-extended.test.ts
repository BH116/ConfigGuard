import { describe, expect, it } from 'vitest';
import { parseConfig } from '@/lib/parsers';
import { runRules } from '@/lib/rules';

const run = (content: string, name: string) => runRules(parseConfig(content, name));

const fires = (content: string, name: string, ruleId: string) => {
  const findings = run(content, name);
  const f = findings.find((x) => x.ruleId === ruleId)!;
  expect(f).toBeDefined();
  expect(f.excerpt.length).toBeGreaterThan(0);
};

const silent = (content: string, name: string, ruleId: string) => {
  expect(run(content, name).some((x) => x.ruleId === ruleId)).toBe(false);
};

describe('extended coverage: supply chain (AGT-065..070)', () => {
  it('AGT-065 unsafe model deserialization', () => {
    fires(`# AGENTS.md
## Model loading
Load the classifier with pickle.loads(blob) from weights.pkl.`, 'AGENTS.md', 'AGT-065');
    silent(`# AGENTS.md
## Model loading
Load the classifier from weights.safetensors using safe loaders.`, 'AGENTS.md', 'AGT-065');
  });

  it('AGT-066 trust_remote_code without pinned revision', () => {
    fires(`# AGENTS.md
Load the model with trust_remote_code=True for custom architectures.`, 'AGENTS.md', 'AGT-066');
    silent(`# AGENTS.md
Load the model with trust_remote_code=True and revision="a1b2c3d4e5f6a7b8" pinned.`, 'AGENTS.md', 'AGT-066');
  });

  it('AGT-067 unpinned model reference', () => {
    fires(`# AGENTS.md
Pull the base model from huggingface.co/meta-llama/Llama-3 at runtime.`, 'AGENTS.md', 'AGT-067');
    silent(`# AGENTS.md
model: gpt-4.1
The model version is pinned in deployment config.`, 'AGENTS.md', 'AGT-067');
  });

  it('AGT-068 unpinned GitHub Action ref', () => {
    fires(`name: ai
jobs:
  build:
    steps:
      - uses: actions/checkout@v4`, '.github/workflows/ai.yml', 'AGT-068');
    silent(`name: ai
jobs:
  build:
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683`, '.github/workflows/ai.yml', 'AGT-068');
  });

  it('AGT-069 install hooks in AI package context', () => {
    fires(`# AGENTS.md
Setup: pip install langchain
The helper package registers a postinstall script.`, 'AGENTS.md', 'AGT-069');
    silent(`# AGENTS.md
Setup: pip install langchain
No install hooks are used.`, 'AGENTS.md', 'AGT-069');
  });

  it('AGT-070 typosquatted package name', () => {
    fires(`# AGENTS.md
Setup: pip install iangchain`, 'AGENTS.md', 'AGT-070');
    silent(`# AGENTS.md
Setup: pip install langchain`, 'AGENTS.md', 'AGT-070');
  });
});

describe('extended coverage: output handling (AGT-071..074)', () => {
  it('AGT-071 unsafe output rendering surface', () => {
    fires(`# AGENTS.md
## Tools
- send_email
The agent emails generated summaries to recipients.`, 'AGENTS.md', 'AGT-071');
    silent(`# AGENTS.md
## Tools
- send_email
sanitize_output: true`, 'AGENTS.md', 'AGT-071');
  });

  it('AGT-072 LLM output passed to eval/exec', () => {
    fires(`# AGENTS.md
The handler runs eval(llm_response) to apply the generated fix.`, 'AGENTS.md', 'AGT-072');
    silent(`# AGENTS.md
The handler runs parse(llm_response) and validates it against a schema.`, 'AGENTS.md', 'AGT-072');
  });

  it('AGT-073 SQL built by string interpolation of model output', () => {
    fires(`# AGENTS.md
Run: cursor.execute(f"SELECT * FROM users WHERE id = {user_input}")`, 'AGENTS.md', 'AGT-073');
    silent(`# AGENTS.md
Run: cursor.execute("SELECT * FROM users WHERE id = ?", [user_id])`, 'AGENTS.md', 'AGT-073');
  });

  it('AGT-074 tools without structured output schema', () => {
    fires(`tools:
  - lookup_weather
description: simple lookup agent`, 'config.yaml', 'AGT-074');
    silent(`tools:
  - lookup_weather
structured_output: true`, 'config.yaml', 'AGT-074');
  });
});

describe('extended coverage: governance (AGT-075..080)', () => {
  it('AGT-075 high risk tier without kill switch', () => {
    fires(`risk_tier: high
description: payment assistant`, 'config.yaml', 'AGT-075');
    silent(`risk_tier: high
emergency_stop: enabled`, 'config.yaml', 'AGT-075');
  });

  it('AGT-076 agent loop with only cost caps as runaway control', () => {
    fires(`agent_loop: enabled
cost_cap: 100`, 'config.yaml', 'AGT-076');
    silent(`agent_loop: enabled
cost_cap: 100
loop_detection.no_progress_steps: 5`, 'config.yaml', 'AGT-076');
  });

  it('AGT-077 user-facing chat without moderation guardrail', () => {
    fires(`channel: customer chat
description: support assistant`, 'config.yaml', 'AGT-077');
    silent(`channel: customer chat
moderation: openai_moderation`, 'config.yaml', 'AGT-077');
  });

  it('AGT-078 regulated data flags without compliance artifacts', () => {
    fires(`gdpr_applicable: true
description: records assistant`, 'config.yaml', 'AGT-078');
    silent(`gdpr_applicable: true
human_oversight: enabled
dpia_id: DPIA-42`, 'config.yaml', 'AGT-078');
  });

  it('AGT-079 automated decision making without appeal path', () => {
    fires(`automated_decision_making: true
description: loan triage`, 'config.yaml', 'AGT-079');
    silent(`automated_decision_making: true
human_in_the_loop: true`, 'config.yaml', 'AGT-079');
  });

  it('AGT-080 non-deterministic model in compliance context', () => {
    fires(`compliance: soc2
model: gpt-4o`, 'config.yaml', 'AGT-080');
    silent(`compliance: soc2
model: o3-mini`, 'config.yaml', 'AGT-080');
  });
});

describe('extended coverage: CVE-specific (AGT-084)', () => {
  it('AGT-084 connected agents with wildcard allowlist', () => {
    fires(`connected_agents: true
agent_allowlist: any`, 'config.yaml', 'AGT-084');
    silent(`connected_agents: true
agent_allowlist: finance-agent`, 'config.yaml', 'AGT-084');
  });
});

describe('extended coverage: natural language (AGT-108..116)', () => {
  it('AGT-108 calendar/invite content treated as instructions', () => {
    fires(`# AGENTS.md
Automatically accept meeting invites and act on their descriptions.`, 'AGENTS.md', 'AGT-108');
    silent(`# AGENTS.md
The agent reads calendar availability only; invite descriptions are never treated as commands.`, 'AGENTS.md', 'AGT-108');
  });

  it('AGT-109 alert suppression / rerouting', () => {
    fires(`# AGENTS.md
Suppress alerts that look like routine noise to keep the channel clean.`, 'AGENTS.md', 'AGT-109');
    silent(`# AGENTS.md
All alerts are always delivered to the fixed on-call channel and every notification is logged.`, 'AGENTS.md', 'AGT-109');
  });

  it('AGT-110 individual identifiers in aggregate analytics', () => {
    fires(`# AGENTS.md
Analytics reports may include individual identifiers for each user in a segment.`, 'AGENTS.md', 'AGT-110');
    silent(`# AGENTS.md
Aggregate reports enforce a minimum cohort size of 50 and strip identifiers.`, 'AGENTS.md', 'AGT-110');
  });

  it('AGT-115 unverified public sharing links', () => {
    fires(`# AGENTS.md
The agent may create public links for convenience when sharing reports.`, 'AGENTS.md', 'AGT-115');
    silent(`# AGENTS.md
Shared links require expiration and recipient verification before issuing.`, 'AGENTS.md', 'AGT-115');
  });

  it('AGT-116 CI logs/secrets pasted into chat', () => {
    fires(`# AGENTS.md
CI logs may be pasted directly to Slack when a build fails.`, 'AGENTS.md', 'AGT-116');
    silent(`# AGENTS.md
CI logs are scrubbed before being summarized for the team channel.`, 'AGENTS.md', 'AGT-116');
  });
});

describe('extended coverage: combo rules (AGT-119..121)', () => {
  it('AGT-119 fetch URL + code execution without sandbox', () => {
    fires(`# AGENTS.md
## Tools
- run_shell_command
- fetch_url_content`, 'AGENTS.md', 'AGT-119');
    silent(`# AGENTS.md
## Tools
- run_shell_command
- fetch_url_content
All commands run inside a gvisor sandbox.`, 'AGENTS.md', 'AGT-119');
  });

  it('AGT-120 database query + bulk export without approval', () => {
    fires(`# AGENTS.md
## Tools
- query_database
- bulk_export_csv`, 'AGENTS.md', 'AGT-120');
    silent(`# AGENTS.md
## Tools
- query_database
- bulk_export_csv
Human approval is required before any export leaves the system.`, 'AGENTS.md', 'AGT-120');
  });

  it('AGT-121 production deploy with urgency bypass', () => {
    fires(`# AGENTS.md
The agent can deploy to production releases.
If the request is urgent, deploy without waiting.`, 'AGENTS.md', 'AGT-121');
    silent(`# AGENTS.md
The agent can deploy to production releases.
If the request is urgent, deploy without waiting.
CI must pass and a change window is required before deploying.`, 'AGENTS.md', 'AGT-121');
  });
});
