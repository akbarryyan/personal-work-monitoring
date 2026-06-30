"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const C = {
  bg: "#1b1e2f",
  activeBg: "rgba(255,255,255,0.07)",
  sectionLabel: "rgba(255,255,255,0.22)",
  textActive: "#ffffff",
  textMuted: "rgba(255,255,255,0.55)",
  textBottom: "rgba(255,255,255,0.68)",
  chevron: "rgba(255,255,255,0.28)",
  divide: "rgba(255,255,255,0.07)",
};

/* ── Icons ── */
function IconDashboard() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconTasks() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function IconProjects() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

type SidebarUser = { name: string; email: string; initials: string };

export function AppSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isDash = pathname === "/dashboard";
  const isTasks = pathname.startsWith("/tasks");
  const isProjects = pathname.startsWith("/projects");
  const isSettings = pathname.startsWith("/settings");

  const navItem = (
    active: boolean,
    href: string,
    icon: React.ReactNode,
    label: string
  ) => (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center rounded-lg px-3 py-2.25 text-[13.5px] transition-colors ${collapsed ? "justify-center" : "gap-2.5"}`}
      style={{
        background: active ? C.activeBg : "transparent",
        color: active ? C.textActive : C.textMuted,
        fontWeight: active ? 600 : 400,
      }}
    >
      <span style={{ color: active ? C.textActive : C.chevron, flexShrink: 0 }}>
        {icon}
      </span>
      {!collapsed && (
        <>
          {label}
          <span className="ml-auto text-[11px]" style={{ color: C.chevron }}>
            {active ? "—" : "+"}
          </span>
        </>
      )}
    </Link>
  );

  return (
    <aside
      className="flex h-full shrink-0 flex-col overflow-hidden transition-[width] duration-300"
      style={{
        width: collapsed ? 64 : 255,
        background: C.bg,
        fontFamily: "'Google Sans Flex', sans-serif",
      }}
    >
      {/* ── Logo ── */}
      <div
        className={`flex h-15 shrink-0 items-center ${collapsed ? "justify-center px-3" : "gap-3 px-4"}`}
        style={{ borderBottom: `1px solid ${C.divide}` }}
      >
        {collapsed ? (
          /* Expand button — shown only when collapsed */
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/8"
            style={{ color: C.chevron }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M15 3v18" />
            </svg>
          </button>
        ) : (
          <>
            {/* Brand image */}
            <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-lg px-2 py-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/work-dash-brand.png" alt="WorkDash" className="h-5 w-auto object-contain" />
            </div>

            {/* Collapse button */}
            <button
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/8"
              style={{ color: C.chevron }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 pb-2 pt-2">
        {!collapsed && (
          <p
            className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase"
            style={{ color: C.sectionLabel, letterSpacing: "0.2em" }}
          >
            Main
          </p>
        )}

        {navItem(isDash, "/dashboard", <IconDashboard />, "Dashboard")}
        {navItem(isTasks, "/tasks", <IconTasks />, "Tasks")}
        {navItem(isProjects, "/projects", <IconProjects />, "Projects")}

        <div className="mx-1 my-2.5" style={{ borderTop: `1px solid ${C.divide}` }} />

        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center rounded-lg px-3 py-2.25 text-[13.5px] transition-colors ${collapsed ? "justify-center" : "gap-2.5"}`}
          style={{
            background: isSettings ? C.activeBg : "transparent",
            color: isSettings ? C.textActive : C.textBottom,
            fontWeight: isSettings ? 600 : 400,
          }}
        >
          <IconSettings />
          {!collapsed && "Settings"}
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center rounded-lg px-3 py-2.25 text-[13.5px] transition-colors hover:text-white ${collapsed ? "justify-center" : "gap-2.5"}`}
            style={{ color: C.textBottom }}
          >
            <IconLogout />
            {!collapsed && "Logout"}
          </button>
        </form>
      </nav>

      {/* ── User card ── */}
      <UserCard user={user} collapsed={collapsed} />
    </aside>
  );
}

function UserCard({
  user,
  collapsed,
}: {
  user: SidebarUser;
  collapsed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!collapsed) return;
    queueMicrotask(() => setOpen(false));
  }, [collapsed]);

  return (
    <div ref={ref} className="relative p-2" style={{ borderTop: `1px solid ${C.divide}` }}>
      {/* Dropdown */}
      {open && !collapsed && (
        <div
          className="absolute bottom-full left-2 right-2 mb-2 overflow-hidden rounded-xl border py-1 shadow-2xl"
          style={{ background: "#252840", borderColor: "rgba(255,255,255,0.10)" }}
        >
          <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ borderBottom: `1px solid ${C.divide}` }}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[13px] font-bold text-white">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">{user.name}</p>
              <p className="truncate text-[11px]" style={{ color: C.chevron }}>{user.email}</p>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-white/8"
              style={{ color: C.textBottom }}
            >
              <IconSettings />
              Settings
            </Link>

            <div style={{ borderTop: `1px solid ${C.divide}`, margin: "4px 0" }} />

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-white/8"
                style={{ color: "rgba(248,113,113,0.9)" }}
              >
                <IconLogout />
                Logout
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={collapsed ? user.name : undefined}
        className={`flex w-full items-center rounded-lg p-2 transition-colors hover:bg-white/5 ${collapsed ? "justify-center" : "gap-2.5"}`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[12px] font-bold text-white">
          {user.initials}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[13px]" style={{ color: C.textActive, fontWeight: 600 }}>
                {user.name}
              </p>
              <p className="truncate text-[11px]" style={{ color: C.chevron }}>
                {user.email}
              </p>
            </div>
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: C.chevron, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "none" }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
