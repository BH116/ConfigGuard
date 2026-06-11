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

describe('misinformation coverage: OWASP LLM09 (AGT-143..145)', () => {
  it('AGT-143 publish without fact verification', () => {
    fires(`# AGENTS.md
## Publishing
The agent may publish blog articles automatically without review or fact-check.`, 'AGENTS.md', 'AGT-143');
    fires(`# AGENTS.md
Generated content may be published without editorial review.
No editorial review is required for routine updates.`, 'AGENTS.md', 'AGT-143');
    silent(`# AGENTS.md
## Publishing
Every generated article must pass human editorial review and a fact verification step before it is published.`, 'AGENTS.md', 'AGT-143');
  });

  it('AGT-144 no grounding or citation requirement', () => {
    fires(`# AGENTS.md
## Answer policy
Citations are optional when answering customer questions.
The agent may answer from general knowledge when documents are unavailable.`, 'AGENTS.md', 'AGT-144');
    fires(`# AGENTS.md
Medical advice may be given from general knowledge when the corpus has no match.`, 'AGENTS.md', 'AGT-144');
    silent(`# AGENTS.md
## Answer policy
Every factual answer must cite a source from the approved corpus, and the agent must refuse when grounding fails.`, 'AGENTS.md', 'AGT-144');
  });

  it('AGT-145 confidence forcing / no uncertainty disclosure', () => {
    fires(`# AGENTS.md
## Tone
Never say I don't know.
Always provide an answer even if you are not certain.`, 'AGENTS.md', 'AGT-145');
    fires(`# AGENTS.md
Present your conclusions confidently even when evidence is incomplete.`, 'AGENTS.md', 'AGT-145');
    silent(`# AGENTS.md
## Tone
The agent should disclose uncertainty openly and may state that it does not know when confidence is low.`, 'AGENTS.md', 'AGT-145');
  });
});
