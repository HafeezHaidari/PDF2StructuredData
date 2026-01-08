import { BillingActions } from "@/components/BillingActions";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <main>
      <Container className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Account
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Manage your subscription and billing.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Billing</div>
          </CardHeader>
          <CardContent>
            <BillingActions />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">API base URL</div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Set <span className="font-mono">NEXT_PUBLIC_BACKEND_URL</span> to point the
              UI at your Spring Boot backend (defaults to
              <span className="font-mono"> http://localhost:8080</span>).
            </p>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
