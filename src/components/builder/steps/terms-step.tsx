"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/lib/utils";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { TermCategory } from "@/types/quotation";

const TERM_CATEGORIES: TermCategory[] = [
  "payments", "cancellation", "rescheduling", "travel", "accommodation",
  "deliverables", "albums", "raw_data", "post_production", "data_retention", "other",
];

export function TermsStep() {
  const terms = useBuilderStore((s) => s.quotation?.data.terms ?? []);
  const updateData = useBuilderStore((s) => s.updateData);

  const addTerm = () => {
    updateData((d) => ({
      ...d,
      terms: [
        ...d.terms,
        { id: generateId(), title: "", content: "", category: "other" as TermCategory, sortOrder: d.terms.length + 1 },
      ],
    }));
  };

  const updateTerm = (id: string, updates: Record<string, unknown>) => {
    updateData((d) => ({
      ...d,
      terms: d.terms.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const removeTerm = (id: string) => {
    updateData((d) => ({
      ...d,
      terms: d.terms.filter((t) => t.id !== id).map((t, i) => ({ ...t, sortOrder: i + 1 })),
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Terms & Conditions</h2>
        <p className="text-sm text-muted-foreground">Configure terms for this proposal.</p>
      </div>

      <div className="space-y-4">
        {terms.map((term, index) => (
          <div key={term.id} className="p-5 border border-border bg-card space-y-4">
            <div className="flex items-start gap-3">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-2 shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="flex gap-4">
                  <span className="text-xs text-muted-foreground mt-3">{index + 1}.</span>
                  <Input label="Title" value={term.title} onChange={(e) => updateTerm(term.id, { title: e.target.value })} className="flex-1" />
                  <select
                    value={term.category}
                    onChange={(e) => updateTerm(term.id, { category: e.target.value })}
                    className="border border-border px-3 py-2 text-sm bg-card mt-6"
                  >
                    {TERM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                  <button onClick={() => removeTerm(term.id)} className="p-2 hover:bg-muted text-danger mt-6" aria-label="Remove term">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Textarea label="Content" value={term.content} onChange={(e) => updateTerm(term.id, { content: e.target.value })} rows={3} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addTerm}>
        <Plus className="h-4 w-4" /> Add Term
      </Button>
    </div>
  );
}
