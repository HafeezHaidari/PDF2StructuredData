import { AppHeader } from "@/components/AppHeader";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <div className="flex-1 bg-zinc-50 py-8 dark:bg-black">{children}</div>
    </div>
  );
}
