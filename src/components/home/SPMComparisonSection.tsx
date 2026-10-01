import { XCircle, CheckCircle2 } from "lucide-react";

const SPM_PROBLEMS = [
  "Poor ROI from your SPM investment",
  "Missed opportunities by not capitalizing on full SPM capabilities",
  "Lack of streamlining in the commission process",
  "Lack of customization for your organization",
  "Manual, error-prone dispute resolution",
  "Falling behind on new technology trends",
];

const SPM_SOLUTIONS = [
  "Measurably increased ROI",
  "Full SPM capability activation with expert configuration",
  "Automated processes that eliminate manual labor",
  "Customized solutions built around your org's workflows",
  "Robust commission payment workflows automating dispute resolution",
  "Agentic AI that delivers cost savings, productivity, and eliminates financial leakage",
];

const AI_PROBLEMS = [
  "Missing ROI by not capitalizing on intelligent automation capabilities",
  "Unable to process unstructured data in legacy workflows",
  "Struggling to scale your automation program beyond pilot",
  "Decisions limited by manual, slow data analysis",
];

const AI_SOLUTIONS = [
  "Full process automation that unlocks ROI beyond simple task automation",
  "AI integration that handles unstructured data seamlessly",
  "Greater scalability: AI agents learn from variations and adapt automatically",
  "Enhanced decision-making powered by complex real-time data analysis",
];

function ComparisonBlock({
  tag,
  problemTitle,
  solutionTitle,
  problems,
  solutions,
}: {
  tag: string;
  problemTitle: string;
  solutionTitle: string;
  problems: string[];
  solutions: string[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line shadow-card-hover">
      {/* Header bar */}
      <div className="flex items-center gap-3 bg-teal-light px-5 py-3 sm:px-8 sm:py-4">
        <span className="rounded-full bg-button px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
          {tag}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        {/* Problems */}
        <div className="border-r border-line bg-white p-5 sm:p-8">
          <h3 className="mb-6 text-lg font-black text-accent">{problemTitle}</h3>
          <ul className="space-y-4">
            {problems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
              >
                <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Solutions */}
        <div className="bg-button p-5 sm:p-8">
          <h3 className="mb-6 text-lg font-black text-white">{solutionTitle}</h3>
          <ul className="space-y-4">
            {solutions.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-relaxed text-white/90"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SPMComparisonSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
            The Lanshore Difference
          </p>
          <h2 className="text-3xl font-black text-accent lg:text-4xl">
            From Broken to Best-in-Class
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-foreground">
            Most organizations are leaving ROI on the table. Here&apos;s what changes when
            you partner with Lanshore.
          </p>
        </div>

        <div className="space-y-7 sm:space-y-10">
          <ComparisonBlock
            tag="SPM"
            problemTitle="What are you missing in your SPM Solution?"
            solutionTitle="Lanshore SPM Solutions"
            problems={SPM_PROBLEMS}
            solutions={SPM_SOLUTIONS}
          />
          <ComparisonBlock
            tag="AI & Automation"
            problemTitle="Is Your Organization Positioned to Take Advantage of AI-Enabled Automation?"
            solutionTitle="Lanshore Intelligent Automation Solutions"
            problems={AI_PROBLEMS}
            solutions={AI_SOLUTIONS}
          />
        </div>
      </div>
    </section>
  );
}
