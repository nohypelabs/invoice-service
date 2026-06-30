"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
};

export default function InvoicesPage() {
  const { data: invoices, isLoading } = trpc.invoice.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-64" />
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded" />)}
        </div>
      </div>
    );
  }

  const list = invoices ?? [];

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Invoices</h2>
          <p className="text-sm text-gray-500 mt-0.5">{list.length} total</p>
        </div>
        <Link
          href="/invoices/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          + New Invoice
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">No invoices yet</p>
          <Link href="/invoices/new" className="text-blue-600 text-sm hover:underline">
            Create your first invoice
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 font-medium text-gray-600">Invoice</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Client</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Due</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600">PDF</th>
              </tr>
            </thead>
            <tbody>
              {list.map(inv => (
                <tr key={inv.id as string} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">{inv.number as string}</td>
                  <td className="px-5 py-4 text-gray-600">{inv.client_name as string}</td>
                  <td className="px-5 py-4 text-gray-900">{(inv.total as number).toFixed(2)} {inv.currency as string}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inv.status as string] || STATUS_COLORS.draft}`}>
                      {inv.status as string}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{new Date(inv.due_at as string).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <a
                      href={`/api/invoices/${inv.id as string}/pdf`}
                      target="_blank"
                      className="text-blue-600 hover:underline text-xs"
                    >
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
