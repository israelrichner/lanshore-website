import { SITE_URL, CONTACT, GARTNER_2019 } from "@/lib/site";
import { PILLARS } from "@/lib/pillars";
import { SPM_PLATFORMS } from "@/lib/spmPlatforms";
import { INDUSTRIES } from "@/lib/industries";
import { GLOSSARY } from "@/lib/glossary";
import { HOME_FAQ } from "@/lib/homeFaq";
import { SOLUTIONS } from "@/lib/solutions";
import { GUIDES, postPath } from "@/lib/blog";
import type { FaqItem } from "@/lib/schema";

export const dynamic = "force-static";

function faqBlock(items: FaqItem[]) {
  return items.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n");
}

/* llms-full.txt — the fuller companion to llms.txt per llmstxt.org: the
   site's substantive text inlined into a single document so an answer engine
   can ingest the full corpus in one fetch, instead of following every link in
   llms.txt. Composed entirely from the same lib/* sources the pages render,
   so it can never drift from them. */
export function GET() {
  const pillars = PILLARS.map(
    (p) => `### ${p.name} (${SITE_URL}${p.path})

${p.firstSentence}

${p.solutionStatement}

${faqBlock(p.faq)}`
  ).join("\n\n");

  const platforms = SPM_PLATFORMS.map(
    (p) => `### ${p.name} (${SITE_URL}/spm/${p.slug})

${p.firstSentence}

${p.positioning}`
  ).join("\n\n");

  const solutions = SOLUTIONS.map(
    (s) => `### ${s.name} (${SITE_URL}/solutions/${s.slug})

${s.firstSentence}

${s.whoItIsFor}

${faqBlock(s.faq)}`
  ).join("\n\n");

  const guides = GUIDES.map(
    (g) => `- [${g.title}](${SITE_URL}${postPath(g)}): ${g.description}`
  ).join("\n");

  const industries = INDUSTRIES.map(
    (i) => `### ${i.name} (${SITE_URL}/industries/${i.slug})

${i.firstSentence}

${i.complexity}`
  ).join("\n\n");

  const glossary = GLOSSARY.map((g) => `**${g.term}**: ${g.definition}`).join("\n\n");

  const body = `# Lanshore: Full Reference

> Lanshore is a sales performance management (SPM) consultancy delivering AI Assisted SPM: AI agents, executive dashboards, and custom apps for incentive compensation operations. 15+ years of SPM delivery converged with agentic AI. Office in Katy, Texas (US), with US and Latin America delivery.

Contact: ${CONTACT.email} · ${CONTACT.phone} · ${CONTACT.address}

## AI Assisted SPM (flagship, three pillars)

${pillars}

## Frequently asked questions (site-wide)

${faqBlock(HOME_FAQ)}

## SPM Platforms

${platforms}

## Solutions

${solutions}

## Guides

${guides}

## Industries

${industries}

## SPM Glossary

${glossary}

## Analyst recognition

${GARTNER_2019.claims.standard}

---

${GARTNER_2019.disclaimer}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
