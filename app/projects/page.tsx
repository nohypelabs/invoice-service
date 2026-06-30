"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

const neon = {
  raised: "6px 6px 14px rgba(174,182,204,0.5), -6px -6px 14px rgba(255,255,255,0.85)",
  soft: "4px 4px 10px rgba(174,182,204,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
  inset: "inset 3px 3px 7px rgba(174,182,204,0.4), inset -3px -3px 7px rgba(255,255,255,0.8)",
};

export default function ProjectsPage() {
  const { data: projects, isLoading } = trpc.template.list.useQuery(undefined, {
    retry: false, refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#dce0e8] rounded-[35px] w-48" />
          {[1, 2].map(i => <div key={i} className="h-24 bg-[#dce0e8] rounded-[35px]" />)}
        </div>
      </div>
    );
  }

  const list = projects ?? [];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Projects</h2>
          <p className="text-sm text-gray-400">{list.length} registered</p>
        </div>
        <Link
          href="/projects/new"
          className="px-5 py-2.5 rounded-[20px] text-sm font-medium text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            boxShadow: "4px 4px 10px rgba(59,130,246,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
          }}
        >
          + Register Project
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-[#eef0f5] rounded-[35px] p-16 text-center" style={{ boxShadow: neon.raised }}>
          <div
            className="w-14 h-14 rounded-[20px] bg-[#eef0f5] flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: neon.inset }}
          >
            <span className="text-2xl text-gray-400">◈</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">No projects registered</p>
          <Link
            href="/projects/new"
            className="inline-block px-5 py-2.5 rounded-[20px] text-sm font-medium text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              boxShadow: "4px 4px 10px rgba(59,130,246,0.3), -4px -4px 10px rgba(255,255,255,0.7)",
            }}
          >
            Register your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {list.map(p => (
            <div
              key={p.id as string}
              className="bg-[#eef0f5] rounded-[35px] p-5 hover:bg-[#e2e6ef] transition-all duration-200"
              style={{ boxShadow: neon.raised }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-[20px] bg-[#eef0f5] flex items-center justify-center text-sm font-bold text-blue-600 shrink-0"
                    style={{ boxShadow: neon.soft }}
                  >
                    {(p.name as string).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{p.name as string}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{p.from_name as string} · {p.from_email as string}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-[35px] text-gray-600 font-medium bg-[#eef0f5]" style={{ boxShadow: neon.inset }}>
                    {p.currency as string}
                  </span>
                  <span className="px-2.5 py-1 rounded-[35px] text-gray-600 font-medium bg-[#eef0f5]" style={{ boxShadow: neon.inset }}>
                    {(p.tax_rate as number)}% tax
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 font-mono">ID: {p.id as string}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
