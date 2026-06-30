"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

const neon = {
  raised: "6px 6px 14px rgba(174,182,204,0.5), -6px -6px 14px rgba(255,255,255,0.85)",
  soft: "4px 4px 10px rgba(174,182,204,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
  inset: "inset 3px 3px 7px rgba(174,182,204,0.4), inset -3px -3px 7px rgba(255,255,255,0.8)",
};

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  draft: { background: "#eef0f5", color: "#92400e", boxShadow: neon.inset },
  sent: { background: "#eef0f5", color: "#1d4ed8", boxShadow: neon.inset },
  paid: { background: "#eef0f5", color: "#047857", boxShadow: neon.inset },
  overdue: { background: "#eef0f5", color: "#b91c1c", boxShadow: neon.inset },
};

export default function InvoicesPage() {
  const { data: invoices, isLoading } = trpc.invoice.list.useQuery(undefined, {
    retry: false, refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#dce0e8] rounded-[35px] w-48" />
          <div className="h-4 bg-[#dce0e8] rounded-[35px] w-64" />
          {[1, 2, 3].map(i => <div key={i} className="h-14 bg-[#dce0e8] rounded-[35px]" />)}
        </div>
      </div>
    );
  }

  const list = invoices ?? [];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Invoices</h2>
          <p className="text-sm text-gray-400">{list.length} total</p>
        </div>
        <Link
          href="/invoices/new"
          className="px-5 py-2.5 rounded-[20px] text-sm font-medium text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            boxShadow: "4px 4px 10px rgba(59,130,246,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
          }}
        >
          + New Invoice
        </Link>
      </div>

      {list.length === 0 ? (
        <div
          className="bg-[#eef0f5] rounded-[35px] p-16 text-center"
          style={{ boxShadow: neon.raised }}
        >
          <div
            className="w-14 h-14 rounded-[20px] bg-[#eef0f5] flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: neon.inset }}
          >
            <span className="text-2xl text-gray-400">▣</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">No invoices yet</p>
          <Link
            href="/invoices/new"
            className="inline-block px-5 py-2.5 rounded-[20px] text-sm font-medium text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              boxShadow: "4px 4px 10px rgba(59,130,246,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
            }}
          >
            Create your first invoice
          </Link>
        </div>
      ) : (
        <div
          className="bg-[#eef0f5] rounded-[35px] overflow-hidden"
          style={{ boxShadow: neon.raised }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">Invoice</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">Due</th>
                <th className="text-right px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">PDF</th>
              </tr>
            </thead>
            <tbody>
              {list.map((inv, i) => (
                <tr
                  key={inv.id as string}
                  className="border-t border-[#dce0e8] transition-colors duration-150 hover:bg-[#e2e6ef]"
                >
                  <td className="px-5 py-4 font-medium text-gray-800">{inv.number as string}</td>
                  <td className="px-5 py-4 text-gray-500">{inv.client_name as string}</td>
                  <td className="px-5 py-4 text-gray-800 font-medium">
                    {(inv.total as number).toFixed(2)} <span className="text-gray-400 text-xs">{inv.currency as string}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-block px-3 py-1 rounded-[35px] text-xs font-medium"
                      style={STATUS_STYLES[inv.status as string] || STATUS_STYLES.draft}
                    >
                      {inv.status as string}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{new Date(inv.due_at as string).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <a
                      href={`/api/invoices/${inv.id as string}/pdf`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-700 text-xs font-medium transition-colors"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-[8px] bg-[#eef0f5] flex items-center justify-center text-[8px]"
                        style={{ boxShadow: neon.soft }}
                      >
                        ↓
                      </span>
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
