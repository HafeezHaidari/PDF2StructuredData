import Link from "next/link";

import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-zinc-50 py-16 dark:bg-black">
      <Container className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Back to home
        </Link>
      </Container>
    </div>
  );
}
