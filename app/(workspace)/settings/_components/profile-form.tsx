"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateProfileAction, type SettingsFormState } from "@/app/actions/settings";
import { useToast } from "@/components/providers/toast-provider";

const INITIAL: SettingsFormState = { error: null, success: false };

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 placeholder:text-gray-400";

export function ProfileForm({
  initials,
  currentName,
  email,
}: {
  initials: string;
  currentName: string;
  email: string;
}) {
  const [state, action, pending] = useActionState(updateProfileAction, INITIAL);
  const toast = useToast();
  const handled = useRef(false);

  useEffect(() => {
    if (!state.success) { handled.current = false; return; }
    if (handled.current) return;
    handled.current = true;
    toast("Profil berhasil diperbarui.");
  }, [state.success, toast]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-[15px] font-semibold text-gray-900">Profil</h2>
        <p className="mt-0.5 text-[12px] text-gray-400">Nama yang tampil di sidebar dan header</p>
      </div>

      <form action={action} className="px-6 py-5 space-y-5">
        {state.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
            {state.error}
          </div>
        )}

        {/* Avatar preview */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[18px] font-bold text-white">
            {initials}
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-700">{currentName}</p>
            <p className="text-[12px] text-gray-400">{email}</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-gray-600">
            Nama Lengkap
          </label>
          <input
            name="full_name"
            type="text"
            required
            defaultValue={currentName}
            placeholder="Masukkan nama lengkap…"
            className={inputClass}
          />
        </div>

        {/* Email — read-only */}
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-[13px] text-gray-500 outline-none cursor-not-allowed"
          />
          <p className="mt-1 text-[11px] text-gray-400">Email tidak dapat diubah.</p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {pending && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {pending ? "Menyimpan…" : "Simpan Profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
