"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { apiFetch } from "@/lib/api";
import { formatDate, statusClasses, statusLabel } from "@/lib/format";
import type { ExtractionJob } from "@/lib/types";

export function JobsTable({ limit = 10 }: { limit?: number }) {
  const [jobs, setJobs] = useState<ExtractionJob[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams();
      qs.set("limit", String(limit));
      const data = await apiFetch<ExtractionJob[]>(`/api/jobs?${qs.toString()}`);
      setJobs(data);
    } catch {
      setError("Could not load jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <div className="text-sm font-semibold">Recent jobs</div>
        <Button type="button" variant="secondary" onClick={() => void load()}>
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {error ? (
        <div className="border-b border-zinc-200 bg-red-50 px-5 py-3 text-sm text-red-800 dark:border-zinc-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-zinc-900/20 dark:text-zinc-400">
            <tr>
              <th className="px-5 py-3 font-medium">Job</th>
              <th className="px-5 py-3 font-medium">Profile</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {(jobs ?? Array.from({ length: 3 })).map((job, idx) => {
              if (!job) {
                return (
                  <tr key={idx} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="px-5 py-4" colSpan={4}>
                      <div className="h-4 w-full max-w-[420px] animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={job.id}
                  className="border-t border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/20"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                    >
                      #{job.id}
                    </Link>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {job.fileAsset?.originalName ?? "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">{job.profile}</td>
                  <td className="px-5 py-4">
                    <Badge className={statusClasses(job.status)}>
                      {statusLabel(job.status)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                    {formatDate(job.createdAt)}
                  </td>
                </tr>
              );
            })}

            {jobs?.length === 0 ? (
              <tr className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-5 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={4}>
                  No jobs yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
