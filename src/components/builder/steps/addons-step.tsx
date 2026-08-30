"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/lib/utils";
import { formatINR } from "@/lib/pricing";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_ADDONS = [
  "Drone", "Live Streaming", "Extra Photographer", "Extra Videographer",
  "Additional Album", "Extra Sheets", "Pre-Wedding Shoot", "Additional Hours",
];

export function AddonsStep() {
  const addons = useBuilderStore((s) => s.quotation?.data.addons ?? []);
  const updateData = useBuilderStore((s) => s.updateData);

  const addAddon = (name = "") => {
    updateData((d) => ({
      ...d,
      addons: [
        ...d.addons,
        { id: generateId(), name, description: "", image: null, price: 0, quantity: 1, optional: true, included: false },
      ],
    }));
  };

  const updateAddon = (id: string, updates: Record<string, unknown>) => {
    updateData((d) => ({
      ...d,
      addons: d.addons.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const removeAddon = (id: string) => {
    updateData((d) => ({ ...d, addons: d.addons.filter((a) => a.id !== id) }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Add-ons</h2>
        <p className="text-sm text-muted-foreground">Optional services and extras.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_ADDONS.map((name) => (
          <button
            key={name}
            onClick={() => addAddon(name)}
            className="px-3 py-1.5 text-xs border border-border hover:border-accent transition-colors"
          >
            + {name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className={cn(
              "p-5 border bg-card transition-colors",
              addon.included ? "border-accent bg-accent/5" : "border-border"
            )}
          >
            <div className="flex justify-between mb-4">
              <Input value={addon.name} onChange={(e) => updateAddon(addon.id, { name: e.target.value })} placeholder="Add-on name" />
              <button onClick={() => removeAddon(addon.id)} className="p-2 hover:bg-muted text-danger ml-2" aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Textarea value={addon.description} onChange={(e) => updateAddon(addon.id, { description: e.target.value })} placeholder="Description" rows={2} className="mb-4" />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Input type="number" min={0} value={addon.price} onChange={(e) => updateAddon(addon.id, { price: parseFloat(e.target.value) || 0 })} label="Price" />
              <Input type="number" min={1} value={addon.quantity} onChange={(e) => updateAddon(addon.id, { quantity: parseInt(e.target.value) || 1 })} label="Qty" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={addon.included} onChange={(e) => updateAddon(addon.id, { included: e.target.checked, optional: !e.target.checked })} />
                Included
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={addon.optional} onChange={(e) => updateAddon(addon.id, { optional: e.target.checked })} />
                Optional
              </label>
            </div>
            {!addon.included && (
              <p className="text-sm text-accent mt-3 tabular-nums">{formatINR(addon.price * addon.quantity)}</p>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={() => addAddon()}>
        <Plus className="h-4 w-4" /> Add Add-on
      </Button>
    </div>
  );
}
