"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

export default function Home() {
  const { data: invoices } = trpc.invoice.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const { data: projects } = trpc.template.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const total = invoices?.length ?? 0;
  const paid = invoices?.filter(i => i.status === "paid").length ?? 0;
  const overdue = invoices?.filter(i => i.status === "overdue").length ?? 0;
  const projectCount = projects?.length ?? 0;

  const stats = [
    {
      label: "Total Invoices",
      value: String(total),
      sub: `${paid} paid · ${overdue} overdue`,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Projects",
      value: String(projectCount),
      sub: "registered",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-sm text-gray-500/80">Overview of your invoice service</p>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10">
        {stats.map(s => (
          <div
            key={s.label}
            className="relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-6"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`} />
            <p className="text-sm text-gray-500 mb-1.5">{s.label}</p>
            <p className="text-3xl font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-6">
        <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex gap-3">
          <Link
            href="/invoices/new"
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
          >
            New Invoice
          </Link>
          <Link
            href="/projects/new"
            className="px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/30 text-gray-700 rounded-xl text-sm font-medium hover:bg-white/90 transition-all duration-200"
          >
            Register Project
          </Link>
          <Link
            href="/invoices"
            className="px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/30 text-gray-700 rounded-xl text-sm font-medium hover:bg-white/90 transition-all duration-200"
          >
            View Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}
