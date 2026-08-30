"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/lib/utils";
import { formatINR, validatePaymentSchedule } from "@/lib/pricing";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

export function PaymentStep() {
  const schedule = useBuilderStore((s) => s.quotation?.data.paymentSchedule ?? []);
  const pricing = useBuilderStore((s) => s.quotation?.pricing);
  const updateData = useBuilderStore((s) => s.updateData);

  const validation = validatePaymentSchedule(schedule);

  const addMilestone = () => {
    updateData((d) => ({
      ...d,
      paymentSchedule: [
        ...d.paymentSchedule,
        { id: generateId(), name: "", percentage: 0, amount: 0, dueDate: "", description: "" },
      ],
    }));
  };

  const updateMilestone = (id: string, updates: Record<string, unknown>) => {
    updateData((d) => ({
      ...d,
      paymentSchedule: d.paymentSchedule.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  };

  const removeMilestone = (id: string) => {
    updateData((d) => ({
      ...d,
      paymentSchedule: d.paymentSchedule.filter((m) => m.id !== id),
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Payment Schedule</h2>
        <p className="text-sm text-muted-foreground">Define payment milestones. Total must equal 100%.</p>
      </div>

      {!validation.valid && schedule.length > 0 && (
        <div className="flex items-center gap-3 p-4 border border-warning/30 bg-warning/5 text-warning">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Payment percentages total {validation.total}% — must equal 100%</p>
        </div>
      )}

      <div className="space-y-4">
        {schedule.map((milestone) => (
          <div key={milestone.id} className="p-5 border border-border bg-card space-y-4">
            <div className="flex justify-between items-start">
              <Input label="Milestone Name" value={milestone.name} onChange={(e) => updateMilestone(milestone.id, { name: e.target.value })} />
              <button onClick={() => removeMilestone(milestone.id)} className="p-2 hover:bg-muted text-danger ml-2 mt-6" aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Percentage (%)"
                type="number"
                min={0}
                max={100}
                value={milestone.percentage}
                onChange={(e) => updateMilestone(milestone.id, { percentage: parseFloat(e.target.value) || 0 })}
              />
              <Input label="Amount (auto)" value={formatINR(milestone.amount)} disabled />
              <Input label="Due Date" type="date" value={milestone.dueDate} onChange={(e) => updateMilestone(milestone.id, { dueDate: e.target.value })} />
            </div>
            <Textarea label="Description" value={milestone.description} onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })} rows={2} />
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addMilestone}>
        <Plus className="h-4 w-4" /> Add Payment Milestone
      </Button>

      {pricing && (
        <div className="p-4 bg-muted text-sm">
          Grand Total: <span className="font-medium tabular-nums">{formatINR(pricing.total)}</span>
        </div>
      )}
    </div>
  );
}
