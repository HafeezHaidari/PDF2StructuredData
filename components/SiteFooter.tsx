import Link from "next/link";

import { Container } from "@/components/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 py-10 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} PDF Processor</div>
        <div className="flex gap-4">
          <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Pricing
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Status
          </a>
        </div>
      </Container>
    </footer>
  );
}
