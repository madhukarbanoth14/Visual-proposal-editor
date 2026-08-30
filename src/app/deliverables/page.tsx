"use client";

import { useEffect, useState } from "react";
import type { DeliverableTemplate } from "@/types/quotation";

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<DeliverableTemplate[]>([]);

  useEffect(() => {
    fetch("/api/deliverables").then((r) => r.json()).then(setDeliverables);
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-heading text-3xl mb-2">Deliverable Library</h1>
      <p className="text-sm text-muted-foreground mb-10">Reusable deliverables for your proposals.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliverables.map((d) => (
          <div key={d.id} className="p-5 border border-border bg-card text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-muted flex items-center justify-center">
              <span className="font-heading text-lg text-accent">✦</span>
            </div>
            <h3 className="text-sm font-medium">{d.name}</h3>
            <p className="text-xs text-muted-foreground mt-2">{d.description}</p>
            <p className="text-xs tracking-wider uppercase text-muted-foreground mt-3">{d.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
