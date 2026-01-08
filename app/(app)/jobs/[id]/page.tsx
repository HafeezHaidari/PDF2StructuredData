import { Container } from "@/components/Container";
import { JobDetailClient } from "./JobDetailClient";

export const metadata = {
  title: "Job",
};

export default function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main>
      <Container>
        <JobDetailClient id={params.id} />
      </Container>
    </main>
  );
}
