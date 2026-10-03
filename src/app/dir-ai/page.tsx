import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import {
  DIR_CONTRACT,
  DIR_CONTACT,
  DIR_LOGO,
  DIR_PRODUCTS,
  DIR_SERVICE_GROUPS,
  DIR_WARRANTY,
  DIR_RETURNS,
  type PriceLine,
} from "@/lib/dirContract";

const TITLE = `Texas DIR Contract ${DIR_CONTRACT.number}: AI Products and Services | Lanshore`;
const DESCRIPTION = `Lanshore's Texas Department of Information Resources (DIR) Cooperative Contract ${DIR_CONTRACT.number}: products and services, DIR discounts, how to get a quote and place a purchase order, warranty and returns.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/dir-ai" },
  openGraph: { siteName: "Lanshore", locale: "en_US", title: TITLE, description: DESCRIPTION, url: "/dir-ai", type: "website" },
};

/* Contract obligation (Appendix A 7.2 and contract section 7). Every section
   below maps to one item on DIR's Website Compliance Checklist; the ids are
   checked by scripts/check-dir-page.mjs. Wording follows DIR's Vendor Press
   Release Guidelines: "awarded a contract by", never "partner" or "approved
   vendor", and never "the DIR". */

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const link = "font-semibold text-accent underline hover:text-accent-hover";

function PriceTable({ caption, lines }: { caption: string; lines: PriceLine[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-paper">
          <tr>
            <th scope="col" className="border-b border-line px-3 py-2 font-semibold text-ink">Product or service</th>
            <th scope="col" className="border-b border-line px-3 py-2 font-semibold text-ink">Unit</th>
            <th scope="col" className="border-b border-line px-3 py-2 font-semibold text-ink">DIR discount off list price</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.name}>
              <td className="border-b border-line px-3 py-2 align-top text-foreground">
                <span className="font-semibold text-ink">{l.name}</span>
                <br />
                <span className="text-muted">{l.description}</span>
              </td>
              <td className="border-b border-line px-3 py-2 align-top text-foreground">{l.unit}</td>
              <td className="border-b border-line px-3 py-2 align-top font-semibold tabular-nums text-ink">{l.discount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DirContractPage() {
  const c = DIR_CONTRACT;
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: `Texas DIR Contract ${c.number}`, href: "/dir-ai" },
        ])}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Texas DIR Cooperative Contract
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            {c.number}: {c.title}
          </h1>
          {/* DIR's recommended award wording (Vendor Press Release Guidelines). */}
          <p className="mt-6 text-lg text-white/80">
            {`Lanshore, LLC has been awarded a contract by the Texas Department of Information Resources (DIR) to offer artificial intelligence (AI) products and services to state and local governments, public education and other eligible customers through DIR's Cooperative Contracts Program.`}
          </p>
          {DIR_LOGO && (
            <div className="mt-6 inline-block rounded bg-white p-3">
              <Image src={DIR_LOGO.src} alt={DIR_LOGO.alt} width={DIR_LOGO.width} height={DIR_LOGO.height} />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="rounded-lg border-l-4 border-gold bg-paper p-4 text-sm text-foreground">
          This page covers only the products and services available under DIR contract {c.number}.
          Other Lanshore offerings described elsewhere on this website are not part of this contract.
        </p>

        <section id="contract" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Contract at a glance</h2>
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[14rem_1fr]">
            <dt className="font-semibold text-ink">DIR contract number</dt>
            <dd className="text-foreground">
              <a href={c.contractUrl} {...ext} className={link}>{c.number}</a> (contract details, documents and
              terms on DIR&apos;s website)
            </dd>
            <dt className="font-semibold text-ink">Solicitation</dt>
            <dd className="text-foreground">{c.solicitation}</dd>
            <dt className="font-semibold text-ink">Contract scope</dt>
            <dd className="text-foreground">{c.title}: {c.technologies.join(", ")}</dd>
            <dt className="font-semibold text-ink">Order fulfillment</dt>
            <dd className="text-foreground">
              Lanshore, LLC sells directly under this contract. There are no designated order fulfillers or resellers.
            </dd>
            <dt className="font-semibold text-ink">DIR Cooperative Contracts</dt>
            <dd className="text-foreground">
              <a href={c.cooperativeContractsUrl} {...ext} className={link}>About DIR&apos;s Cooperative Contracts Program</a>
              {" · "}
              <a href={c.customerEligibilityUrl} {...ext} className={link}>Who can buy through DIR</a>
            </dd>
          </dl>
        </section>

        <section id="products" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Products and services available under {c.number}</h2>
          <p className="mt-3 text-foreground">
            The contract covers these AI technologies: {c.technologies.join(", ")}. Lanshore delivers them through
            the product and services below, as listed in the contract&apos;s Appendix C Pricing Index.
          </p>
          <h3 className="mt-8 text-xl font-bold text-ink">Products</h3>
          <PriceTable caption="Products available under the contract" lines={DIR_PRODUCTS} />
          {DIR_SERVICE_GROUPS.map((g) => (
            <div key={g.heading}>
              <h3 className="mt-8 text-xl font-bold text-ink">{g.heading}</h3>
              <p className="mt-2 text-sm text-muted">{g.intro}</p>
              <PriceTable caption={g.heading} lines={g.lines} />
            </div>
          ))}
        </section>

        <section id="pricing" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Pricing</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-foreground">
            <li>
              Every product and service above is priced at its list price less the discount shown for it. DIR
              customers never pay more than list price minus that discount.
            </li>
            <li>
              Lanshore provides contract pricing by quote: each quote shows the list price, DIR discount and
              the resulting DIR customer price, and references {c.number}.
            </li>
            <li>Quoted rates include DIR&apos;s administrative fee. Travel, meals and lodging are not included.</li>
            <li>
              UiPath software list prices are UiPath&apos;s published prices; see{" "}
              <a href="https://www.uipath.com/pricing" {...ext} className={link}>UiPath pricing</a>.
            </li>
          </ul>
        </section>

        <section id="ordering" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">How to obtain a quote and place a purchase order</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-foreground">
            <li>
              Confirm your organization is eligible to buy through DIR (
              <a href={c.customerEligibilityUrl} {...ext} className={link}>customer eligibility</a>).
            </li>
            <li>
              Request a quote from the Lanshore contact below. Describe the products or services you need and
              mention contract {c.number}.
            </li>
            <li>
              Lanshore sends a quote showing list price, DIR discount and DIR price. For services, the quote is
              accompanied by the contract&apos;s Appendix D Service Agreement order form, describing the scope,
              roles, rates and schedule.
            </li>
            <li>
              Issue a purchase order made payable to Lanshore, LLC. <strong>The purchase order must reference DIR
              contract number {c.number}.</strong> Email it, with the signed quote or Service Agreement, to the
              contact below.
            </li>
            <li>
              Lanshore invoices monthly. Invoices are payable within thirty (30) days of receipt, in accordance
              with Chapter 2251 of the Texas Government Code.
            </li>
          </ol>
        </section>

        <section id="contact" className="mt-12 scroll-mt-24 rounded-xl bg-teal-light p-6">
          <h2 className="text-2xl font-bold text-ink">Lanshore contact for {c.number}</h2>
          <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-[8rem_1fr]">
            <dt className="font-semibold text-ink">Name</dt>
            <dd className="text-foreground">{DIR_CONTACT.name}</dd>
            {DIR_CONTACT.phone && (
              <>
                <dt className="font-semibold text-ink">Telephone</dt>
                <dd className="text-foreground">
                  <a href={`tel:${DIR_CONTACT.phone.replace(/[^0-9+]/g, "")}`} className={link}>{DIR_CONTACT.phone}</a>
                </dd>
              </>
            )}
            <dt className="font-semibold text-ink">Email</dt>
            <dd className="text-foreground">
              <a href={`mailto:${DIR_CONTACT.email}`} className={link}>{DIR_CONTACT.email}</a>
            </dd>
            <dt className="font-semibold text-ink">Company</dt>
            <dd className="text-foreground">Lanshore, LLC, 1795 N Fry Rd Suite 289, Katy, TX 77449</dd>
          </dl>
        </section>

        <section id="warranty" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Warranty policy</h2>
          <div className="mt-4 space-y-3 text-foreground">
            {DIR_WARRANTY.map((p) => <p key={p}>{p}</p>)}
          </div>
        </section>

        <section id="returns" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Return policy</h2>
          <div className="mt-4 space-y-3 text-foreground">
            {DIR_RETURNS.map((p) => <p key={p}>{p}</p>)}
          </div>
        </section>

        <section id="about-dir" className="mt-12 scroll-mt-24 border-t border-line pt-8">
          <h2 className="text-xl font-bold text-ink">About DIR</h2>
          <p className="mt-3 text-sm text-muted">
            The mission of the Texas Department of Information Resources is to serve Texas government by leading
            the state&apos;s technology strategy, protecting state technology infrastructure, and offering
            innovative and cost-effective solutions for all levels of government. Visit DIR at{" "}
            <a href="https://dir.texas.gov" {...ext} className={link}>dir.texas.gov</a>.
          </p>
        </section>
      </div>
    </>
  );
}
