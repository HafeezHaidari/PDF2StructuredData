import Link from "next/link";

import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-zinc-50 py-12 dark:bg-black">
      <Container>
        <div className="mx-auto max-w-md">
          <Link href="/" className="inline-flex hover:opacity-90">
            <Logo />
          </Link>
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
