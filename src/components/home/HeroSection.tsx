import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white lg:flex lg:aspect-[1920/997] lg:items-start">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-ink-deep/[0.62]" aria-hidden />

      <div className="container-site relative z-10 pt-20 pb-20 sm:pt-28 sm:pb-28 lg:w-full lg:pt-20 lg:pb-10">
        {/* Partner badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold/[0.12] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/80">
            <ShieldCheck className="h-4 w-4 flex-shrink-0 text-gold" />
            Microsoft Certified Partner &nbsp;·&nbsp; UiPath Fast Track Partner
          </div>
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="text-link-hover">AI Assisted SPM</span> by Lanshore
          </h1>

          {/* Focus areas */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-base font-semibold uppercase tracking-widest text-white/90 sm:text-lg lg:text-xl">
            <Link
              href="/agentic-spm/executive-dashboards"
              className="text-white/90 transition-colors duration-150 hover:text-link-hover"
            >
              Executive Dashboards
            </Link>
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            <Link
              href="/agentic-spm/operations"
              className="text-white/90 transition-colors duration-150 hover:text-link-hover"
            >
              Operations
            </Link>
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            <Link
              href="/agentic-spm/custom-apps"
              className="text-white/90 transition-colors duration-150 hover:text-link-hover"
            >
              Custom Apps
            </Link>
          </div>

          <p className="mx-auto mb-7 max-w-2xl text-lg leading-relaxed text-white/80 sm:mb-10 lg:text-xl">
            Fifteen years of enterprise SPM delivery, converged with autonomous AI agents
            embedded directly in your commission workflows, eliminating manual work while
            surfacing risk in real time.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded bg-cta px-7 py-3.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-cta-hover"
            >
              Get an SPM Assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#agentic-spm"
              className="inline-flex items-center justify-center gap-2 rounded border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-white/10"
            >
              <Zap className="h-4 w-4" />
              Explore AI Assisted SPM
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
