"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-amber-100/80 text-amber-700 border border-amber-200/50",
  sent: "bg-blue-100/80 text-blue-700 border border-blue-200/50",
  paid: "bg-emerald-100/80 text-emerald-700 border border-emerald-200/50",
  overdue: "bg-red-100/80 text-red-700 border border-red-200/50",
};

export default function InvoicesPage() {
  const { data: invoices, isLoading } = trpc.invoice.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/60 rounded-2xl w-48" />
          <div className="h-4 bg-white/40 rounded-xl w-64" />
          {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white/40 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const list = invoices ?? [];

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Invoices</h2>
          <p className="text-sm text-gray-500/80">{list.length} total</p>
        </div>
        <Link
          href="/invoices/new"
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
        >
          + New Invoice
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">▣</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">No invoices yet</p>
          <Link
            href="/invoices/new"
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
          >
            Create your first invoice
          </Link>
        </div>
      ) : (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20 bg-white/30">
                <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Invoice</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Due</th>
                <th className="text-right px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">PDF</th>
              </tr>
            </thead>
            <tbody>
              {list.map((inv, i) => (
                <tr
                  key={inv.id as string}
                  className={`border-b border-white/10 hover:bg-white/30 transition-colors duration-150 ${i % 2 === 0 ? "bg-white/10" : ""}`}
                >
                  <td className="px-5 py-4 font-medium text-gray-900">{inv.number as string}</td>
                  <td className="px-5 py-4 text-gray-600">{inv.client_name as string}</td>
                  <td className="px-5 py-4 text-gray-900 font-medium">
                    {(inv.total as number).toFixed(2)} <span className="text-gray-400 text-xs">{inv.currency as string}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${STATUS_STYLES[inv.status as string] || STATUS_STYLES.draft}`}>
                      {inv.status as string}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{new Date(inv.due_at as string).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <a
                      href={`/api/invoices/${inv.id as string}/pdf`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                    >
                      <span className="w-3.5 h-3.5 rounded bg-blue-100 flex items-center justify-center text-[8px]">↓</span>
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
