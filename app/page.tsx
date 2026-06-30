"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stat {
  label: string;
  value: string;
  sub: string;
}

export default function Home() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/invoices").then(r => r.json()).catch(() => []),
      fetch("/api/templates").then(r => r.json()).catch(() => []),
    ]).then(([invoices, projects]) => {
      const total = Array.isArray(invoices) ? invoices.length : 0;
      const paid = Array.isArray(invoices) ? invoices.filter((i: Record<string, unknown>) => i.status === "paid").length : 0;
      const overdue = Array.isArray(invoices) ? invoices.filter((i: Record<string, unknown>) => i.status === "overdue").length : 0;
      const projectCount = Array.isArray(projects) ? projects.length : 0;

      setStats([
        { label: "Total Invoices", value: String(total), sub: `${paid} paid · ${overdue} overdue` },
        { label: "Projects", value: String(projectCount), sub: "registered" },
        { label: "API Endpoints", value: "6", sub: "REST endpoints" },
      ]);
    });
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h2>
      <p className="text-sm text-gray-500 mb-8">Overview of your invoice service</p>

      <div className="grid grid-cols-3 gap-5 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className="text-3xl font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex gap-3">
          <Link
            href="/invoices/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            New Invoice
          </Link>
          <Link
            href="/projects/new"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Register Project
          </Link>
          <Link
            href="/invoices"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            View Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}
