"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { apiJson } from "@/lib/api";

function asUrl(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const url = (value as { url?: unknown }).url;
    return typeof url === "string" ? url : null;
  }
  return null;
}

export function BillingActions() {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go(path: string, kind: "checkout" | "portal", body?: unknown) {
    setLoading(kind);
    setError(null);
    try {
      const res = await apiJson<unknown>(path, body ?? {});
      const url = asUrl(res);
      if (!url) {
        throw new Error("Missing URL");
      }
      window.location.href = url;
    } catch {
      setError(
        "Billing is not configured yet. Implement the Stripe endpoints on the backend to enable this.",
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          disabled={loading !== null}
          onClick={() => void go("/api/stripe/checkout", "checkout", { plan: "PRO" })}
        >
          {loading === "checkout" ? "Opening…" : "Upgrade to Pro"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={loading !== null}
          onClick={() => void go("/api/stripe/billing-portal", "portal")}
        >
          {loading === "portal" ? "Opening…" : "Manage billing"}
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-200">
          {error}
        </div>
      ) : null}
    </div>
  );
}
