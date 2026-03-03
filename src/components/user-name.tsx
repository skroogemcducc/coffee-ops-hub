"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";

const USER_NAME_STORAGE_KEY = "coffee-ops-user-name";
const DEFAULT_USER_NAME = "Jay";
const USER_NAME_EVENT = "coffee-ops-user-name-updated";

function readUserName() {
  if (typeof window === "undefined") {
    return DEFAULT_USER_NAME;
  }

  const saved = window.localStorage.getItem(USER_NAME_STORAGE_KEY)?.trim();

  return saved || DEFAULT_USER_NAME;
}

function saveUserName(nextName: string) {
  const normalized = nextName.trim() || DEFAULT_USER_NAME;

  window.localStorage.setItem(USER_NAME_STORAGE_KEY, normalized);
  window.dispatchEvent(
    new CustomEvent<string>(USER_NAME_EVENT, { detail: normalized }),
  );

  return normalized;
}

function subscribeUserName(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleUpdate = () => callback();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === USER_NAME_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(USER_NAME_EVENT, handleUpdate);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(USER_NAME_EVENT, handleUpdate);
    window.removeEventListener("storage", handleStorage);
  };
}

function useUserName() {
  return useSyncExternalStore(
    subscribeUserName,
    readUserName,
    () => DEFAULT_USER_NAME,
  );
}

export function UserNameDisplay({
  className = "",
}: {
  className?: string;
}) {
  const userName = useUserName();

  return (
    <span className={className} suppressHydrationWarning>
      {userName}
    </span>
  );
}

export function UserNameSettings() {
  const userName = useUserName();
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextName = String(formData.get("userName") ?? "");
    saveUserName(nextName);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="kicker text-[var(--accent)]">Display name</span>
        <input
          key={userName}
          type="text"
          name="userName"
          defaultValue={userName}
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
          Save display name
        </button>
        <span className="text-sm text-[var(--panel-muted)]">
          {saved ? "Saved for this device." : "Shows in the app top bar."}
        </span>
      </div>
    </form>
  );
}
