import Link from "next/link";
import Image from "next/image";
import { Play, CheckCircle2 } from "lucide-react";

const DEMO_URL = "https://youtu.be/cX8N9ge1Jrs";
const YT_ID = "cX8N9ge1Jrs";

const HIGHLIGHTS = [
  "End-to-end workflow automation in minutes",
  "UiPath, n8n, Claude Code, Power Automate, or direct API integrations: your stack, our delivery",
  "Handles structured & unstructured data at scale",
];

/* Generalized from the old "UiPath demo" section: same video, wider
   tool-agnostic message. Links to the automation services page. */
export default function AutomationSection() {
  return (
    <section className="section-padding bg-paper">
      <div className="container-site">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
              Automation in Action
            </p>
            <h2 className="mb-4 text-3xl font-black text-accent lg:text-4xl">
              Whatever Tools You Prefer, We Automate With Them
            </h2>
            <p className="mb-6 leading-relaxed text-foreground">
              From RPA with UiPath to agentic workflows built with n8n, Claude Code, VS
              Code, Microsoft Power Automate, or direct API integrations, Lanshore delivers
              automation on the stack your team already trusts. Watch a UiPath
              implementation eliminate repetitive manual work in real time.
            </p>

            <ul className="mb-8 space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-button" />
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/services/automation" className="btn-primary">
              Explore Automation &amp; Integration Services
            </Link>
          </div>

          {/* Right: YouTube thumbnail */}
          <div className="relative">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch UiPath ScreenPlay demo on YouTube"
              className="group relative block aspect-video overflow-hidden rounded-xl border border-line shadow-card-hover"
            >
              <Image
                src={`https://img.youtube.com/vi/${YT_ID}/maxresdefault.jpg`}
                alt="UiPath ScreenPlay Demo"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 transition-colors duration-200 group-hover:bg-black/20" />
              {/* Play button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/60 bg-white/20 transition-transform duration-200 group-hover:scale-110">
                  <Play className="ml-1 h-9 w-9 text-white" />
                </div>
                <span className="text-sm font-semibold text-white drop-shadow">
                  UiPath ScreenPlay Demo
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
