"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProposalRenderer } from "@/components/proposal/proposal-renderer";
import type { Quotation } from "@/types/quotation";

export default function ClientViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [quotation, setQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    fetch(`/api/quotations/${id}`).then((r) => r.json()).then(setQuotation);
  }, [id]);

  if (!quotation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center animate-pulse">
          <p className="font-heading text-2xl text-neutral-400">Loading your proposal...</p>
        </div>
      </div>
    );
  }

  return <ProposalRenderer quotation={quotation} mode="client" />;
}
