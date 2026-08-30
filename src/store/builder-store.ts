"use client";

import { create } from "zustand";
import type { Quotation, QuotationData, BuilderStep } from "@/types/quotation";
import { calculatePricing, calculatePaymentAmounts } from "@/lib/pricing";

interface BuilderStore {
  quotation: Quotation | null;
  currentStep: BuilderStep;
  isSaving: boolean;
  lastSaved: Date | null;
  previewScale: number;
  showPreview: boolean;

  setQuotation: (quotation: Quotation) => void;
  setCurrentStep: (step: BuilderStep) => void;
  updateData: (updater: (data: QuotationData) => QuotationData) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  setPreviewScale: (scale: number) => void;
  setShowPreview: (show: boolean) => void;
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  quotation: null,
  currentStep: "client",
  isSaving: false,
  lastSaved: null,
  previewScale: 0.45,
  showPreview: true,

  setQuotation: (quotation) => set({ quotation }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (date) => set({ lastSaved: date }),
  setPreviewScale: (scale) => set({ previewScale: scale }),
  setShowPreview: (show) => set({ showPreview: show }),

  updateData: (updater) => {
    const { quotation } = get();
    if (!quotation) return;

    const newData = updater(quotation.data);
    const pricing = calculatePricing(newData);
    const paymentAmounts = calculatePaymentAmounts(pricing.total, newData.paymentSchedule);

    const updatedData = {
      ...newData,
      paymentSchedule: newData.paymentSchedule.map((m) => ({
        ...m,
        amount: paymentAmounts.find((p) => p.id === m.id)?.amount ?? m.amount,
      })),
    };

    set({
      quotation: {
        ...quotation,
        data: updatedData,
        pricing,
        updatedAt: new Date().toISOString(),
      },
    });
  },
}));

interface ToastStore {
  toasts: { id: string; message: string; type: "success" | "error" | "info" }[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "success") => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
