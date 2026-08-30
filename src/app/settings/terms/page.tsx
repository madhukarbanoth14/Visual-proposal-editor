"use client";

import { useEffect, useState } from "react";
import type { TermTemplate } from "@/types/quotation";

export default function TermsSettingsPage() {
  const [terms, setTerms] = useState<TermTemplate[]>([]);

  useEffect(() => {
    fetch("/api/terms").then((r) => r.json()).then(setTerms).catch(() => setTerms([]));
  }, []);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-heading text-3xl mb-2">Default Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-10">Global terms applied to new proposals.</p>

      <div className="space-y-6">
        {terms.map((term, i) => (
          <div key={term.id} className="p-5 border border-border bg-card">
            <div className="flex items-start gap-3">
              <span className="text-xs text-muted-foreground mt-1">{i + 1}.</span>
              <div>
                <h3 className="font-heading text-lg">{term.title}</h3>
                <p className="text-xs tracking-wider uppercase text-muted-foreground mt-1">{term.category.replace(/_/g, " ")}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{term.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
