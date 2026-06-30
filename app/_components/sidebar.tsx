"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard", icon: "◉" },
  { href: "/invoices", label: "Invoices", icon: "▣" },
  { href: "/invoices/new", label: "New Invoice", icon: "⊕" },
  { href: "/projects", label: "Projects", icon: "◈" },
  { href: "/projects/new", label: "Register Project", icon: "⊞" },
] as const;

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-56 min-h-dvh bg-[#eef0f5] flex flex-col">
      <div className="p-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[20px] bg-[#eef0f5] flex items-center justify-center text-sm font-bold text-gray-700"
            style={{ boxShadow: "4px 4px 10px rgba(174,182,204,0.5), -4px -4px 10px rgba(255,255,255,0.85)" }}>
            I
          </div>
          <div>
            <h1 className="font-semibold text-gray-800 text-sm tracking-tight">Invoice Service</h1>
            <p className="text-xs text-gray-400 mt-0.5">Multi-project billing</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-2">
        {NAV.map(({ href, label, icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-[20px] text-sm transition-all duration-200"
              style={{
                color: active ? "#3b82f6" : "#6b7280",
                boxShadow: active
                  ? "inset 3px 3px 7px rgba(174,182,204,0.4), inset -3px -3px 7px rgba(255,255,255,0.8)"
                  : "4px 4px 10px rgba(174,182,204,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <span className="text-base w-5 text-center opacity-60">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <p className="text-xs text-gray-400/70">Invoice Service v0.1</p>
      </div>
    </aside>
  );
}
