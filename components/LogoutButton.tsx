"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/Button";
import { apiJson } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await apiJson<unknown>("/api/auth/logout", {});
        } catch (err) {
          void err;
        } finally {
          setLoading(false);
          router.push("/login");
          router.refresh();
        }
      }}
    >
      Sign out
    </Button>
  );
}
