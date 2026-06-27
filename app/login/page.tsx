import type { Metadata } from "next";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen" style={{ background: "#f5f6fa" }}>
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-105 lg:shrink-0 flex-col justify-between p-10"
        style={{ background: "#1b1f2e" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-[16px] font-bold tracking-wide text-white">WorkMon</span>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400">
            Personal Work Monitoring
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-white">
            Monitor your work, stay focused, ship faster.
          </h1>
          <p className="mt-4 text-[14px] leading-7 text-white/50">
            Dashboard pribadi untuk memantau task harian, overdue, in-progress, dan blocked — semuanya dalam satu tampilan.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { label: "Dashboard monitoring", desc: "Ringkasan kondisi kerja setiap hari" },
              { label: "Project-based tracking", desc: "Kelompokkan task per project" },
              { label: "Status & priority", desc: "Fokus pada task yang paling penting" },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">{f.label}</p>
                  <p className="text-[12px] text-white/40">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[12px] text-white/20">© 2026 WorkMon. Personal use only.</p>
      </div>

      {/* Right login form */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-95">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[15px] font-bold text-gray-900">WorkMon</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-500">Masuk ke dashboard monitoring kamu.</p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
