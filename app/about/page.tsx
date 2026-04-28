const links = [
  ['OWASP LLM Top 10 v2025','https://genai.owasp.org/'],
  ['OWASP Top 10 for Agentic Applications 2026','https://owasp.org/www-project-top-10-for-agentic-applications/'],
  ["Simon Willison's lethal trifecta (Jun 16, 2025)",'https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/'],
  ['Meta/OpenAI Agents Rule of Two (Nov 2025)','https://openai.com'],
  ['CVE-2025-6514','https://nvd.nist.gov/vuln/detail/CVE-2025-6514'],
  ['CVE-2025-54135','https://nvd.nist.gov/vuln/detail/CVE-2025-54135'],
  ['CVE-2025-54136','https://nvd.nist.gov/vuln/detail/CVE-2025-54136']
];
export default function About() { return <main className="mx-auto max-w-3xl space-y-4 p-6"><h1 className="text-3xl font-bold">About AgentGuard</h1><p>Taxonomy attribution and responsible use references.</p><ul className="list-disc pl-6">{links.map(([label,url])=><li key={url}><a className="underline" href={url}>{label}</a></li>)}</ul></main>; }
