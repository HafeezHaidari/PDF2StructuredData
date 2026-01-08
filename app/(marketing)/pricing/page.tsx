import Link from "next/link";

import { Container } from "@/components/Container";
import { Card, CardContent, CardHeader } from "@/components/Card";

export const metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple pricing
          </h1>
          <p className="mt-3 text-pretty text-zinc-600 dark:text-zinc-300">
            Start free, upgrade when you need more throughput.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="text-sm font-semibold">Free</div>
              <div className="mt-2 text-3xl font-semibold">$0</div>
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                For trying things out
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <li>• Basic extraction profiles</li>
                <li>• JSON output</li>
                <li>• Community support</li>
              </ul>
              <Link
                href="/signup"
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Get started
              </Link>
            </CardContent>
          </Card>

          <Card className="border-zinc-900 dark:border-zinc-50">
            <CardHeader>
              <div className="text-sm font-semibold">Pro</div>
              <div className="mt-2 text-3xl font-semibold">$19</div>
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Per month
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <li>• Higher limits</li>
                <li>• JSON + CSV + Markdown</li>
                <li>• Priority support</li>
              </ul>
              <Link
                href="/signup"
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Start Pro
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm font-semibold">Credit pack</div>
              <div className="mt-2 text-3xl font-semibold">$10</div>
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                One-time
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <li>• Pay as you go</li>
                <li>• Great for sporadic use</li>
                <li>• Top up anytime</li>
              </ul>
              <Link
                href="/signup"
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Buy credits
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-zinc-200 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          Plans and limits are configurable on the backend; this UI is a starting
          point for wiring up Stripe Checkout and the Billing Portal.
        </div>
      </Container>
    </main>
  );
}
