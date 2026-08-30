"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId } from "@/lib/utils";
import { formatINR } from "@/lib/pricing";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ServiceTemplate, LineItem } from "@/types/quotation";

export function ServicesStep() {
  const updateData = useBuilderStore((s) => s.updateData);
  const events = useBuilderStore((s) => s.quotation?.data.events ?? []);
  const globalServices = useBuilderStore((s) => s.quotation?.data.globalServices ?? []);
  const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("global");

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setTemplates);
  }, []);

  const addService = (template: ServiceTemplate) => {
    const item: LineItem = {
      id: generateId(),
      name: template.name,
      quantity: 1,
      unitPrice: template.defaultPrice,
      category: template.category,
      serviceId: template.id,
    };

    if (selectedEvent === "global") {
      updateData((d) => ({ ...d, globalServices: [...d.globalServices, item] }));
    } else {
      updateData((d) => ({
        ...d,
        events: d.events.map((e) =>
          e.id === selectedEvent ? { ...e, services: [...e.services, item] } : e
        ),
      }));
    }
  };

  const removeService = (id: string) => {
    if (selectedEvent === "global") {
      updateData((d) => ({ ...d, globalServices: d.globalServices.filter((s) => s.id !== id) }));
    } else {
      updateData((d) => ({
        ...d,
        events: d.events.map((e) =>
          e.id === selectedEvent ? { ...e, services: e.services.filter((s) => s.id !== id) } : e
        ),
      }));
    }
  };

  const currentServices = selectedEvent === "global"
    ? globalServices
    : events.find((e) => e.id === selectedEvent)?.services ?? [];

  const categories = [...new Set(templates.map((t) => t.category))];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Services</h2>
        <p className="text-sm text-muted-foreground">Select services from your library or add custom ones.</p>
      </div>

      <div>
        <label className="block text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">Assign to</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full border border-border bg-card px-4 py-3 text-sm"
        >
          <option value="global">Global (All Events)</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.name || "Untitled Event"}</option>
          ))}
        </select>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-xs tracking-wider uppercase text-muted-foreground mb-4 capitalize">{category.replace(/_/g, " ")}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {templates.filter((t) => t.category === category).map((template) => (
              <button
                key={template.id}
                onClick={() => addService(template)}
                className="flex items-center justify-between p-4 border border-border bg-card hover:border-accent transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                </div>
                <span className="text-sm tabular-nums text-accent">{formatINR(template.defaultPrice)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {currentServices.length > 0 && (
        <div className="border-t border-border pt-8">
          <h3 className="font-heading text-lg mb-4">Selected Services</h3>
          <div className="space-y-3">
            {currentServices.map((service) => (
              <ServiceLineItem key={service.id} service={service} eventId={selectedEvent} onRemove={() => removeService(service.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceLineItem({ service, eventId, onRemove }: { service: LineItem; eventId: string; onRemove: () => void }) {
  const updateData = useBuilderStore((s) => s.updateData);

  const update = (updates: Partial<LineItem>) => {
    if (eventId === "global") {
      updateData((d) => ({
        ...d,
        globalServices: d.globalServices.map((s) => (s.id === service.id ? { ...s, ...updates } : s)),
      }));
    } else {
      updateData((d) => ({
        ...d,
        events: d.events.map((e) =>
          e.id === eventId
            ? { ...e, services: e.services.map((s) => (s.id === service.id ? { ...s, ...updates } : s)) }
            : e
        ),
      }));
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border border-border bg-card">
      <div className="flex-1">
        <p className="text-sm font-medium">{service.name}</p>
      </div>
      <Input
        type="number"
        min={1}
        value={service.quantity}
        onChange={(e) => update({ quantity: parseInt(e.target.value) || 1 })}
        className="w-20"
      />
      <Input
        type="number"
        min={0}
        value={service.unitPrice}
        onChange={(e) => update({ unitPrice: parseFloat(e.target.value) || 0 })}
        className="w-32"
      />
      <span className="text-sm tabular-nums w-24 text-right">{formatINR(service.quantity * service.unitPrice)}</span>
      <button onClick={onRemove} className="p-2 hover:bg-muted text-danger" aria-label="Remove service">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
