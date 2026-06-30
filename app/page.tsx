"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

const neon = {
  raised: "6px 6px 14px rgba(174,182,204,0.5), -6px -6px 14px rgba(255,255,255,0.85)",
  soft: "4px 4px 10px rgba(174,182,204,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
};

export default function Home() {
  const { data: invoices } = trpc.invoice.list.useQuery(undefined, {
    retry: false, refetchOnWindowFocus: false,
  });
  const { data: projects } = trpc.template.list.useQuery(undefined, {
    retry: false, refetchOnWindowFocus: false,
  });

  const total = invoices?.length ?? 0;
  const paid = invoices?.filter(i => i.status === "paid").length ?? 0;
  const overdue = invoices?.filter(i => i.status === "overdue").length ?? 0;
  const projectCount = projects?.length ?? 0;

  const stats = [
    { label: "Total Invoices", value: String(total), sub: `${paid} paid · ${overdue} overdue` },
    { label: "Projects", value: String(projectCount), sub: "registered" },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h2>
        <p className="text-sm text-gray-400">Overview of your invoice service</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        {stats.map(s => (
          <div
            key={s.label}
            className="bg-[#eef0f5] rounded-[35px] p-6"
            style={{ boxShadow: neon.raised }}
          >
            <p className="text-sm text-gray-400 mb-1.5">{s.label}</p>
            <p className="text-3xl font-semibold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div
        className="bg-[#eef0f5] rounded-[35px] p-6"
        style={{ boxShadow: neon.soft }}
      >
        <h3 className="font-medium text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex gap-3">
          <Link
            href="/invoices/new"
            className="px-5 py-2.5 rounded-[20px] text-sm font-medium text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              boxShadow: "4px 4px 10px rgba(59,130,246,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
            }}
          >
            New Invoice
          </Link>
          <Link
            href="/projects/new"
            className="px-5 py-2.5 rounded-[20px] text-sm font-medium text-gray-700 bg-[#eef0f5] transition-all duration-200"
            style={{ boxShadow: neon.soft }}
          >
            Register Project
          </Link>
          <Link
            href="/invoices"
            className="px-5 py-2.5 rounded-[20px] text-sm font-medium text-gray-700 bg-[#eef0f5] transition-all duration-200"
            style={{ boxShadow: neon.soft }}
          >
            View Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}
