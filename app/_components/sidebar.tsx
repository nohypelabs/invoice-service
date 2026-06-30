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
    <aside className="w-56 min-h-dvh bg-white/50 backdrop-blur-xl border-r border-white/30 flex flex-col">
      <div className="p-5 border-b border-white/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            I
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm tracking-tight">Invoice Service</h1>
            <p className="text-xs text-gray-400/80 mt-0.5">Multi-project billing</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-white/80 shadow-sm text-blue-700 font-medium backdrop-blur-sm"
                  : "text-gray-500 hover:bg-white/40 hover:text-gray-800"
              }`}
            >
              <span className="text-base w-5 text-center opacity-70">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/20">
        <p className="text-xs text-gray-400/70">Invoice Service v0.1</p>
      </div>
    </aside>
  );
}
