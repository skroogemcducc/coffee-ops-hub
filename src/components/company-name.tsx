"use client";

import { FormEvent, useSyncExternalStore, useState } from "react";

import {
  COMPANY_NAME_STORAGE_KEY,
  DEFAULT_COMPANY_NAME,
} from "@/lib/company-name";

const COMPANY_NAME_EVENT = "coffee-ops-company-name-updated";

function readCompanyName() {
  if (typeof window === "undefined") {
    return DEFAULT_COMPANY_NAME;
  }

  const saved = window.localStorage.getItem(COMPANY_NAME_STORAGE_KEY)?.trim();

  return saved || DEFAULT_COMPANY_NAME;
}

function saveCompanyName(nextName: string) {
  const normalized = nextName.trim() || DEFAULT_COMPANY_NAME;

  window.localStorage.setItem(COMPANY_NAME_STORAGE_KEY, normalized);
  window.dispatchEvent(
    new CustomEvent<string>(COMPANY_NAME_EVENT, { detail: normalized }),
  );

  return normalized;
}

function subscribeCompanyName(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleUpdate = () => callback();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === COMPANY_NAME_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(COMPANY_NAME_EVENT, handleUpdate);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(COMPANY_NAME_EVENT, handleUpdate);
    window.removeEventListener("storage", handleStorage);
  };
}

function useCompanyName() {
  return useSyncExternalStore(
    subscribeCompanyName,
    readCompanyName,
    () => DEFAULT_COMPANY_NAME,
  );
}

export function CompanyNameDisplay({
  className = "",
}: {
  className?: string;
}) {
  const companyName = useCompanyName();

  return (
    <span className={className} suppressHydrationWarning>
      {companyName}
    </span>
  );
}

export function CompanyNameSettings() {
  const companyName = useCompanyName();
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextName = String(formData.get("companyName") ?? "");
    saveCompanyName(nextName);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="kicker text-[var(--accent)]">Company name</span>
        <input
          key={companyName}
          type="text"
          name="companyName"
          defaultValue={companyName}
          onChange={() => {
            if (saved) {
              setSaved(false);
            }
          }}
          className="mt-2 w-full rounded-xl border border-[var(--panel-line)] bg-white/80 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[rgba(191,95,44,0.24)]"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="action-link border-0">
          Save company name
        </button>
        <span className="text-sm text-[var(--panel-muted)]">
          {saved ? "Saved for this device." : "Shows on the control board."}
        </span>
      </div>
    </form>
  );
}
