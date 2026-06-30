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
    <aside className="w-56 min-h-dvh bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <h1 className="font-semibold text-gray-900 text-sm tracking-tight">Invoice Service</h1>
        <p className="text-xs text-gray-400 mt-0.5">Multi-project billing</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">Invoice Service v0.1</p>
      </div>
    </aside>
  );
}
