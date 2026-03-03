import Link from "next/link";

import { AppTopBar } from "@/components/app-top-bar";
import { CompanyNameDisplay } from "@/components/company-name";
import { controlModules } from "@/lib/app-data";

function BoardIcon({ href }: { href: string }) {
  switch (href) {
    case "/inventory":
      return (
        <svg viewBox="0 0 32 32" className="module-icon h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="5" y="7" width="10" height="8" rx="1.5" />
          <rect x="17" y="7" width="10" height="8" rx="1.5" />
          <rect x="11" y="17" width="10" height="8" rx="1.5" />
        </svg>
      );
    case "/menu":
      return (
        <svg viewBox="0 0 32 32" className="module-icon h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="8" y="5.5" width="16" height="21" rx="2.5" />
          <path d="M12 11h8M12 16h8M12 21h5" strokeLinecap="round" />
        </svg>
      );
    case "/brew-news":
      return (
        <svg viewBox="0 0 32 32" className="module-icon h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 13h11a3 3 0 0 1 3 3v2a5 5 0 0 1-5 5h-5a4 4 0 0 1-4-4v-6Z" />
          <path d="M23 15h2a2.5 2.5 0 0 1 0 5h-2" />
          <path d="M12 8c0-1.8 1.4-2.3 1.4-4M17 8c0-1.8 1.4-2.3 1.4-4" strokeLinecap="round" />
        </svg>
      );
    case "/tasks":
      return (
        <svg viewBox="0 0 32 32" className="module-icon h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 10h3l2 2 4-5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 19h3l2 2 4-5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 10h5M19 19h5" strokeLinecap="round" />
        </svg>
      );
    case "/calendar":
      return (
        <svg viewBox="0 0 32 32" className="module-icon h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="6" y="8" width="20" height="18" rx="3" />
          <path d="M10 5v6M22 5v6M6 13h20" strokeLinecap="round" />
          <path d="M12 18h4M18 18h2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" className="module-icon h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="16" cy="16" r="9" />
          <circle cx="16" cy="16" r="4" />
          <path d="M16 7v3M16 22v3M7 16h3M22 16h3" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function ControlBoardPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[980px] flex-col px-4 py-4 md:px-6">
        <AppTopBar activeHref="/control-board" detailText="Launch modules" />

        <div className="flex flex-1 items-center justify-center py-8 md:py-12">
          <div className="w-full max-w-[760px]">
            <div className="mb-8 text-center">
              <CompanyNameDisplay className="board-title text-[var(--ink)]" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {controlModules.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  aria-label={module.label}
                  title={module.label}
                  className="module-tile flex-col gap-3 p-4"
                >
                  <BoardIcon href={module.href} />
                  <span className="module-label text-[var(--ink-soft)]">
                    {module.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
