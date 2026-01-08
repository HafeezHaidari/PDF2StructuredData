import { Container } from "@/components/Container";
import { JobsTable } from "@/components/JobsTable";

export const metadata = {
  title: "Jobs",
};

export default function JobsPage() {
  return (
    <main>
      <Container className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Jobs
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            View all your extraction jobs.
          </p>
        </div>

        <JobsTable limit={25} />
      </Container>
    </main>
  );
}
