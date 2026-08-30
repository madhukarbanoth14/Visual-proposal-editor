"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Quotation, QuotationStatus } from "@/types/quotation";
import { Copy, Trash2, Download, Share2, Eye } from "lucide-react";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    fetch("/api/quotations").then((r) => r.json()).then(setQuotations);
  }, []);

  const duplicate = async (id: string) => {
    const res = await fetch(`/api/quotations/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate" }),
    });
    const q = await res.json();
    setQuotations((prev) => [q, ...prev]);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this quotation?")) return;
    await fetch(`/api/quotations/${id}`, { method: "DELETE" });
    setQuotations((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-heading text-3xl mb-1">Quotations</h1>
          <p className="text-sm text-muted-foreground">{quotations.length} total</p>
        </div>
        <Link href="/quotations/new" className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90">
          + Create Quotation
        </Link>
      </div>

      {quotations.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground mb-4">No quotations yet</p>
          <Link href="/quotations/new" className="text-accent hover:underline">Create your first proposal</Link>
        </div>
      ) : (
        <div className="border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">#</th>
                <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Client</th>
                <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Event Date</th>
                <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Amount</th>
                <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Status</th>
                <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Updated</th>
                <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-5 py-4 text-sm">{q.quotationNumber}</td>
                  <td className="px-5 py-4 text-sm">{q.data.client.displayName || "—"}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {q.data.dates.startDate ? formatDate(q.data.dates.startDate, { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-5 py-4 text-sm tabular-nums">{formatINR(q.pricing.total)}</td>
                  <td className="px-5 py-4"><StatusBadge status={q.status as QuotationStatus} /></td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{formatDate(q.updatedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/quotations/${q.id}/edit`} className="p-1.5 hover:bg-muted" title="Edit"><Eye className="h-4 w-4" /></Link>
                      <button onClick={() => duplicate(q.id)} className="p-1.5 hover:bg-muted" title="Duplicate"><Copy className="h-4 w-4" /></button>
                      <a href={`/api/quotations/${q.id}/pdf`} className="p-1.5 hover:bg-muted" title="Download PDF"><Download className="h-4 w-4" /></a>
                      <Link href={`/quotations/${q.id}/client-view`} className="p-1.5 hover:bg-muted" title="Share"><Share2 className="h-4 w-4" /></Link>
                      <button onClick={() => remove(q.id)} className="p-1.5 hover:bg-muted text-danger" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
