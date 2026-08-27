"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
/* Shared with the other tracker and unit-tested — see
   src/lib/studio/tracker-gate.test.mjs. The literal admin path lives there,
   not here, but this file still appears in the A1 allowlist because it
   imports from a studio path. */
import { shouldLoadTracker, isAdminPath } from "@/lib/studio/tracker-gate.mjs";
import { GA_MEASUREMENT_ID } from "@/lib/analytics-config";

/* Host is fixed for the page lifetime; no real subscription needed. The
   PATH is not — a client-side navigation into /studio must switch the
   tracker off, which is why usePathname() drives the snapshot below. */
const subscribe = () => () => {};
const FORCE = process.env.NEXT_PUBLIC_GA_TRACKING === "force";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const load = useSyncExternalStore(
    subscribe,
    () => shouldLoadTracker({ hostname: window.location.hostname, pathname, force: FORCE }),
    () => FORCE && !isAdminPath(pathname)
  );

  if (!load) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
