"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/Button";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Select } from "@/components/Select";
import { apiForm } from "@/lib/api";
import type { ExtractionProfile, OutputFormat } from "@/lib/types";

const PROFILES: ExtractionProfile[] = ["GENERIC", "INVOICE", "BANK_STATEMENT"];
const FORMATS: OutputFormat[] = ["JSON", "CSV", "MARKDOWN"];

function asJobId(value: unknown): number | null {
  if (!value || typeof value !== "object") return null;
  const id = (value as { id?: unknown }).id;
  return typeof id === "number" ? id : null;
}

export function NewJobForm() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<ExtractionProfile>("GENERIC");
  const [formats, setFormats] = useState<Set<OutputFormat>>(
    () => new Set(["JSON"]),
  );

  const outputFormats = useMemo(() => Array.from(formats).join(","), [formats]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="text-sm font-semibold">New extraction</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Upload a PDF and choose the output formats you need.
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setSuccess(null);

            if (!file) {
              setError("Please choose a PDF file.");
              return;
            }

            setLoading(true);
            try {
              const form = new FormData();
              form.set("file", file);
              form.set("profile", profile);
              form.set("outputFormats", outputFormats);

              const result = await apiForm<unknown>("/api/jobs", form);
              const jobId = asJobId(result);

              if (jobId) {
                router.push(`/jobs/${jobId}`);
                router.refresh();
                return;
              }

              setSuccess("Job created.");
            } catch {
              setError(
                "Could not create the job. Make sure the backend is running and try again.",
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="file">
              PDF file
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              className="block w-full cursor-pointer rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:file:bg-zinc-900 dark:hover:file:bg-zinc-800"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="profile">
                Profile
              </label>
              <Select
                id="profile"
                name="profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value as ExtractionProfile)}
              >
                {PROFILES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Formats</div>
              <div className="flex flex-wrap gap-3">
                {FORMATS.map((f) => {
                  const checked = formats.has(f);
                  return (
                    <label
                      key={f}
                      className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setFormats((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(f);
                            else next.delete(f);
                            if (next.size === 0) next.add("JSON");
                            return next;
                          });
                        }}
                      />
                      {f}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
              {success}
            </div>
          ) : null}

          <Button type="submit" disabled={loading}>
            {loading ? "Uploading…" : "Create job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
