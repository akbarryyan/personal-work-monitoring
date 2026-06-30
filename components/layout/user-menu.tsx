"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { logoutAction } from "@/app/actions/auth";

type UserMenuProps = {
  user: {
    name: string;
    email: string;
    initials: string;
  };
};

function IconSettings() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
    >
      {pending && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {pending ? "Keluar..." : "Ya, Logout"}
    </button>
  );
}

function LogoutConfirmDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-[15px] font-bold text-gray-900">Konfirmasi Logout</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <IconClose />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-[13px] leading-6 text-gray-600">
            Kamu akan keluar dari sesi aktif dan diarahkan kembali ke halaman login.
          </p>

          <form action={logoutAction} className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <LogoutSubmitButton />
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function openConfirm() {
    setOpen(false);
    setConfirmOpen(true);
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-gray-100"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white">
            {user.initials}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-[13px] font-semibold leading-tight text-gray-900">
              {user.name}
            </p>
            <p className="max-w-40 truncate text-[11px] leading-tight text-gray-400">
              {user.email}
            </p>
          </div>
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
            <div className="border-b border-gray-100 px-3.5 py-3">
              <p className="truncate text-[13px] font-semibold text-gray-900">
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-gray-400">
                {user.email}
              </p>
            </div>

            <div className="py-1">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-700 transition hover:bg-gray-50"
              >
                <span className="text-gray-400">
                  <IconSettings />
                </span>
                Settings
              </Link>

              <button
                type="button"
                onClick={openConfirm}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-red-600 transition hover:bg-red-50"
              >
                <IconLogout />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <LogoutConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
