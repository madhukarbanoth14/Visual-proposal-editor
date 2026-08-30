"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/pricing";

export function PricingStep() {
  const quotation = useBuilderStore((s) => s.quotation);
  const updateData = useBuilderStore((s) => s.updateData);

  if (!quotation) return null;
  const { data, pricing } = quotation;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Pricing</h2>
        <p className="text-sm text-muted-foreground">Review and configure pricing, discounts, and tax.</p>
      </div>

      <div className="border border-border bg-card p-6 space-y-4">
        {pricing.lineItems.map((group) => (
          <div key={group.category}>
            <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">{group.category}</p>
            {group.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm">{item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ""}</span>
                <span className="text-sm tabular-nums">{formatINR(item.total)}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatINR(pricing.subtotal)}</span>
          </div>
          {pricing.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>Discount</span>
              <span className="tabular-nums">−{formatINR(pricing.discountAmount)}</span>
            </div>
          )}
          {data.tax.enabled && (
            <div className="flex justify-between text-sm">
              <span>{data.tax.label} ({data.tax.rate}%)</span>
              <span className="tabular-nums">{formatINR(pricing.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="font-heading text-xl">Total</span>
            <span className="font-heading text-2xl tabular-nums text-accent">{formatINR(pricing.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 p-5 border border-border bg-card">
          <h3 className="font-heading text-lg">Discount</h3>
          <div className="flex gap-3">
            <select
              value={data.discount.type}
              onChange={(e) => updateData((d) => ({ ...d, discount: { ...d.discount, type: e.target.value as "fixed" | "percentage" } }))}
              className="border border-border px-3 py-2 text-sm bg-card"
            >
              <option value="fixed">Fixed (₹)</option>
              <option value="percentage">Percentage (%)</option>
            </select>
            <Input
              type="number"
              min={0}
              value={data.discount.value}
              onChange={(e) => updateData((d) => ({ ...d, discount: { ...d.discount, value: parseFloat(e.target.value) || 0 } }))}
            />
          </div>
          <Input
            label="Discount Label"
            value={data.discount.label}
            onChange={(e) => updateData((d) => ({ ...d, discount: { ...d.discount, label: e.target.value } }))}
          />
        </div>

        <div className="space-y-4 p-5 border border-border bg-card">
          <h3 className="font-heading text-lg">Tax / GST</h3>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={data.tax.enabled}
              onChange={(e) => updateData((d) => ({ ...d, tax: { ...d.tax, enabled: e.target.checked } }))}
            />
            Enable tax
          </label>
          <Input
            label="Tax Rate (%)"
            type="number"
            min={0}
            max={100}
            value={data.tax.rate}
            onChange={(e) => updateData((d) => ({ ...d, tax: { ...d.tax, rate: parseFloat(e.target.value) || 0 } }))}
          />
          <Input
            label="Tax Label"
            value={data.tax.label}
            onChange={(e) => updateData((d) => ({ ...d, tax: { ...d.tax, label: e.target.value } }))}
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={data.tax.inclusive}
              onChange={(e) => updateData((d) => ({ ...d, tax: { ...d.tax, inclusive: e.target.checked } }))}
            />
            Tax inclusive pricing
          </label>
        </div>
      </div>
    </div>
  );
}
