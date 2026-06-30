"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

export default function RegisterProjectPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.template.create.useMutation({
    onSuccess: () => {
      utils.template.list.invalidate();
      router.push("/projects");
    },
  });

  const [form, setForm] = useState({
    name: "",
    fromName: "",
    fromAddress: "",
    fromEmail: "",
    taxRate: 0,
    currency: "USD",
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
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Register Project</h2>
      <p className="text-sm text-gray-500 mb-8">Configure a project for invoice generation</p>

      {create.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {create.error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h3 className="font-medium text-gray-900 text-sm">Project Info</h3>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Project Name</label>
            <input
              value={form.name}
              onChange={e => update("name", e.target.value)}
              required
              placeholder="e.g. elon-sniper-bot"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {form.name && (
              <p className="text-xs text-gray-400 mt-1">
                ID: <span className="font-mono text-gray-500">{form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}</span>
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h3 className="font-medium text-gray-900 text-sm">Sender Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1.5">Name</label>
              <input
                value={form.fromName}
                onChange={e => update("fromName", e.target.value)}
                required
                placeholder="Your name / company"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1.5">Address</label>
              <input
                value={form.fromAddress}
                onChange={e => update("fromAddress", e.target.value)}
                required
                placeholder="Your address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={form.fromEmail}
                onChange={e => update("fromEmail", e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Currency</label>
              <select
                value={form.currency}
                onChange={e => update("currency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h3 className="font-medium text-gray-900 text-sm">Tax</h3>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Tax Rate (%)</label>
            <input
              type="number"
              value={form.taxRate}
              onChange={e => update("taxRate", e.target.value)}
              min={0}
              max={100}
              step="0.1"
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={create.isPending}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {create.isPending ? "Registering..." : "Register Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
