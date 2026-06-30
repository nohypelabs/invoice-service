"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

interface ItemRow {
  description: string;
  quantity: number;
  price: number;
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/60 backdrop-blur-xl rounded-[35px] border border-white/30 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 bg-white/70 backdrop-blur-sm border border-white/30 rounded-[35px] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all duration-200 ${props.className || ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2.5 bg-white/70 backdrop-blur-sm border border-white/30 rounded-[35px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all duration-200 ${props.className || ""}`}
    />
  );
}

export default function NewInvoicePage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: projects } = trpc.template.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const create = trpc.invoice.create.useMutation({
    onSuccess: () => {
      utils.invoice.list.invalidate();
      router.push("/invoices");
    },
  });

  const [projectId, setProjectId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [dueDays, setDueDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ description: "", quantity: 1, price: 0 }]);

  function addItem() {
    setItems(prev => [...prev, { description: "", quantity: 1, price: 0 }]);
  }

  function removeItem(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, field: keyof ItemRow, value: string) {
    setItems(prev => prev.map((item, idx) =>
      idx === i ? { ...item, [field]: field === "description" ? value : Number(value) || 0 } : item,
    ));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync({
      projectId,
      clientName,
      clientEmail: clientEmail || undefined,
      clientAddress: clientAddress || undefined,
      items: items.filter(i => i.description),
      dueDays,
      notes: notes || undefined,
    });
  }

  const projectList = projects ?? [];
  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">New Invoice</h2>
        <p className="text-sm text-gray-500/80">Create and generate a new invoice</p>
      </div>

      {create.error && (
        <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-xl rounded-[35px] border border-red-200/50 text-sm text-red-700">
          {create.error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard>
          <h3 className="font-medium text-gray-900 text-sm mb-4">Project</h3>
          <Select value={projectId} onChange={e => setProjectId(e.target.value)} required>
            <option value="">Select project</option>
            {projectList.map(p => (
              <option key={p.id as string} value={p.id as string}>{p.name as string}</option>
            ))}
          </Select>
          {projectList.length === 0 && (
            <p className="text-xs text-gray-400 mt-2">
              No projects yet.{" "}
              <a href="/projects/new" className="text-blue-600 hover:underline">Register one</a>
            </p>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="font-medium text-gray-900 text-sm mb-4">Client</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Name</label>
              <Input value={clientName} onChange={e => setClientName(e.target.value)} required placeholder="Client name" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Email</label>
              <Input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@example.com" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Due in (days)</label>
              <Input type="number" value={dueDays} onChange={e => setDueDays(Number(e.target.value) || 30)} min={1} />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1.5">Address</label>
            <Input value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="Client address" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 text-sm">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              + Add item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-white/30 backdrop-blur-sm rounded-[35px] border border-white/20">
                <input
                  value={item.description}
                  onChange={e => updateItem(i, "description", e.target.value)}
                  placeholder="Description"
                  required
                  className="flex-1 px-3 py-2 bg-white/50 border border-white/20 rounded-[35px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all duration-200"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => updateItem(i, "quantity", e.target.value)}
                  min={1}
                  className="w-20 px-3 py-2 bg-white/50 border border-white/20 rounded-[35px] text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60"
                  placeholder="Qty"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={e => updateItem(i, "price", e.target.value)}
                  min={0}
                  step="0.01"
                  className="w-28 px-3 py-2 bg-white/50 border border-white/20 rounded-[35px] text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60"
                  placeholder="Price"
                />
                <span className="text-sm text-gray-500 pt-2 w-20 text-right tabular-nums font-medium">
                  {(item.quantity * item.price).toFixed(2)}
                </span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="pt-2 text-gray-400 hover:text-red-500 text-sm transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 mt-4 border-t border-white/20">
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
              <p className="text-xl font-semibold text-gray-900">{subtotal.toFixed(2)}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-medium text-gray-900 text-sm mb-4">Notes</h3>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Payment terms, additional notes..."
            className="w-full px-3.5 py-2.5 bg-white/70 backdrop-blur-sm border border-white/30 rounded-[35px] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all duration-200 resize-none"
          />
        </GlassCard>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700 rounded-[35px] text-sm font-medium hover:bg-white/80 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={create.isPending || projectList.length === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[35px] text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {create.isPending ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
