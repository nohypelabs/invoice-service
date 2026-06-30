"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

interface ItemRow { description: string; quantity: number; price: number }

const neon = {
  raised: "6px 6px 14px rgba(174,182,204,0.5), -6px -6px 14px rgba(255,255,255,0.85)",
  soft: "4px 4px 10px rgba(174,182,204,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
  inset: "inset 3px 3px 7px rgba(174,182,204,0.4), inset -3px -3px 7px rgba(255,255,255,0.8)",
};

export default function NewInvoicePage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: projects } = trpc.template.list.useQuery(undefined, {
    retry: false, refetchOnWindowFocus: false,
  });
  const create = trpc.invoice.create.useMutation({
    onSuccess: () => { utils.invoice.list.invalidate(); router.push("/invoices"); },
  });

  const [projectId, setProjectId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [dueDays, setDueDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ description: "", quantity: 1, price: 0 }]);

  function addItem() { setItems(prev => [...prev, { description: "", quantity: 1, price: 0 }]); }
  function removeItem(i: number) { setItems(prev => prev.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: keyof ItemRow, value: string) {
    setItems(prev => prev.map((item, idx) =>
      idx === i ? { ...item, [field]: field === "description" ? value : Number(value) || 0 } : item,
    ));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync({
      projectId, clientName, clientEmail: clientEmail || undefined,
      clientAddress: clientAddress || undefined, items: items.filter(i => i.description),
      dueDays, notes: notes || undefined,
    });
  }

  const projectList = projects ?? [];
  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">New Invoice</h2>
        <p className="text-sm text-gray-400">Create and generate a new invoice</p>
      </div>

      {create.error && (
        <div
          className="mb-6 p-4 rounded-[35px] text-sm text-red-700"
          style={{ background: "#eef0f5", boxShadow: neon.inset }}
        >
          {create.error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#eef0f5] rounded-[35px] p-6" style={{ boxShadow: neon.raised }}>
          <h3 className="font-medium text-gray-800 text-sm mb-4">Project</h3>
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] focus:outline-none transition-all duration-200 appearance-none"
            style={{ boxShadow: neon.inset }}
          >
            <option value="">Select project</option>
            {projectList.map(p => (
              <option key={p.id as string} value={p.id as string}>{p.name as string}</option>
            ))}
          </select>
          {projectList.length === 0 && (
            <p className="text-xs text-gray-400 mt-2">
              No projects yet. <a href="/projects/new" className="text-blue-500 hover:underline">Register one</a>
            </p>
          )}
        </div>

        <div className="bg-[#eef0f5] rounded-[35px] p-6" style={{ boxShadow: neon.raised }}>
          <h3 className="font-medium text-gray-800 text-sm mb-4">Client</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Name</label>
              <input
                value={clientName} onChange={e => setClientName(e.target.value)} required
                placeholder="Client name"
                className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] placeholder-gray-400 focus:outline-none transition-all duration-200"
                style={{ boxShadow: neon.inset }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email</label>
              <input
                type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] placeholder-gray-400 focus:outline-none transition-all duration-200"
                style={{ boxShadow: neon.inset }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Due in (days)</label>
              <input
                type="number" value={dueDays} onChange={e => setDueDays(Number(e.target.value) || 30)} min={1}
                className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] placeholder-gray-400 focus:outline-none transition-all duration-200"
                style={{ boxShadow: neon.inset }}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs text-gray-400 mb-1.5">Address</label>
            <input
              value={clientAddress} onChange={e => setClientAddress(e.target.value)}
              placeholder="Client address"
              className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] placeholder-gray-400 focus:outline-none transition-all duration-200"
              style={{ boxShadow: neon.inset }}
            />
          </div>
        </div>

        <div className="bg-[#eef0f5] rounded-[35px] p-6" style={{ boxShadow: neon.raised }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800 text-sm">Items</h3>
            <button type="button" onClick={addItem} className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors">
              + Add item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-[#eef0f5] rounded-[35px]" style={{ boxShadow: neon.soft }}>
                <input
                  value={item.description} onChange={e => updateItem(i, "description", e.target.value)}
                  placeholder="Description" required
                  className="flex-1 px-3 py-2 rounded-[35px] text-sm bg-[#eef0f5] placeholder-gray-400 focus:outline-none"
                  style={{ boxShadow: neon.inset }}
                />
                <input
                  type="number" value={item.quantity} onChange={e => updateItem(i, "quantity", e.target.value)} min={1}
                  className="w-20 px-3 py-2 rounded-[35px] text-sm text-center bg-[#eef0f5] focus:outline-none"
                  style={{ boxShadow: neon.inset }}
                />
                <input
                  type="number" value={item.price} onChange={e => updateItem(i, "price", e.target.value)} min={0} step="0.01"
                  className="w-28 px-3 py-2 rounded-[35px] text-sm text-right bg-[#eef0f5] focus:outline-none"
                  style={{ boxShadow: neon.inset }}
                />
                <span className="text-sm text-gray-500 pt-2 w-20 text-right tabular-nums font-medium">
                  {(item.quantity * item.price).toFixed(2)}
                </span>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="pt-2 text-gray-400 hover:text-red-500 text-sm transition-colors">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 mt-4 border-t border-[#dce0e8]">
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Subtotal</p>
              <p className="text-xl font-semibold text-gray-800">{subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#eef0f5] rounded-[35px] p-6" style={{ boxShadow: neon.raised }}>
          <h3 className="font-medium text-gray-800 text-sm mb-4">Notes</h3>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="Payment terms, additional notes..."
            className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] placeholder-gray-400 focus:outline-none transition-all duration-200 resize-none"
            style={{ boxShadow: neon.inset }}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button" onClick={() => router.back()}
            className="px-5 py-2.5 rounded-[20px] text-sm font-medium text-gray-700 bg-[#eef0f5] transition-all duration-200"
            style={{ boxShadow: neon.soft }}
          >
            Cancel
          </button>
          <button
            type="submit" disabled={create.isPending || projectList.length === 0}
            className="px-5 py-2.5 rounded-[20px] text-sm font-medium text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              boxShadow: "4px 4px 10px rgba(59,130,246,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
            }}
          >
            {create.isPending ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
