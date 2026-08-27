"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
/* Shared with the other tracker and unit-tested — see
   src/lib/studio/tracker-gate.test.mjs. The literal admin path lives there,
   not here, but this file still appears in the A1 allowlist because it
   imports from a studio path. */
import { shouldLoadTracker, isAdminPath } from "@/lib/studio/tracker-gate.mjs";
import { HUBSPOT_PORTAL_ID } from "@/lib/hubspot-config";

/* Host is fixed for the page lifetime; no real subscription needed. The
   PATH is not — a client-side navigation into /studio must switch the
   tracker off, which is why usePathname() drives the snapshot below. */
const subscribe = () => () => {};
const FORCE = process.env.NEXT_PUBLIC_HUBSPOT_TRACKING === "force";

export default function HubSpotLoader() {
  const pathname = usePathname();
  const load = useSyncExternalStore(
    subscribe,
    () => shouldLoadTracker({ hostname: window.location.hostname, pathname, force: FORCE }),
    () => FORCE && !isAdminPath(pathname)
  );

  if (!load) return null;

  return (
    <Script
      id="hs-script-loader"
      src={`https://js-na2.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
      strategy="afterInteractive"
    />
  );
}
