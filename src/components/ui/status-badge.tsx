import { cn } from "@/lib/utils";
import type { QuotationStatus } from "@/types/quotation";

const statusConfig: Record<QuotationStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-blue-50 text-blue-700" },
  viewed: { label: "Viewed", className: "bg-purple-50 text-purple-700" },
  accepted: { label: "Accepted", className: "bg-green-50 text-success" },
  rejected: { label: "Rejected", className: "bg-red-50 text-danger" },
  expired: { label: "Expired", className: "bg-orange-50 text-warning" },
};

export function StatusBadge({ status }: { status: QuotationStatus }) {
  const config = statusConfig[status] || statusConfig.draft;
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase", config.className)}>
      {config.label}
    </span>
  );
}
