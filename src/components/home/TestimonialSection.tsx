const TESTIMONIALS = [
  {
    quote:
      "The Lanshore Team was instrumental in Whip Media's quick start along the path of automated data processing utilizing UiPath. In short order, Lanshore provided a complete project plan, pulled together an extremely skilled and accessible team, and orchestrated a clear and comprehensive training curriculum to set our team up for success despite a very aggressive schedule.",
    name: "Patrick Kilkelly",
    company: "Whip Media",
    initials: "PK",
  },
  {
    quote:
      "These guys are smart. They know their stuff, they hit the ground running, they know where to look and immediately identify potential problems.",
    name: "Marilyn Torres",
    company: "Syniverse",
    initials: "MT",
  },
  {
    quote:
      "L&L Oilfield revolutionized its invoicing process by implementing UiPath Robotic Process Automation technology. By automating this workflow, L&L Oilfield dramatically improved efficiency, accuracy, and speed, cutting invoicing time from several hours to mere minutes per ticket.",
    name: "L&L Oilfield",
    company: "Client",
    initials: "LL",
  },
];

function StarRating() {
  return (
    <div className="mb-5 flex gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialSection() {
  return (
    <section className="section-padding bg-paper">
      <div className="container-site">
        <div className="mb-8 text-center sm:mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
            Client Stories
          </p>
          <h2 className="text-3xl font-black text-accent">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative flex flex-col rounded-xl border border-line bg-white p-5 shadow-card sm:p-8"
            >
              {/* Large decorative quote mark */}
              <div
                className="pointer-events-none absolute right-6 top-4 select-none text-5xl font-black leading-none text-teal-light sm:text-7xl"
                aria-hidden
              >
                &ldquo;
              </div>

              <StarRating />

              <blockquote className="relative z-10 mb-5 flex-1 text-sm leading-relaxed text-foreground sm:mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="mt-auto flex items-center gap-3 border-t border-line pt-4 sm:pt-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-button text-sm font-black text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-accent">{t.name}</p>
                  <p className="text-xs text-muted">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
