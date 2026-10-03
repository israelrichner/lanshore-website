import { CheckCircle2 } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { CONTACT } from "@/lib/site";

const PROMISES = [
  "Response within 1 business day",
  "No-obligation strategy discussion",
  "Tailored SPM or automation assessment",
  "Direct access to senior Lanshore consultants",
];

export default function HomeContactSection() {
  return (
    <section className="section-padding bg-ink text-white" id="contact">
      <div className="container-site">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-link-hover">
              Get In Touch
            </p>
            <h2 className="mb-4 text-3xl font-black text-white lg:text-4xl">
              Let&rsquo;s talk
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-white/70 sm:mb-8">
              A Lanshore representative will reach out to discuss how we can help optimize
              your SPM and automation strategy. No pitch, just substance.
            </p>

            <ul className="space-y-4">
              {PROMISES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 border-t border-white/10 pt-6 sm:mt-10 sm:pt-8">
              <p className="mb-1 text-sm text-white/50">Prefer email?</p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-sm font-semibold text-link-hover transition-colors hover:text-white"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-card-hover sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
