import { Container } from "@/components/Container";
import { JobsTable } from "@/components/JobsTable";
import { NewJobForm } from "@/components/NewJobForm";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main>
      <Container className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Create new extractions and monitor progress.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <NewJobForm />
          <div className="space-y-6">
            <JobsTable limit={6} />
          </div>
        </div>
      </Container>
    </main>
  );
}
