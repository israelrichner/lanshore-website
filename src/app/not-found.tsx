import type { Metadata } from "next";
import Link from "next/link";
import { NOT_FOUND_METADATA } from "@/lib/site";

// Rendered for unmatched URLs and for every notFound() call in the dynamic
// routes. The root layout still wraps it, so Header and Footer come for free;
// Next keeps the 404 status and adds the noindex robots tag on its own.
export const metadata: Metadata = NOT_FOUND_METADATA;

const DESTINATIONS = [
  {
    href: "/services",
    title: "Services",
    body: "How we implement, run, and automate sales performance management.",
  },
  {
    href: "/spm",
    title: "SPM Platforms",
    body: "The sales performance management platforms we implement and support.",
  },
  {
    href: "/case-studies",
    title: "Case Studies",
    body: "SPM and automation engagements across industries.",
  },
  {
    href: "/blog",
    title: "Blog",
    body: "Articles on incentive compensation, SPM operations, and AI agents.",
  },
  {
    href: "/resources/guides",
    title: "Guides",
    body: "In-depth guides for planning and running an SPM program.",
  },
  {
    href: "/about",
    title: "About Lanshore",
    body: "Who we are, our 15+ years in SPM, and how we work.",
  },
];

export default function NotFound() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Error 404
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">We couldn&apos;t find that page</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            The link may be out of date, or the page may have moved. Try one of the pages
            below, or start again from the homepage.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-md bg-gold px-6 py-3 text-center font-semibold text-ink-deep hover:bg-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
            >
              Go to the homepage
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-white/30 px-6 py-3 text-center font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Popular pages</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  className="group block h-full rounded-lg border border-line bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <h3 className="font-bold text-ink group-hover:text-accent">
                    {d.title} <span aria-hidden="true">&rarr;</span>
                  </h3>
                  <p className="mt-2 text-sm text-muted">{d.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
