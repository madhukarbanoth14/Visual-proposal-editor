"use client";

import { useBuilderStore, useToastStore } from "@/store/builder-store";
import { BUILDER_STEPS, type BuilderStep } from "@/types/quotation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function StepNavigation() {
  const currentStep = useBuilderStore((s) => s.currentStep);
  const setCurrentStep = useBuilderStore((s) => s.setCurrentStep);

  return (
    <nav className="w-56 shrink-0 border-r border-border bg-card overflow-y-auto">
      <div className="p-4 border-b border-border">
        <p className="text-xs tracking-wider uppercase text-muted-foreground">Steps</p>
      </div>
      <ul className="p-2 space-y-0.5">
        {BUILDER_STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const stepIndex = BUILDER_STEPS.findIndex((s) => s.id === currentStep);
          const thisIndex = BUILDER_STEPS.findIndex((s) => s.id === step.id);
          const isComplete = thisIndex < stepIndex;

          return (
            <li key={step.id}>
              <button
                onClick={() => setCurrentStep(step.id as BuilderStep)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                  !isActive && "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center text-xs border",
                    isActive && "border-primary-foreground/30",
                    isComplete && !isActive && "bg-success/10 border-success text-success",
                    !isActive && !isComplete && "border-border"
                  )}
                >
                  {isComplete && !isActive ? <Check className="h-3 w-3" /> : step.number.toString().padStart(2, "0")}
                </span>
                <span className="tracking-wide">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function useAutoSave() {
  const quotation = useBuilderStore((s) => s.quotation);
  const setIsSaving = useBuilderStore((s) => s.setIsSaving);
  const setLastSaved = useBuilderStore((s) => s.setLastSaved);
  const addToast = useToastStore((s) => s.addToast);

  const save = async () => {
    if (!quotation) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/quotations/${quotation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: quotation.data }),
      });
      if (!res.ok) throw new Error("Save failed");
      setLastSaved(new Date());
    } catch {
      addToast("Failed to save", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return { save };
}
