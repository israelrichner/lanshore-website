import Link from "next/link";
import { PUBLISHING_UNAVAILABLE_MESSAGE } from "@/lib/studio/github";

/**
 * What an editor sees instead of a Server Components crash when GitHub
 * cannot be read (expired/missing token, GitHub outage, network failure).
 * Fixed text only — never the upstream error.
 */
export default function PublishingUnavailable({ backLink = false }: { backLink?: boolean }) {
  return (
    <div role="alert" className="mt-8 rounded border border-line bg-paper p-4 text-sm text-ink">
      <p className="font-semibold">{PUBLISHING_UNAVAILABLE_MESSAGE}</p>
      <p className="mt-1 text-muted">
        Nothing can be loaded or saved until this is fixed. See “Troubleshooting” in docs/CONTENT-EDITING.md.
      </p>
      {backLink && (
        <p className="mt-3">
          <Link href="/studio" className="font-semibold text-accent">
            Back to Studio
          </Link>
        </p>
      )}
    </div>
  );
}
