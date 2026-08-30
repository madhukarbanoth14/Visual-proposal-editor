"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/pricing";
import type { ServiceTemplate } from "@/types/quotation";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceTemplate[]>([]);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
  }, []);

  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-heading text-3xl mb-2">Service Library</h1>
      <p className="text-sm text-muted-foreground mb-10">Reusable services for your proposals.</p>

      {categories.map((category) => (
        <div key={category} className="mb-10">
          <h2 className="text-xs tracking-wider uppercase text-muted-foreground mb-4 capitalize">{category.replace(/_/g, " ")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.filter((s) => s.category === category).map((service) => (
              <div key={service.id} className="p-5 border border-border bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium">{service.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                  </div>
                  <span className="text-sm tabular-nums text-accent">{formatINR(service.defaultPrice)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Unit: {service.unit}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
