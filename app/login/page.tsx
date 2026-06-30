import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen" style={{ background: "#f5f6fa" }}>
      {/* Left branding panel */}
      <div
        className="hidden min-h-screen lg:flex lg:w-1/2 flex-col justify-between p-10"
        style={{ background: "#1b1f2e" }}
      >
        <div className="flex items-center">
          <Image
            src="/work-dash-brand.png"
            alt="WorkDash"
            width={1061}
            height={175}
            priority
            className="h-7 w-auto object-contain"
          />
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

        <p className="text-[12px] text-white/20">© 2026 WorkDash. Personal use only.</p>
      </div>

      {/* Right login form */}
      <div className="flex min-h-screen w-full items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-95">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center lg:hidden">
            <Image
              src="/work-dash-brand.png"
              alt="WorkDash"
              width={1061}
              height={175}
              priority
              className="h-6 w-auto object-contain"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-500">Masuk ke dashboard monitoring kamu.</p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
