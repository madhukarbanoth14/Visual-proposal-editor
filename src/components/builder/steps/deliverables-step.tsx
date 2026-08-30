"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { DeliverableTemplate, DeliverableItem } from "@/types/quotation";

export function DeliverablesStep() {
  const deliverables = useBuilderStore((s) => s.quotation?.data.globalDeliverables ?? []);
  const updateData = useBuilderStore((s) => s.updateData);
  const [templates, setTemplates] = useState<DeliverableTemplate[]>([]);

  useEffect(() => {
    fetch("/api/deliverables").then((r) => r.json()).then(setTemplates);
  }, []);

  const addFromTemplate = (template: DeliverableTemplate) => {
    const item: DeliverableItem = {
      id: generateId(),
      name: template.name,
      description: template.description,
      image: template.image,
      category: template.category,
      quantity: "1",
      duration: "",
      notes: "",
      global: true,
    };
    updateData((d) => ({ ...d, globalDeliverables: [...d.globalDeliverables, item] }));
  };

  const addCustom = () => {
    updateData((d) => ({
      ...d,
      globalDeliverables: [
        ...d.globalDeliverables,
        { id: generateId(), name: "", description: "", image: null, category: "general", quantity: "", duration: "", notes: "", global: true },
      ],
    }));
  };

  const updateItem = (id: string, updates: Partial<DeliverableItem>) => {
    updateData((d) => ({
      ...d,
      globalDeliverables: d.globalDeliverables.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  };

  const removeItem = (id: string) => {
    updateData((d) => ({
      ...d,
      globalDeliverables: d.globalDeliverables.filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Deliverables</h2>
        <p className="text-sm text-muted-foreground">Define what the client will receive.</p>
      </div>

      <div>
        <h3 className="text-xs tracking-wider uppercase text-muted-foreground mb-4">From Library</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => addFromTemplate(t)}
              className="p-4 border border-border bg-card hover:border-accent transition-colors text-left"
            >
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg">Deliverable Items</h3>
          <Button variant="outline" size="sm" onClick={addCustom}>
            <Plus className="h-4 w-4" /> Add Custom
          </Button>
        </div>

        {deliverables.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No deliverables added yet</p>
        ) : (
          <div className="grid gap-4">
            {deliverables.map((item) => (
              <div key={item.id} className="p-5 border border-border bg-card space-y-4">
                <div className="flex justify-between">
                  <Input label="Name" value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
                  <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-muted text-danger ml-2 mt-6" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Textarea label="Description" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} rows={2} />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Quantity" value={item.quantity} onChange={(e) => updateItem(item.id, { quantity: e.target.value })} placeholder="500+, 1, All Events" />
                  <Input label="Duration" value={item.duration} onChange={(e) => updateItem(item.id, { duration: e.target.value })} placeholder="5-8 min, 60 sec" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
