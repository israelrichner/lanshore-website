import Link from "next/link";

const CARDS = [
  {
    step: "01",
    title: "The Gap",
    text: "SPM sits at the intersection of revenue, incentives, and risk, but most SPM environments are static. They report on what happened, not what's about to go wrong.",
  },
  {
    step: "02",
    title: "The Agents",
    text: "We embed autonomous AI agents directly inside your SPM. They run continuously: surfacing risk, validating the data behind your decisions, and identifying opportunities to improve revenue performance.",
  },
  {
    step: "03",
    title: "The Outcome",
    text: "Your SPM becomes an active system, not a quarterly snapshot. An always-on engine that monitors, alerts, and drives better outcomes.",
  },
];

export default function ProblemSolutionSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
            How It Works
          </p>
          <h2 className="text-3xl font-black text-accent lg:text-4xl">
            Agentic AI that works inside your SPM, continuously.
          </h2>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="relative flex flex-col gap-4 overflow-hidden rounded-lg border border-line bg-white p-5 shadow-card sm:p-8"
            >
              {/* Accent top bar */}
              <div className="absolute left-0 right-0 top-0 h-1 rounded-t-lg bg-button" />

              {/* Step number */}
              <span
                className="select-none text-4xl font-black leading-none text-gold/35 sm:text-5xl"
                aria-hidden
              >
                {card.step}
              </span>

              <h3 className="text-xl font-black text-button">{card.title}</h3>
              <p className="text-sm leading-relaxed text-foreground">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/contact" className="btn-primary">
            Schedule a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
