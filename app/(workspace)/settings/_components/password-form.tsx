"use client";

import { useActionState, useEffect, useRef } from "react";
import { updatePasswordAction, type SettingsFormState } from "@/app/actions/settings";
import { useToast } from "@/components/providers/toast-provider";

const INITIAL: SettingsFormState = { error: null, success: false };

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 placeholder:text-gray-400";

export function PasswordForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, INITIAL);
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (!state.success) { handled.current = false; return; }
    if (handled.current) return;
    handled.current = true;
    formRef.current?.reset();
    toast("Password berhasil diperbarui.");
  }, [state.success, toast]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-[15px] font-semibold text-gray-900">Keamanan</h2>
        <p className="mt-0.5 text-[12px] text-gray-400">Ubah password akun kamu</p>
      </div>

      <form ref={formRef} action={action} className="px-6 py-5 space-y-4">
        {state.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
            {state.error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-gray-600">
            Password Baru
          </label>
          <input
            name="new_password"
            type="password"
            required
            minLength={8}
            placeholder="Minimal 8 karakter…"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-gray-600">
            Konfirmasi Password Baru
          </label>
          <input
            name="confirm_password"
            type="password"
            required
            placeholder="Ulangi password baru…"
            className={inputClass}
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-gray-900 disabled:opacity-60"
          >
            {pending && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {pending ? "Menyimpan…" : "Ubah Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
