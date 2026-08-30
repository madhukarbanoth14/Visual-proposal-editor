"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProposalRenderer } from "@/components/proposal/proposal-renderer";
import type { Quotation } from "@/types/quotation";
import Link from "next/link";

export default function PreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const [quotation, setQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    fetch(`/api/quotations/${id}`).then((r) => r.json()).then(setQuotation);
  }, [id]);

  if (!quotation) {
    return <div className="flex items-center justify-center min-h-screen animate-pulse">Loading preview...</div>;
  }

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-primary/90 backdrop-blur text-primary-foreground">
        <Link href={`/quotations/${id}/edit`} className="text-sm hover:underline">← Back to Editor</Link>
        <span className="text-sm">{quotation.quotationNumber}</span>
        <Link href={`/quotations/${id}/client-view`} target="_blank" className="text-sm hover:underline">Client View →</Link>
      </div>
      <div className="pt-12">
        <ProposalRenderer quotation={quotation} mode="preview" />
      </div>
    </div>
  );
}
