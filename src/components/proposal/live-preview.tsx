"use client";

import { useBuilderStore } from "@/store/builder-store";
import { ProposalRenderer } from "./proposal-renderer";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export function LivePreview() {
  const quotation = useBuilderStore((s) => s.quotation);
  const showPreview = useBuilderStore((s) => s.showPreview);
  const setShowPreview = useBuilderStore((s) => s.setShowPreview);
  const previewScale = useBuilderStore((s) => s.previewScale);

  if (!quotation) return null;

  return (
    <div className={cn("flex flex-col border-l border-border bg-muted/30", showPreview ? "w-[420px]" : "w-12")}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-card">
        {showPreview && (
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium tracking-wider uppercase">Live Preview</span>
          </div>
        )}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="ml-auto p-1 hover:bg-muted rounded transition-colors"
          aria-label={showPreview ? "Hide preview" : "Show preview"}
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showPreview && (
        <div className="flex-1 overflow-hidden">
          <div
            className="h-full overflow-y-auto proposal-scroll origin-top-left"
            style={{ transform: `scale(${previewScale})`, width: `${100 / previewScale}%`, height: `${100 / previewScale}%` }}
          >
            <ProposalRenderer quotation={quotation} mode="preview" />
          </div>
        </div>
      )}
    </div>
  );
}
