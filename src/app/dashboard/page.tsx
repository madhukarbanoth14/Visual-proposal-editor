"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Quotation, QuotationStatus } from "@/types/quotation";
import { FileText, Send, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface DashboardStats {
  total: number;
  draft: number;
  sent: number;
  viewed: number;
  accepted: number;
  expired: number;
  recent: Quotation[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-muted" />)}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total", value: stats.total, icon: FileText },
    { label: "Drafts", value: stats.draft, icon: Clock },
    { label: "Sent", value: stats.sent, icon: Send },
    { label: "Viewed", value: stats.viewed, icon: Eye },
    { label: "Accepted", value: stats.accepted, icon: CheckCircle },
    { label: "Expired", value: stats.expired, icon: AlertCircle },
  ];

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-heading text-3xl mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your proposals</p>
        </div>
        <Link
          href="/quotations/new"
          className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
        >
          + Create Quotation
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {statCards.map((card) => (
          <div key={card.label} className="p-5 border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <card.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs tracking-wider uppercase text-muted-foreground">{card.label}</span>
            </div>
            <p className="font-heading text-3xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-heading text-xl mb-6">Recent Quotations</h2>
        {stats.recent.length === 0 ? (
          <div className="border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground mb-4">No quotations yet</p>
            <Link href="/quotations/new" className="text-sm text-accent hover:underline">Create your first proposal</Link>
          </div>
        ) : (
          <div className="border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Quotation #</th>
                  <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Client</th>
                  <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Amount</th>
                  <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Status</th>
                  <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Updated</th>
                  <th className="px-5 py-3 text-xs tracking-wider uppercase text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((q) => (
                  <tr key={q.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 text-sm">{q.quotationNumber}</td>
                    <td className="px-5 py-4 text-sm">{q.data.client.displayName || "—"}</td>
                    <td className="px-5 py-4 text-sm tabular-nums">{formatINR(q.pricing.total)}</td>
                    <td className="px-5 py-4"><StatusBadge status={q.status as QuotationStatus} /></td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{formatDate(q.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <Link href={`/quotations/${q.id}/edit`} className="text-sm text-accent hover:underline">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
