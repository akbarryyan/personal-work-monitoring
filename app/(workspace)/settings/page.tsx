import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <nav className="mt-1 flex items-center gap-1.5 text-[12px] text-gray-400">
          <span>Home</span>
          <span>»</span>
          <span className="text-gray-600 font-medium">Settings</span>
        </nav>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-semibold text-gray-900">Account Preferences</h2>
          <p className="mt-2 text-[13px] leading-6 text-gray-500">
            Nantinya berisi data profil, informasi sesi login, dan opsi akun yang relevan untuk aplikasi pribadi ini.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-semibold text-gray-900">Work Preferences</h2>
          <p className="mt-2 text-[13px] leading-6 text-gray-500">
            Default project, preferensi tampilan, atau pengaturan ringkasan mingguan.
          </p>
        </div>
      </div>
    </div>
  );
}
