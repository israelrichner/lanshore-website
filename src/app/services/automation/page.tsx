import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Workflow, Code2, Plug, Cpu, CheckCircle2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import CtaBand from "@/components/CtaBand";
import FaqSection from "@/components/FaqSection";
import { breadcrumbSchema, faqSchema, serviceSchema, type FaqItem } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Automation & Integration Services | Lanshore",
  description:
    "Tool-agnostic automation delivery on whatever tools your team prefers: UiPath and Power Automate RPA, n8n workflow orchestration, agentic development with Claude Code and VS Code, and direct API integrations.",
  alternates: { canonical: "/services/automation" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "Automation & Integration Services | Lanshore",
    description:
      "Tool-agnostic automation delivery: RPA, workflow orchestration, agentic AI development, and direct API integrations.",
    url: "/services/automation",
    type: "website",
  },
};

const TOOLING = [
  {
    icon: Bot,
    name: "UiPath",
    body: "Enterprise RPA from a UiPath Fast Track Partner: process assessment, bot development, deployment, and hypercare, backed by 15+ years of automation delivery.",
  },
  {
    icon: Workflow,
    name: "n8n",
    body: "Self-hostable workflow orchestration for teams that want open, inspectable automations connecting SaaS tools, databases, and AI models.",
  },
  {
    icon: Code2,
    name: "Claude Code & VS Code",
    body: "Agentic development: AI coding agents that build, test, and maintain automations and integrations, supervised by senior Lanshore engineers.",
  },
  {
    icon: Cpu,
    name: "Microsoft Power Automate",
    body: "Microsoft-stack automation from a Microsoft Certified Partner, with flows that live where your organization already works: Teams, SharePoint, Dynamics, Excel.",
  },
  {
    icon: Plug,
    name: "Direct API & MCP integrations",
    body: "When a platform exposes an API or MCP server, we integrate it directly: no middleware tax, no batch exports, real-time data for your agents.",
  },
];

const ROADMAP = [
  {
    step: "01",
    title: "RPA: automate the repetitive",
    body: "Deterministic bots for structured, rules-based work: invoice processing, claims, commission reconciliation. Fast ROI, proven tooling.",
  },
  {
    step: "02",
    title: "Orchestration: connect the stack",
    body: "Workflows that move data across CRM, ERP, SPM, and finance systems reliably: the integration layer most automation programs are missing.",
  },
  {
    step: "03",
    title: "Agentic AI: automate the judgment calls",
    body: "AI agents that handle variation, reason over unstructured data, and escalate when unsure, with human-in-the-loop controls on high-stakes decisions.",
  },
];

const AUTOMATION_FAQ: FaqItem[] = [
  {
    question: "Which automation tools does Lanshore work with?",
    answer:
      "All the major ones: UiPath and Microsoft Power Automate for RPA, n8n for workflow orchestration, Claude Code and VS Code for agentic development, plus direct API and MCP integrations. We're tool-agnostic: we build on the stack your team prefers and already trusts.",
  },
  {
    question: "What's the difference between RPA and agentic AI?",
    answer:
      "RPA replays fixed steps and excels at structured, rules-based work but breaks when screens or formats change. Agentic AI works toward an outcome, handles variation, reasons over unstructured data, and escalates when unsure. We've delivered automation for 15+ years (RPA since its earliest enterprise wave, agentic AI as the technology matured) and use each where it fits, often together.",
  },
  {
    question: "We have an existing UiPath estate. Can Lanshore take it over?",
    answer:
      "Yes. We provide RPA support and managed services for existing bot estates (stabilizing, documenting, and extending them), and we can chart the roadmap from RPA to agentic automation when you're ready.",
  },
  {
    question: "Do we need to buy new software to start?",
    answer:
      "Usually not. Most engagements start with an automation assessment of your current stack. If you already own UiPath, Power Automate, or an iPaaS, we build there; if a gap needs filling, we recommend the lightest tool that closes it.",
  },
];

