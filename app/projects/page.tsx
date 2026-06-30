"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

export default function ProjectsPage() {
  const { data: projects, isLoading } = trpc.template.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/60 rounded-[35px] w-48" />
          {[1, 2].map(i => <div key={i} className="h-24 bg-white/40 rounded-[35px]" />)}
        </div>
      </div>
    );
  }

  const list = projects ?? [];

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Projects</h2>
          <p className="text-sm text-gray-500/80">{list.length} registered</p>
        </div>
        <Link
          href="/projects/new"
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[35px] text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
        >
          + Register Project
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-xl rounded-[35px] border border-white/30 shadow-sm p-16 text-center">
          <div className="w-14 h-14 rounded-[35px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">◈</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">No projects registered</p>
          <Link
            href="/projects/new"
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[35px] text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
          >
            Register your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {list.map(p => (
            <div
              key={p.id as string}
              className="bg-white/60 backdrop-blur-xl rounded-[35px] border border-white/30 shadow-sm p-5 hover:bg-white/70 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[35px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
                    {(p.name as string).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{p.name as string}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{p.from_name as string} · {p.from_email as string}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-white/60 border border-white/20 rounded-[35px] text-gray-600 font-medium">
                    {p.currency as string}
                  </span>
                  <span className="px-2.5 py-1 bg-white/60 border border-white/20 rounded-[35px] text-gray-600 font-medium">
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
