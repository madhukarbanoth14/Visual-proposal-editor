"use client";

import { useToastStore } from "@/store/builder-store";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info } from "lucide-react";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-5 py-3 shadow-lg animate-fade-in bg-card border border-border",
            toast.type === "success" && "border-l-2 border-l-success",
            toast.type === "error" && "border-l-2 border-l-danger",
            toast.type === "info" && "border-l-2 border-l-accent"
          )}
        >
          {toast.type === "success" && <CheckCircle className="h-4 w-4 text-success" />}
          {toast.type === "error" && <XCircle className="h-4 w-4 text-danger" />}
          {toast.type === "info" && <Info className="h-4 w-4 text-accent" />}
          <span className="text-sm">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
