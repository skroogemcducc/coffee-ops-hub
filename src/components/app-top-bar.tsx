"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { UserNameDisplay } from "@/components/user-name";

type AppTopBarProps = {
  activeHref: string;
  detailText?: string;
  actions?: React.ReactNode;
};

type RouteItem = {
  href: string;
  label: string;
};

const topBarRoutes: RouteItem[] = [
  { href: "/control-board", label: "Control Board" },
  { href: "/inventory", label: "Inventory" },
  { href: "/menu", label: "Menu" },
  { href: "/brew-news", label: "Brew News" },
  { href: "/tasks", label: "To-Do" },
  { href: "/calendar", label: "Calendar" },
  { href: "/goals", label: "Goals" },
  { href: "/activity", label: "Activity" },
  { href: "/inbox", label: "Inbox" },
  { href: "/settings", label: "Settings" },
  { href: "/account", label: "Account" },
];

function normalizeLabel(value: string) {
  return value.trim().toLowerCase();
}

function getRouteIndex(activeHref: string) {
  const index = topBarRoutes.findIndex((route) => route.href === activeHref);

  return index >= 0 ? index : 0;
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M7 12h13" />
      <path d="M4 17h16" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 9.5 8.5 7h7L19 9.5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9.5Z" />
      <path d="M5 14h4l1.7 2h2.6l1.7-2H19" />
    </svg>
  );
}

export function AppTopBar({
  activeHref,
  detailText,
  actions,
}: AppTopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentIndex = getRouteIndex(activeHref);
  const currentRoute = topBarRoutes[currentIndex];
  const previousRoute =
    topBarRoutes[(currentIndex - 1 + topBarRoutes.length) % topBarRoutes.length];
  const nextRoute = topBarRoutes[(currentIndex + 1) % topBarRoutes.length];
  const showDetail =
    detailText &&
    normalizeLabel(detailText) !== normalizeLabel(currentRoute.label);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="sticky top-0 z-20 pb-3 pt-2">
      <div className="launch-bar gap-1.5 px-2 py-2 sm:gap-3 sm:px-3 sm:py-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="launch-chip h-10 w-10 sm:h-11 sm:w-11"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
          >
            <MenuIcon />
          </button>

          {menuOpen ? (
            <div className="absolute left-0 top-[calc(100%+0.65rem)] z-30 w-56 rounded-[24px] border border-[var(--panel-line)] bg-[rgba(255,253,248,0.98)] p-2 shadow-[0_16px_28px_rgba(101,73,47,0.12)]">
              {topBarRoutes.map((route) => {
                const active = route.href === activeHref;

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-[18px] px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-[rgba(191,95,44,0.1)] text-[var(--accent)]"
                        : "text-[var(--ink-soft)] hover:bg-[rgba(191,95,44,0.08)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {route.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <Link
          href={previousRoute.href}
          className="launch-chip h-10 w-10 sm:h-11 sm:w-11"
          aria-label={`Go to ${previousRoute.label}`}
        >
          <ArrowLeftIcon />
        </Link>

        <div className="min-w-0 flex-1 px-1 text-center">
          <p className="truncate whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:text-[0.72rem] sm:tracking-[0.28em]">
            {currentRoute.label}
          </p>
          {showDetail ? (
            <p className="mt-0.5 hidden truncate text-xs font-medium text-[var(--ink-soft)] sm:block sm:text-sm">
              {detailText}
            </p>
          ) : null}
        </div>

        <Link
          href={nextRoute.href}
          className="launch-chip h-10 w-10 sm:h-11 sm:w-11"
          aria-label={`Go to ${nextRoute.label}`}
        >
          <ArrowRightIcon />
        </Link>

        {actions}

        <Link
          href="/inbox"
          aria-label="Inbox"
          className="launch-chip relative h-10 w-10 sm:h-11 sm:w-11"
        >
          <InboxIcon />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
        </Link>

        <Link
          href="/account"
          aria-label="Open account"
          className="inline-flex h-10 max-w-[6.5rem] items-center rounded-full border border-[rgba(82,59,40,0.08)] bg-white/70 px-2.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[rgba(191,95,44,0.18)] hover:text-[var(--accent)] sm:h-11 sm:max-w-[9.5rem] sm:px-3"
        >
          <UserNameDisplay className="truncate" />
        </Link>
      </div>
    </div>
  );
}
