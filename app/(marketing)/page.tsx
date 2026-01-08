import Link from "next/link";

import { Container } from "@/components/Container";

export default function HomePage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white py-20 dark:from-black dark:to-zinc-950">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
              Turn PDFs into structured data.
            </h1>
            <p className="mt-5 text-pretty text-lg text-zinc-600 dark:text-zinc-300">
              Upload a PDF and get JSON, CSV, or Markdown output—ready for your
              database, spreadsheet, or API.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Start free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                View pricing
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-sm font-semibold">Extraction profiles</div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Choose a profile (Generic, Invoice, Bank Statement) to optimize
                extraction.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-sm font-semibold">Multiple formats</div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Export as JSON for systems, CSV for spreadsheets, and Markdown for
                docs.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-sm font-semibold">Secure by default</div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Auth via HttpOnly cookies and signed download URLs for result
                files.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/20">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Ready to try it?
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  Create an account and process your first PDF in minutes.
                </p>
              </div>
              <div className="flex gap-3 md:justify-end">
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
