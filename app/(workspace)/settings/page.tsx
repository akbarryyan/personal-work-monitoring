import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/actions/auth";
import { ProfileForm } from "./_components/profile-form";
import { PasswordForm } from "./_components/password-form";

export const metadata: Metadata = { title: "Settings" };

function getInitials(name: string, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function formatDate(d: string | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const fullName: string =
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "";
  const displayName = fullName || email.split("@")[0];
  const initials = getInitials(fullName, email);
  const createdAt = user?.created_at;
  const lastSignIn = user?.last_sign_in_at;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <nav className="mt-1 flex items-center gap-1.5 text-[12px] text-gray-400">
          <span>Home</span>
          <span>»</span>
          <span className="font-medium text-gray-600">Settings</span>
        </nav>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 items-start">
        {/* Left column */}
        <div className="space-y-5">
          <ProfileForm initials={initials} currentName={displayName} email={email} />

          {/* Account info */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-[15px] font-semibold text-gray-900">Info Akun</h2>
              <p className="mt-0.5 text-[12px] text-gray-400">Detail sesi dan akun kamu</p>
            </div>
            <div className="divide-y divide-gray-100 px-6">
              {[
                { label: "Email", value: email },
                { label: "Bergabung sejak", value: formatDate(createdAt) },
                { label: "Login terakhir", value: formatDate(lastSignIn) },
                { label: "Provider", value: user?.app_metadata?.provider ?? "email" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3.5">
                  <span className="text-[13px] text-gray-500">{label}</span>
                  <span className="text-[13px] font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <PasswordForm />

          {/* Danger zone */}
          <div className="rounded-xl border border-red-200 bg-white shadow-sm">
            <div className="border-b border-red-100 px-6 py-4">
              <h2 className="text-[15px] font-semibold text-red-700">Danger Zone</h2>
              <p className="mt-0.5 text-[12px] text-red-400">Tindakan yang tidak bisa dibatalkan</p>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-gray-800">Logout</p>
                  <p className="mt-0.5 text-[12px] text-gray-400">Keluar dari sesi aktif sekarang</p>
                </div>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-lg border border-red-300 px-4 py-2 text-[13px] font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
