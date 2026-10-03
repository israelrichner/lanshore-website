"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";

/** Grace period before a desktop dropdown closes after pointer leaves. */
const CLOSE_DELAY_MS = 220;

export default function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const baseId = useId();

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (label: string) => {
      clearCloseTimer();
      setOpen(label);
    },
    [clearCloseTimer],
  );

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(null);
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside pointer or Escape while a desktop menu is open.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (desktopNavRef.current && target && !desktopNavRef.current.contains(target)) {
        closeMenu();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  // Route changes (including back/forward) should dismiss open menus.
  // Reset during render instead of in an effect; a pending close timer is
  // harmless since it only re-sets `open` to null.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setOpen(null);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      <div
        className={`container-site relative flex items-center justify-between transition-all duration-200 ${
          scrolled ? "h-14" : "h-16 lg:h-20"
        }`}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/lanshore-logo.png"
            alt="Lanshore: Advancing Intelligence"
            width={699}
            height={241}
            priority
            className={`w-auto transition-all duration-200 ${scrolled ? "h-9" : "h-11"}`}
          />
        </Link>

        {/* Desktop nav */}
        <nav
          ref={desktopNavRef}
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex"
          aria-label="Main"
        >
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={scheduleClose}
                onFocusCapture={() => openMenu(item.label)}
                onBlurCapture={(event) => {
                  const next = event.relatedTarget as Node | null;
                  if (next && event.currentTarget.contains(next)) return;
                  scheduleClose();
                }}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded px-3 py-2 text-sm font-semibold text-nav hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-expanded={open === item.label}
                  aria-haspopup="true"
                  aria-controls={`${baseId}-${item.label.replace(/\s+/g, "-").toLowerCase()}-panel`}
                  id={`${baseId}-${item.label.replace(/\s+/g, "-").toLowerCase()}-trigger`}
                  onClick={() => {
                    clearCloseTimer();
                    setOpen(open === item.label ? null : item.label);
                  }}
                >
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {open === item.label && (
                  // before: extends hit-area upward so diagonal paths still
                  // count as “over the menu” without a visible gap under the trigger.
                  <div
                    id={`${baseId}-${item.label.replace(/\s+/g, "-").toLowerCase()}-panel`}
                    role="region"
                    aria-labelledby={`${baseId}-${item.label.replace(/\s+/g, "-").toLowerCase()}-trigger`}
                    className="absolute left-0 top-full z-50 min-w-[15rem] before:absolute before:inset-x-0 before:-top-2 before:h-2 before:content-['']"
                  >
                    <div className="rounded-md border border-line bg-white/95 py-1 shadow-card-hover backdrop-blur-md">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-nav hover:bg-teal-light hover:text-accent focus-visible:bg-teal-light focus-visible:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                          onClick={closeMenu}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="rounded px-3 py-2 text-sm font-semibold text-nav hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-md bg-gold px-4 py-2 text-sm font-bold text-ink-deep hover:bg-gold-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:block"
        >
          Contact Us
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded text-nav focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-line bg-white px-4 pb-4 lg:hidden"
          aria-label="Mobile"
        >
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-line py-2">
              {item.children ? (
                <>
                  <div className="py-1 text-sm font-bold text-nav">{item.label}</div>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block py-2.5 pl-3 text-sm text-muted"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="block py-2.5 text-sm font-bold text-nav"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link
            href="/contact"
            className="mt-4 block rounded-md bg-gold px-4 py-2 text-center text-sm font-bold text-ink-deep"
            onClick={() => setMobileOpen(false)}
          >
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  );
}
