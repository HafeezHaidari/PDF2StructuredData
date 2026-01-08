"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ApiError, apiJson } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = useMemo(() => searchParams.get("next") ?? "/dashboard", [
    searchParams,
  ]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Use your email and password.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);

          try {
            await apiJson<unknown>("/api/auth/login", { email, password });
            router.push(next);
            router.refresh();
          } catch (err) {
            if (err instanceof ApiError) {
              setError(err.message);
            } else {
              setError("Could not sign in. Please try again.");
            }
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-medium text-zinc-900 dark:text-zinc-50">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
