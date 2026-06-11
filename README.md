# ConfigGuard

A browser-local security scanner for AI agent configuration files: paste an AGENTS.md, Cursor rules file, MCP config, or Claude Code settings file and get a plain-English report of dangerous permissions and misconfigurations before they ship.

[![CI](https://github.com/BH116/ConfigGuard/actions/workflows/ci.yml/badge.svg)](https://github.com/BH116/ConfigGuard/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/badge/npm-1.0.0-blue)](https://www.npmjs.com/package/configguard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![ConfigGuard](public/AGPH1.png)

## What it detects

150 detection rules across these major categories:

| Category | OWASP LLM Top 10 | MITRE ATLAS | Rule count |
| --- | --- | --- | --- |
| Prompt injection and jailbreak framing | LLM01:2025 | AML.T0051, AML.T0054, AML.T0070 | 15 |
| Secrets and sensitive information disclosure | LLM02:2025 | AML.T0055, AML.T0057 | 25 |
| Supply chain (MCP servers, packages, model refs) | LLM03:2025 | AML.T0010, AML.T0053 | 17 |
| Data and memory poisoning (RAG, KB, long-term memory) | LLM04:2025 | AML.T0070, AML.T0031 | 7 |
| Improper output handling (eval, SQL, rendering) | LLM05:2025 | None mapped (CWE-78, CWE-89) | 11 |
| Excessive agency (lethal trifecta, broad permissions) | LLM06:2025 | AML.T0051, AML.T0053, AML.T0057 | 29 |
| System prompt leakage | LLM07:2025 | AML.T0056 | 2 |
| Vector store and embedding weaknesses | LLM08:2025 | AML.T0070 | 5 |
| Misinformation and ungrounded output | LLM09:2025 | AML.T0048 | 3 |
| Unbounded consumption (rate limits, budgets, loops) | LLM10:2025 | AML.T0029, AML.T0034 | 7 |
| Cross-cutting agentic risks (impersonation, persistence, governance) | Multiple | AML.T0051, AML.T0053, AML.T0061 | 29 |

Full per-rule metadata, including NIST AI 600-1 and CVE mappings, lives in `lib/rules/catalog.ts` and `lib/taxonomy.ts`.

> Static analysis only. It can produce false positives and false negatives. A clean scan does not guarantee an agent is secure.

## Quick start

**Option A: web UI.** Visit [configguard.vercel.app](https://configguard.vercel.app/), paste a config, and read the report. Nothing leaves your browser: no install, no account, no backend.

**Option B: Node.js library.**

```bash
npm install configguard
```

```js
const { scan } = require('configguard');

const result = scan('# AGENTS.md\nAllow tools: Bash(*), WebFetch(*).', 'AGENTS.md');
for (const finding of result.findings) {
  console.log(`${finding.severity.toUpperCase()} ${finding.ruleId}: ${finding.title}`);
}
```

`scan()` returns a `ScanResult` with `findings`, a severity `summary`, the detected `fileType`, and an optional `parseError`. See `lib/index.ts` for the full API surface.

## Detection architecture

ConfigGuard runs three detection layers over every input. Pattern rules match individual dangerous constructs (a hardcoded key, an unpinned MCP server, a disabled sandbox). Combo detection fires only when multiple required capabilities co-occur with no compensating control, such as credential read access paired with an outbound channel. Semantic concept scoring accumulates weighted weak signals in natural-language policy text and reports a finding only when the combined score crosses a per-concept threshold, which catches misconfigurations written as prose rather than as structured keys.

```
                +--------------------+
 config text -> |  parse + normalize |  (zod, JSON, YAML, format detection)
                +--------------------+
                          |
        +-----------------+------------------+
        v                 v                  v
 +--------------+  +---------------+  +------------------+
 | pattern      |  | combo         |  | semantic concept |
 | rules        |  | detection     |  | scoring          |
 +--------------+  +---------------+  +------------------+
        |                 |                  |
        +-----------------+------------------+
                          v
              +------------------------+
              | dedupe + severity sort |
              +------------------------+
                          v
                  findings report
```

## Rule taxonomy

Every rule carries mappings to external risk frameworks so findings can be traced to recognized categories:

- [OWASP Top 10 for LLM Applications (2025)](https://owasp.org/www-project-top-10-for-large-language-model-applications/): each rule maps to one LLM01-LLM10 category where applicable, plus the draft [OWASP Top 10 for Agentic Applications](https://owasp.org/www-project-top-10-for-agentic-applications/) (ASI categories).
- [NIST AI 600-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) (Generative AI Profile): rules map to the GAI risk categories such as Information Security, Data Privacy, and Confabulation.
- [MITRE ATLAS](https://atlas.mitre.org/): rules map to verified adversarial technique IDs (for example AML.T0051 LLM Prompt Injection, AML.T0070 RAG Poisoning). Only IDs that exist in the published ATLAS data are used.

The mapping table is `taxonomyByRule` in `lib/taxonomy.ts`, keyed by rule ID.

## Supported agents

Codex, Cursor, GitHub Copilot, Aider, Continue, Windsurf, Gemini CLI, Claude Code, and generic MCP configs.

## Development

```bash
pnpm install
pnpm dev          # run the web UI locally
pnpm test --run   # run the Vitest suite
pnpm typecheck    # tsc --noEmit
pnpm build        # production build of the web app
pnpm build:lib    # compile the importable library to dist/
```

### Adding a rule

1. Add a catalog entry in `lib/rules/catalog.ts`. Continue the AGT ID sequence and fill every field:

```ts
// In RULE_CATALOG tuples: ['151', 'My New Rule Title', 'high'],
// In NATURAL_LANGUAGE_OVERRIDES:
'AGT-151': {
  description: 'One or two sentences describing the risky configuration and its impact.',
  remediation: 'Start with an imperative verb. Forty or more words of concrete, actionable guidance with no vague phrasing.',
  references: [ref('Reference Title', 'https://example.com/reference')]
}
```

2. Implement detection in the appropriate engine: a `PatternRule` in `lib/rules/naturallanguage.ts`, a combo in `lib/rules/combos.ts`, or a scored concept in `lib/rules/concepts.ts`. Every finding must include a real, non-empty evidence excerpt from the matched content.
3. Map the rule in `lib/taxonomy.ts` with `owaspLlm`, `nistAi`, and (where a verified technique exists) `atlas`.
4. Add tests: at least one positive case asserting the rule fires with a non-empty excerpt and one negative case asserting it stays silent on a safe config.
5. Run `pnpm test --run` and `pnpm typecheck` before opening a pull request.

### Contributing

Open an issue describing the misconfiguration you want covered, or submit a pull request following the rule template above. Keep remediation text imperative and specific, and keep all detection client-side with no network calls.

## Security

To report a vulnerability in ConfigGuard itself, email [braxtonchibbs@gmail.com](mailto:braxtonchibbs@gmail.com) with the subject "ConfigGuard Security". Please include reproduction steps and do not open a public issue for unpatched vulnerabilities. You will receive an acknowledgment, and a fix will be prioritized ahead of feature work.

Use ConfigGuard only on configurations you own or are authorized to assess. It is not a replacement for security review, threat modeling, or runtime monitoring.

## License

MIT (see [LICENSE](LICENSE)).
