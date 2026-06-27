"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="block text-[13px] font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 placeholder:text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-[13px] font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
        />
      </div>

      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-10 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Masuk…" : "Sign in"}
      </button>
    </form>
  );
}
