"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all duration-200 ${props.className || ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2.5 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all duration-200 ${props.className || ""}`}
    />
  );
}

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
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Register Project</h2>
        <p className="text-sm text-gray-500/80">Configure a project for invoice generation</p>
      </div>

      {create.error && (
        <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-xl rounded-2xl border border-red-200/50 text-sm text-red-700">
          {create.error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard>
          <h3 className="font-medium text-gray-900 text-sm mb-4">Project Info</h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Project Name</label>
            <Input
              value={form.name}
              onChange={e => update("name", e.target.value)}
              required
              placeholder="e.g. elon-sniper-bot"
            />
            {form.name && (
              <p className="text-xs text-gray-400 mt-2">
                ID: <span className="font-mono text-gray-500 bg-white/40 px-2 py-0.5 rounded-md">
                  {form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
                </span>
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-medium text-gray-900 text-sm mb-4">Sender Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Name</label>
              <Input value={form.fromName} onChange={e => update("fromName", e.target.value)} required placeholder="Your name / company" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Address</label>
              <Input value={form.fromAddress} onChange={e => update("fromAddress", e.target.value)} required placeholder="Your address" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Email</label>
              <Input type="email" value={form.fromEmail} onChange={e => update("fromEmail", e.target.value)} required placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Currency</label>
              <Select value={form.currency} onChange={e => update("currency", e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SOL">SOL</option>
                <option value="USDC">USDC</option>
                <option value="IDR">IDR</option>
              </Select>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-medium text-gray-900 text-sm mb-4">Tax</h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Tax Rate (%)</label>
            <Input
              type="number"
              value={form.taxRate}
              onChange={e => update("taxRate", e.target.value)}
              min={0}
              max={100}
              step="0.1"
              className="w-32"
            />
          </div>
        </GlassCard>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700 rounded-xl text-sm font-medium hover:bg-white/80 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={create.isPending}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {create.isPending ? "Registering..." : "Register Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
