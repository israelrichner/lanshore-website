import { SITE_URL, CONTACT, GARTNER_2019 } from "@/lib/site";
import { PILLARS } from "@/lib/pillars";
import { SPM_PLATFORMS } from "@/lib/spmPlatforms";
import { INDUSTRIES } from "@/lib/industries";
import { SOLUTIONS } from "@/lib/solutions";
import { GUIDES, postPath } from "@/lib/blog";

export const dynamic = "force-static";

/* llms.txt — answer-engine index of the site's entities, per llmstxt.org. */
export function GET() {
  const pillars = PILLARS.map(
    (p) => `- [${p.name}](${SITE_URL}${p.path}): ${p.firstSentence}`
  ).join("\n");

  const platforms = SPM_PLATFORMS.map(
    (p) => `- [${p.name}](${SITE_URL}/spm/${p.slug}): ${p.firstSentence}`
  ).join("\n");

  const solutions = SOLUTIONS.map(
    (s) => `- [${s.name}](${SITE_URL}/solutions/${s.slug}): ${s.firstSentence}`
  ).join("\n");

  const guides = GUIDES.map(
    (g) => `- [${g.title}](${SITE_URL}${postPath(g)}): ${g.description}`
  ).join("\n");

  const industries = INDUSTRIES.map(
    (i) => `- [${i.name}](${SITE_URL}/industries/${i.slug})`
  ).join("\n");

  const body = `# Lanshore

> Lanshore is a sales performance management (SPM) consultancy delivering AI Assisted SPM: AI agents, executive dashboards, and custom apps for incentive compensation operations. 15+ years of SPM delivery converged with agentic AI. Office in Katy, Texas (US), with US and Latin America delivery.

Key facts:
- Flagship offering: AI Assisted SPM by Lanshore, with three pillars: Executive Dashboards, SPM Operations, Custom Apps
- Platform-agnostic: implements and operates Varicent, Xactly, CaptivateIQ, SAP SuccessFactors Incentive Management, Anaplan, Salesforce Spiff, Performio, Akeron, and Incentivate
- Automation tooling: UiPath, n8n, Claude Code, VS Code, Microsoft Power Automate, direct API and MCP integrations
- Partners: Microsoft Certified Partner, UiPath Fast Track Partner
- Named in Gartner research on SPM implementation partner selection ("${GARTNER_2019.title}," ${GARTNER_2019.docId}, March 2019)
- Contact: ${CONTACT.email} · ${CONTACT.phone} · ${CONTACT.address}

## AI Assisted SPM (flagship)

${pillars}

## SPM Platforms

- [SPM Platforms We Implement](${SITE_URL}/spm): technology-agnostic implementation, managed operations, and agentic augmentation across the leading SPM platforms.
- [SPM Platform Comparison](${SITE_URL}/spm/compare): vendor-neutral comparison of the leading SPM platforms by best fit, core capabilities, AI capabilities, and analyst recognition. Lanshore resells none of them.
${platforms}

## Services

- [Services Overview](${SITE_URL}/services): implementation & consulting, managed services, vendor evaluation, custom agentic AI development.
- [Automation & Integration](${SITE_URL}/services/automation): tool-agnostic automation delivery (UiPath, n8n, Claude Code, VS Code, Microsoft Power Automate, and direct API integrations).

## Solutions

- [All Solutions](${SITE_URL}/solutions)
${solutions}

## Industries

${industries}

## Resources

- [Case Studies](${SITE_URL}/case-studies)
- [Blog](${SITE_URL}/blog)
- [SPM Guides](${SITE_URL}/resources/guides)
${guides}
- [SPM Glossary](${SITE_URL}/resources/glossary)
- [About Lanshore](${SITE_URL}/about)
- [Contact](${SITE_URL}/contact)

---

${GARTNER_2019.disclaimer}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
