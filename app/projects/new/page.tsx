"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

const neon = {
  raised: "6px 6px 14px rgba(174,182,204,0.5), -6px -6px 14px rgba(255,255,255,0.85)",
  soft: "4px 4px 10px rgba(174,182,204,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
  inset: "inset 3px 3px 7px rgba(174,182,204,0.4), inset -3px -3px 7px rgba(255,255,255,0.8)",
};

export default function RegisterProjectPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.template.create.useMutation({
    onSuccess: () => { utils.template.list.invalidate(); router.push("/projects"); },
  });

  const [form, setForm] = useState({
    name: "", fromName: "", fromAddress: "", fromEmail: "", taxRate: 0, currency: "USD",
  });

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: field === "taxRate" ? Number(value) || 0 : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync({
      ...form,
      id: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    });
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Register Project</h2>
        <p className="text-sm text-gray-400">Configure a project for invoice generation</p>
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
          <h3 className="font-medium text-gray-800 text-sm mb-4">Project Info</h3>
          <input
            value={form.name} onChange={e => update("name", e.target.value)} required
            placeholder="e.g. elon-sniper-bot"
            className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] placeholder-gray-400 focus:outline-none transition-all duration-200"
            style={{ boxShadow: neon.inset }}
          />
          {form.name && (
            <p className="text-xs text-gray-400 mt-2">
              ID: <span className="font-mono text-gray-500 bg-[#e2e6ef] px-2 py-0.5 rounded-[35px]">
                {form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
              </span>
            </p>
          )}
        </div>

        <div className="bg-[#eef0f5] rounded-[35px] p-6" style={{ boxShadow: neon.raised }}>
          <h3 className="font-medium text-gray-800 text-sm mb-4">Sender Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Name</label>
              <input
                value={form.fromName} onChange={e => update("fromName", e.target.value)} required
                placeholder="Your name / company"
                className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] placeholder-gray-400 focus:outline-none"
                style={{ boxShadow: neon.inset }}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Address</label>
              <input
                value={form.fromAddress} onChange={e => update("fromAddress", e.target.value)} required
                placeholder="Your address"
                className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] placeholder-gray-400 focus:outline-none"
                style={{ boxShadow: neon.inset }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email</label>
              <input
                type="email" value={form.fromEmail} onChange={e => update("fromEmail", e.target.value)} required
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] placeholder-gray-400 focus:outline-none"
                style={{ boxShadow: neon.inset }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Currency</label>
              <select
                value={form.currency} onChange={e => update("currency", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] focus:outline-none appearance-none"
                style={{ boxShadow: neon.inset }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SOL">SOL</option>
                <option value="USDC">USDC</option>
                <option value="IDR">IDR</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#eef0f5] rounded-[35px] p-6" style={{ boxShadow: neon.raised }}>
          <h3 className="font-medium text-gray-800 text-sm mb-4">Tax</h3>
          <input
            type="number" value={form.taxRate} onChange={e => update("taxRate", e.target.value)}
            min={0} max={100} step="0.1" className="w-32 px-3.5 py-2.5 rounded-[35px] text-sm text-gray-700 bg-[#eef0f5] focus:outline-none"
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
            type="submit" disabled={create.isPending}
            className="px-5 py-2.5 rounded-[20px] text-sm font-medium text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              boxShadow: "4px 4px 10px rgba(59,130,246,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
            }}
          >
            {create.isPending ? "Registering..." : "Register Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
