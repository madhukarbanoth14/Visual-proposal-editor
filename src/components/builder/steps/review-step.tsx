"use client";

import { useBuilderStore, useToastStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatINR, validatePaymentSchedule } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";
import { CheckCircle, AlertCircle, Send, Eye, Download } from "lucide-react";
import Link from "next/link";
import type { QuotationStatus } from "@/types/quotation";

export function ReviewStep() {
  const quotation = useBuilderStore((s) => s.quotation);
  const addToast = useToastStore((s) => s.addToast);

  if (!quotation) return null;

  const { data, pricing } = quotation;
  const paymentValid = validatePaymentSchedule(data.paymentSchedule).valid;

  const checks = [
    { label: "Client name provided", valid: !!data.client.displayName },
    { label: "At least one event", valid: data.events.length > 0 },
    { label: "Events have dates", valid: data.events.every((e) => e.date) },
    { label: "Payment schedule totals 100%", valid: paymentValid },
    { label: "Grand total is positive", valid: pricing.total > 0 },
    { label: "Valid until date set", valid: !!data.dates.validUntil },
  ];

  const allValid = checks.every((c) => c.valid);

  const publish = async () => {
    if (!allValid) {
      addToast("Please fix validation issues before publishing", "error");
      return;
    }
    try {
      const res = await fetch(`/api/quotations/${quotation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: quotation.data, status: "sent" }),
      });
      if (!res.ok) throw new Error("Failed");
      addToast("Proposal published successfully");
    } catch {
      addToast("Failed to publish", "error");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Review & Publish</h2>
        <p className="text-sm text-muted-foreground">Review your proposal before sending to the client.</p>
      </div>

      <div className="flex items-center gap-4">
        <StatusBadge status={quotation.status as QuotationStatus} />
        <span className="text-sm text-muted-foreground">{quotation.quotationNumber}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-heading text-lg">Validation</h3>
          {checks.map((check) => (
            <div key={check.label} className="flex items-center gap-3">
              {check.valid ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4 text-warning" />
              )}
              <span className="text-sm">{check.label}</span>
            </div>
          ))}
        </div>

        <div className="p-6 border border-border bg-card space-y-4">
          <h3 className="font-heading text-lg">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Client</span><span>{data.client.displayName || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Events</span><span>{data.events.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Valid Until</span><span>{data.dates.validUntil ? formatDate(data.dates.validUntil) : "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Theme</span><span className="capitalize">{data.template}</span></div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-heading text-lg">Total</span>
              <span className="font-heading text-xl text-accent tabular-nums">{formatINR(pricing.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
        <Button onClick={publish} disabled={!allValid}>
          <Send className="h-4 w-4" /> Publish Proposal
        </Button>
        <Link href={`/quotations/${quotation.id}/preview`}>
          <Button variant="outline"><Eye className="h-4 w-4" /> Full Preview</Button>
        </Link>
        <Link href={`/quotations/${quotation.id}/client-view`} target="_blank">
          <Button variant="outline"><Eye className="h-4 w-4" /> Client View</Button>
        </Link>
        <a href={`/api/quotations/${quotation.id}/pdf`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline"><Download className="h-4 w-4" /> Download PDF</Button>
        </a>
      </div>
    </div>
  );
}
