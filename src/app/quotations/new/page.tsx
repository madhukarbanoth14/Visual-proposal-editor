"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/store/builder-store";

export default function NewQuotationPage() {
  const router = useRouter();
  const setQuotation = useBuilderStore((s) => s.setQuotation);

  useEffect(() => {
    fetch("/api/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sample: true }),
    })
      .then((r) => r.json())
      .then((quotation) => {
        setQuotation(quotation);
        router.replace(`/quotations/${quotation.id}/edit`);
      });
  }, [router, setQuotation]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center animate-pulse">
        <p className="font-heading text-xl mb-2">Creating your proposal...</p>
        <p className="text-sm text-muted-foreground">Setting up with sample data</p>
      </div>
    </div>
  );
}
