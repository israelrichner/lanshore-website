import type { Metadata } from "next";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Lanshore",
  description: "How Lanshore collects, uses, and protects information on this site.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "Privacy Policy | Lanshore",
    description:
      "How Lanshore collects, uses, and protects information on this site.",
    url: "/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-muted">
        <p>
          Lanshore collects only the information you submit through this site (typically
          your name, work email, company, and message) and uses it to respond to your
          inquiry. We do not sell or share this information with third parties for
          marketing purposes.
        </p>
        <p>
          Client data handled in the course of an engagement is governed by the
          engagement agreement, stays in the client&rsquo;s environment, and is not used
          to train AI models.
        </p>

        <h2 className="pt-4 text-xl font-bold text-ink">Cookies &amp; tracking</h2>
        <p>
          We use{" "}
          <a
            href="https://www.hubspot.com/data-privacy/gdpr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent"
          >
            HubSpot
          </a>{" "}
          as a processor for website analytics, form attribution, live chat, and
          marketing automation on lanshore.com. HubSpot may set the following cookies
          after you consent (where a consent banner applies):
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <code className="text-sm text-ink">hubspotutk</code>: visitor identity for
            form attribution and contact timeline
          </li>
          <li>
            <code className="text-sm text-ink">__hstc</code>: main tracking cookie
            (domain, UTK, initial/last/current timestamps, session count)
          </li>
          <li>
            <code className="text-sm text-ink">__hssc</code>: session tracking
          </li>
          <li>
            <code className="text-sm text-ink">__hssrc</code>: session restart marker
          </li>
          <li>
            <code className="text-sm text-ink">messagesUtk</code>: chat widget visitor
            identity (when live chat is enabled)
          </li>
        </ul>
        <p>
          We also use{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent"
          >
            Google Analytics 4
          </a>{" "}
          (measurement ID G-G61027WSXF) for aggregated traffic and page-view metrics on
          lanshore.com. Google may set cookies such as{" "}
          <code className="text-sm text-ink">_ga</code> and{" "}
          <code className="text-sm text-ink">_ga_*</code> to distinguish visitors and
          sessions. The tag loads only on the production site (not preview or local
          hosts).
        </p>
        <p>
          In the EU/EEA/UK, non-essential tracking cookies are set only after you accept
          the consent banner. Elsewhere you may see a lighter notice depending on our
          HubSpot privacy policy configuration. You can change your preference at any
          time:
        </p>
        <p>
          <CookieSettingsButton className="rounded-md border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent" />
        </p>
        <p>
          Declining or withdrawing consent does not affect site functionality other than
          analytics attribution and chat personalization. Form submissions still work
          without tracking cookies.
        </p>

        <p>
          Questions about this policy or requests to access or delete your information:{" "}
          <a href={`mailto:${CONTACT.email}`} className="font-semibold text-accent">
            {CONTACT.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
