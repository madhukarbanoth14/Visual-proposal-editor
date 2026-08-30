"use client";

import { useBuilderStore } from "@/store/builder-store";
import { StepNavigation, useAutoSave } from "./step-navigation";
import { LivePreview } from "@/components/proposal/live-preview";
import { Button } from "@/components/ui/button";
import { BUILDER_STEPS, type BuilderStep } from "@/types/quotation";
import { ChevronLeft, ChevronRight, Save, Eye } from "lucide-react";
import { useEffect, useCallback } from "react";
import Link from "next/link";
import { ClientStep } from "./steps/client-step";
import { EventsStep } from "./steps/events-step";
import { ServicesStep } from "./steps/services-step";
import { DeliverablesStep } from "./steps/deliverables-step";
import { AlbumsStep } from "./steps/albums-step";
import { AddonsStep } from "./steps/addons-step";
import { PricingStep } from "./steps/pricing-step";
import { PaymentStep } from "./steps/payment-step";
import { TermsStep } from "./steps/terms-step";
import { DesignStep } from "./steps/design-step";
import { ReviewStep } from "./steps/review-step";
import { useToastStore } from "@/store/builder-store";

const STEP_COMPONENTS: Record<BuilderStep, React.ComponentType> = {
  client: ClientStep,
  events: EventsStep,
  services: ServicesStep,
  deliverables: DeliverablesStep,
  albums: AlbumsStep,
  addons: AddonsStep,
  pricing: PricingStep,
  payment: PaymentStep,
  terms: TermsStep,
  design: DesignStep,
  review: ReviewStep,
};

export function QuotationBuilder() {
  const quotation = useBuilderStore((s) => s.quotation);
  const currentStep = useBuilderStore((s) => s.currentStep);
  const setCurrentStep = useBuilderStore((s) => s.setCurrentStep);
  const isSaving = useBuilderStore((s) => s.isSaving);
  const lastSaved = useBuilderStore((s) => s.lastSaved);
  const { save } = useAutoSave();
  const addToast = useToastStore((s) => s.addToast);

  const currentIndex = BUILDER_STEPS.findIndex((s) => s.id === currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];

  const goNext = () => {
    if (currentIndex < BUILDER_STEPS.length - 1) {
      setCurrentStep(BUILDER_STEPS[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(BUILDER_STEPS[currentIndex - 1].id);
    }
  };

  const handleSave = useCallback(async () => {
    await save();
    addToast("Draft saved");
  }, [save, addToast]);

  useEffect(() => {
    const interval = setInterval(() => {
      save();
    }, 30000);
    return () => clearInterval(interval);
  }, [save]);

  if (!quotation) return null;

  const progress = ((currentIndex + 1) / BUILDER_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 flex flex-col bg-background z-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3 bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/quotations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </Link>
          <div>
            <h1 className="font-heading text-lg">{quotation.data.client.displayName || "New Proposal"}</h1>
            <p className="text-xs text-muted-foreground">{quotation.quotationNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Link href={`/quotations/${quotation.id}/preview`}>
            <Button variant="outline" size="sm"><Eye className="h-4 w-4" /> Preview</Button>
          </Link>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-muted shrink-0">
        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <StepNavigation />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
            <StepComponent />
          </div>

          {/* Footer navigation */}
          <div className="flex items-center justify-between border-t border-border px-8 py-4 bg-card shrink-0">
            <Button variant="ghost" onClick={goPrev} disabled={currentIndex === 0}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <span className="text-xs tracking-wider uppercase text-muted-foreground">
              Step {currentIndex + 1} of {BUILDER_STEPS.length}
            </span>
            {currentIndex < BUILDER_STEPS.length - 1 ? (
              <Button onClick={goNext}>
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" /> Save & Finish
              </Button>
            )}
          </div>
        </div>

        <LivePreview />
      </div>
    </div>
  );
}
