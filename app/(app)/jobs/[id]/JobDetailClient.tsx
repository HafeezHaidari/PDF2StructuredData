"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { apiFetch } from "@/lib/api";
import {
  formatBytes,
  formatDate,
  statusClasses,
  statusLabel,
} from "@/lib/format";
import type { JobDetail } from "@/lib/types";

export function JobDetailClient({ id }: { id: string }) {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<JobDetail>(`/api/jobs/${encodeURIComponent(id)}`);
      setJob(data);
    } catch {
      setError("Could not load this job.");
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/jobs"
            className="text-sm text-zinc-600 hover:underline dark:text-zinc-300"
          >
            ← Back to jobs
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Job #{id}
          </h1>
        </div>
        <Button type="button" variant="secondary" onClick={() => void load()}>
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Summary</div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">Status</div>
              {job ? (
                <Badge className={statusClasses(job.status)}>
                  {statusLabel(job.status)}
                </Badge>
              ) : (
                <div className="text-zinc-500">—</div>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">Profile</div>
              <div className="font-medium">{job?.profile ?? "—"}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">Formats</div>
              <div className="font-medium">{job?.outputFormats ?? "—"}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">Created</div>
              <div className="font-medium">{formatDate(job?.createdAt)}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">Started</div>
              <div className="font-medium">{formatDate(job?.startedAt)}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">Finished</div>
              <div className="font-medium">{formatDate(job?.finishedAt)}</div>
            </div>

            {job?.error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                {job.error}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">File</div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">Name</div>
              <div className="font-medium">
                {job?.fileAsset?.originalName ?? "—"}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">Type</div>
              <div className="font-medium">{job?.fileAsset?.mimeType ?? "—"}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">Size</div>
              <div className="font-medium">
                {job?.fileAsset?.size ? formatBytes(job.fileAsset.size) : "—"}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-zinc-500 dark:text-zinc-400">SHA-256</div>
              <div className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
                {job?.fileAsset?.sha256 ?? "—"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold">Results</div>
        </CardHeader>
        <CardContent>
          {job?.results?.length ? (
            <div className="space-y-4">
              {job.results.map((r) => (
                <div
                  key={r.id}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold">{r.format}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Created {formatDate(r.createdAt)}
                      </div>
                    </div>
                    <a
                      className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                      href={r.contentLocation}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  </div>
                  {r.previewSnippet ? (
                    <pre className="mt-3 max-h-56 overflow-auto rounded-md bg-zinc-50 p-3 text-xs text-zinc-900 dark:bg-zinc-900/20 dark:text-zinc-50">
                      {r.previewSnippet}
                    </pre>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              {job
                ? "No results yet. If the job is still processing, refresh in a moment."
                : "—"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
