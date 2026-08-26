import Link from "next/link";
import Image from "next/image";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import GartnerFooterNote from "@/components/GartnerFooterNote";
import NewsletterForm from "@/components/NewsletterForm";
import { CONTACT } from "@/lib/site";
import { SPM_PLATFORMS } from "@/lib/spmPlatforms";
import { BLOG_POSTS } from "@/lib/blog";

/* Every page that mentions Gartner must appear here so the required trademark
   attribution renders in its footer. Data-driven pages are computed; the
   static entries are the pages that hardcode GARTNER_2019 claims — extend this
   list when adding a claim to a new page. */
const GARTNER_PATHS = [
  "/",
  "/about",
  "/about/why-lanshore",
  "/spm",
  "/spm/compare",
  ...SPM_PLATFORMS.filter(
    (p) => p.gartnerPartnerLeadIn || p.analystNote?.includes("Gartner")
  ).map((p) => `/spm/${p.slug}`),
  /* Was `JSON.stringify(p).includes("Gartner")`, which scanned the whole
     serialized post. That was always fragile — it depended on the body text
     being part of the object — and it broke outright once posts gained a
     `mentionsGartner` field, because the KEY NAME contains "Gartner" and so
     every post matched. `mentionsGartner` is derived in loadContent from the
     title, description, body and FAQ, case-insensitively. */
  ...BLOG_POSTS.filter((p) => p.mentionsGartner).map((p) => `/blog/${p.slug}`),
];

const FOOTER_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Glossary", href: "/resources/glossary" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* Lucide dropped brand icons; keep a minimal official-style LinkedIn mark. */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const showNewsletter = Boolean(process.env.HUBSPOT_FORM_ID_NEWSLETTER);

  return (
    <footer className="bg-ink text-white">
      <div className="container-site flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo-white.png"
              alt="Lanshore"
              width={220}
              height={76}
              className="h-12 w-auto"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Sales performance management expertise, converged with agentic AI. US and
            Latin America delivery.
          </p>
          {showNewsletter && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/60">
                Newsletter
              </h2>
              <p className="mb-3 text-sm text-white/60">
                SPM &amp; agentic AI notes, occasionally.
              </p>
              <NewsletterForm variant="dark" />
            </div>
          )}
        </div>

        <div className="space-y-1 text-sm text-white/60">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/60">
            Contact
          </h2>
          <p>{CONTACT.address}</p>
          <p>
            <a href={`tel:${CONTACT.phone}`} className="hover:text-white">
              {CONTACT.phone}
            </a>
          </p>
          <p>
            <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
              {CONTACT.email}
            </a>
          </p>
          <p className="pt-1">
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-white/70 hover:text-white"
              aria-label="Lanshore on LinkedIn"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/60">
            Explore
          </h2>
          <ul className="space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/85 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom padding keeps this row clear of the fixed MobileContactBar. */}
      <div className="border-t border-white/10 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="container-site flex flex-wrap items-center justify-between gap-4 py-5 text-sm text-white/60">
          <span>© {new Date().getFullYear()} Lanshore. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <CookieSettingsButton className="cursor-pointer hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink" />
          </div>
        </div>
        <GartnerFooterNote paths={GARTNER_PATHS} />
      </div>
    </footer>
  );
}
