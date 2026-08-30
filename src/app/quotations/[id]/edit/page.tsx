"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useBuilderStore } from "@/store/builder-store";
import { QuotationBuilder } from "@/components/builder/quotation-builder";

export default function EditQuotationPage() {
  const params = useParams();
  const id = params.id as string;
  const quotation = useBuilderStore((s) => s.quotation);
  const setQuotation = useBuilderStore((s) => s.setQuotation);

  useEffect(() => {
    if (!quotation || quotation.id !== id) {
      fetch(`/api/quotations/${id}`)
        .then((r) => r.json())
        .then(setQuotation);
    }
  }, [id, quotation, setQuotation]);

  if (!quotation || quotation.id !== id) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="animate-pulse text-center">
          <p className="font-heading text-xl">Loading proposal...</p>
        </div>
      </div>
    );
  }

  return <QuotationBuilder />;
}