export default function AutomationServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Automation & Integration", href: "/services/automation" },
        ])}
      />
      <JsonLd
        data={serviceSchema(
          "Automation & Integration",
          "Tool-agnostic automation delivery: RPA with UiPath and Power Automate, workflow orchestration with n8n, agentic development with Claude Code and VS Code, and direct API integrations.",
          "/services/automation"
        )}
      />
      <JsonLd data={faqSchema(AUTOMATION_FAQ)} />

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Services
          </p>
          <h1 className="text-4xl font-black sm:text-5xl">
            Automation &amp; Integration
          </h1>
          {/* Direct answer paragraph for answer-engine extraction */}
          <p className="mt-6 text-lg text-white/75">
            Lanshore delivers automation on whatever tools your team prefers (UiPath,
            n8n, Claude Code, VS Code, Microsoft Power Automate, or direct API and MCP
            integrations), from RPA bots to fully agentic AI workflows. We do it all, on
            your stack, with 15+ years of enterprise delivery behind it.
          </p>
        </div>
      </section>

      {/* Tooling breadth */}
      <section className="container-site py-16">
        <h2 className="mb-2 text-2xl font-black text-ink sm:text-3xl">
          Your stack, our delivery
        </h2>
        <p className="mb-10 max-w-2xl text-muted">
          Tool religion is expensive. We hold certifications and delivery experience
          across the automation landscape so the tool choice can follow your
          requirements, not the other way around.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLING.map(({ icon: Icon, name, body }) => (
            <div
              key={name}
              className="rounded-lg border border-line p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-light">
                <Icon className="h-6 w-6 text-button" />
              </div>
              <h3 className="mb-2 font-black text-ink">{name}</h3>
              <p className="text-sm leading-relaxed text-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RPA → agentic roadmap */}
      <section className="bg-paper">
        <div className="container-site py-16">
          <h2 className="mb-2 text-2xl font-black text-ink sm:text-3xl">
            From RPA to agentic AI: one roadmap
          </h2>
          <p className="mb-10 max-w-2xl text-muted">
            Most automation programs stall between the pilot and the payoff. We sequence
            the journey so each stage funds the next.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {ROADMAP.map((phase) => (
              <div
                key={phase.step}
                className="relative overflow-hidden rounded-lg border border-line bg-white p-6 shadow-card"
              >
                <div className="absolute left-0 right-0 top-0 h-1 bg-button" />
                <span
                  className="select-none text-4xl font-black leading-none text-gold/35"
                  aria-hidden
                >
                  {phase.step}
                </span>
                <h3 className="mt-3 text-lg font-black text-button">{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{phase.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery model */}
      <section className="container-site py-16">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-black text-ink sm:text-3xl">
              How an engagement runs
            </h2>
            <ul className="space-y-3">
              {[
                "Process assessment: automation candidates ranked by ROI and feasibility, documented as a roadmap",
                "Design agreed with your team before a line of code is written",
                "Build by certified developers and supervised AI coding agents, with full documentation",
                "Managed deployment, cutover planning, and hypercare",
                "Training so your team can operate and extend what we deliver",
                "Post-go-live support and the next wave of opportunities",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-button" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-teal-light p-6 sm:p-8">
            <h2 className="text-xl font-black text-ink">Where this meets SPM</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              Automation and integration are the plumbing under{" "}
              <Link
                href="/agentic-spm/operations"
                className="font-semibold text-accent hover:text-accent-hover"
              >
                AI Assisted SPM by Lanshore
              </Link>
              : comp data moving between your SPM platform, CRM, and finance systems, and
              agents running the cycle on top. If your automation problem is
              commission-shaped, start with an{" "}
              <Link
                href="/contact"
                className="font-semibold text-accent hover:text-accent-hover"
              >
                SPM assessment
              </Link>
              .
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground">
              Not SPM? We automate invoice processing, claims, enrollment, reporting, and
              back-office workflows across{" "}
              <Link
                href="/industries"
                className="font-semibold text-accent hover:text-accent-hover"
              >
                six industries
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <FaqSection items={AUTOMATION_FAQ} heading="Automation & Integration: FAQ" />

      <CtaBand
        heading="Get an Automation Assessment"
        body="A 30-minute call. We look at your processes, your tooling, and where automation pays back first."
        ctaLabel="Get an Automation Assessment"
      />
    </>
  );
}
