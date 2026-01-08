"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ApiError, apiJson } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Start on the free plan and upgrade anytime.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);

          try {
            await apiJson<unknown>("/api/auth/register", { email, password });
            await apiJson<unknown>("/api/auth/login", { email, password });
            router.push("/dashboard");
            router.refresh();
          } catch (err) {
            if (err instanceof ApiError) {
              setError(err.message);
            } else {
              setError("Could not create your account. Please try again.");
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
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Minimum 8 characters.
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 dark:text-zinc-50">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
