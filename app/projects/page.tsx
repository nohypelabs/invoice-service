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
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          {[1, 2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const list = projects ?? [];

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500 mt-0.5">{list.length} registered</p>
        </div>
        <Link
          href="/projects/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          + Register Project
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">No projects registered</p>
          <Link href="/projects/new" className="text-blue-600 text-sm hover:underline">
            Register your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {list.map(p => (
            <div key={p.id as string} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{p.name as string}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{p.from_name as string} · {p.from_email as string}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">{p.currency as string}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">{(p.tax_rate as number)}% tax</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">ID: {p.id as string}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
