"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { generateId, formatDate } from "@/lib/utils";
import type { QuotationEvent } from "@/types/quotation";
import { Plus, GripVertical, Copy, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

function createEmptyEvent(sortOrder: number): QuotationEvent {
  return {
    id: generateId(),
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    timeLabel: "",
    location: "",
    description: "",
    image: null,
    services: [],
    deliverables: [],
    notes: "",
    sortOrder,
  };
}

function SortableEventCard({ event, onEdit, onDuplicate, onDelete }: {
  event: QuotationEvent;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: event.id });
  const [expanded, setExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-border bg-card transition-shadow",
        isDragging && "shadow-lg z-10"
      )}
    >
      <div className="flex items-start gap-4 p-5">
        <button {...attributes} {...listeners} className="mt-1 cursor-grab text-muted-foreground hover:text-foreground" aria-label="Drag to reorder">
          <GripVertical className="h-5 w-5" />
        </button>

        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.image} alt="" className="w-20 h-20 object-cover shrink-0" />
        ) : (
          <div className="w-20 h-20 bg-muted shrink-0 flex items-center justify-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider text-center px-1">{event.name || "Event"}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-xl">{event.name || "Untitled Event"}</h3>
          <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">
            {event.date ? formatDate(event.date, { day: "numeric", month: "long", year: "numeric" }) : "No date"}
            {event.timeLabel && ` · ${event.timeLabel}`}
          </p>
          {event.location && <p className="text-sm text-muted-foreground mt-1">{event.location}</p>}
          {event.services.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">{event.services.length} service(s) assigned</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="p-2 hover:bg-muted transition-colors" aria-label={expanded ? "Collapse" : "Expand"}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button onClick={onDuplicate} className="p-2 hover:bg-muted transition-colors" aria-label="Duplicate event">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-muted text-danger transition-colors" aria-label="Delete event">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border p-5 space-y-6 animate-fade-in">
          <EventEditor eventId={event.id} />
        </div>
      )}
    </div>
  );
}

function EventEditor({ eventId }: { eventId: string }) {
  const updateData = useBuilderStore((s) => s.updateData);
  const event = useBuilderStore((s) => s.quotation?.data.events.find((e) => e.id === eventId));

  if (!event) return null;

  const updateEvent = (updates: Partial<QuotationEvent>) => {
    updateData((d) => ({
      ...d,
      events: d.events.map((e) => (e.id === eventId ? { ...e, ...updates } : e)),
    }));
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Event Name" value={event.name} onChange={(e) => updateEvent({ name: e.target.value })} placeholder="Wedding, Reception..." />
        <Input label="Event Date" type="date" value={event.date} onChange={(e) => updateEvent({ date: e.target.value })} />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Input label="Start Time" type="time" value={event.startTime} onChange={(e) => updateEvent({ startTime: e.target.value })} />
        <Input label="End Time" type="time" value={event.endTime} onChange={(e) => updateEvent({ endTime: e.target.value })} />
        <Input label="Time Label" value={event.timeLabel} onChange={(e) => updateEvent({ timeLabel: e.target.value })} placeholder="Morning, Evening..." />
      </div>
      <Input label="Location" value={event.location} onChange={(e) => updateEvent({ location: e.target.value })} />
      <Textarea label="Description" value={event.description} onChange={(e) => updateEvent({ description: e.target.value })} rows={2} />
      <ImageUpload
        label="Event Image"
        aspectRatio="wide"
        value={event.image}
        onChange={(image) => updateEvent({ image })}
      />
    </>
  );
}

export function EventsStep() {
  const events = useBuilderStore((s) => s.quotation?.data.events ?? []);
  const updateData = useBuilderStore((s) => s.updateData);
  const [viewMode, setViewMode] = useState<"cards" | "timeline">("cards");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addEvent = () => {
    updateData((d) => ({
      ...d,
      events: [...d.events, createEmptyEvent(d.events.length)],
    }));
  };

  const duplicateEvent = (eventId: string) => {
    updateData((d) => {
      const event = d.events.find((e) => e.id === eventId);
      if (!event) return d;
      const copy = { ...event, id: generateId(), name: `${event.name} (Copy)`, sortOrder: d.events.length };
      return { ...d, events: [...d.events, copy] };
    });
  };

  const deleteEvent = (eventId: string) => {
    updateData((d) => ({
      ...d,
      events: d.events.filter((e) => e.id !== eventId).map((e, i) => ({ ...e, sortOrder: i })),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    updateData((d) => {
      const oldIndex = d.events.findIndex((e) => e.id === active.id);
      const newIndex = d.events.findIndex((e) => e.id === over.id);
      const reordered = [...d.events];
      const [removed] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, removed);
      return { ...d, events: reordered.map((e, i) => ({ ...e, sortOrder: i })) };
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-heading text-2xl mb-2">Wedding Events</h2>
          <p className="text-sm text-muted-foreground">Add and organize all celebration events.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("cards")}
            className={cn("px-3 py-1.5 text-xs tracking-wider uppercase", viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-muted")}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={cn("px-3 py-1.5 text-xs tracking-wider uppercase", viewMode === "timeline" ? "bg-primary text-primary-foreground" : "bg-muted")}
          >
            Timeline
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground mb-6">No events added yet</p>
          <Button onClick={addEvent}>
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        </div>
      ) : viewMode === "timeline" ? (
        <div className="relative pl-8 border-l border-border space-y-8">
          {events.map((event) => (
            <div key={event.id} className="relative">
              <div className="absolute -left-[33px] top-1 h-3 w-3 rounded-full bg-accent border-2 border-background" />
              <p className="text-xs tracking-wider uppercase text-accent mb-1">
                {event.date ? formatDate(event.date, { day: "numeric", month: "short" }) : "TBD"}
              </p>
              <h3 className="font-heading text-lg">{event.name}</h3>
              {event.timeLabel && <p className="text-sm text-muted-foreground">{event.timeLabel}</p>}
            </div>
          ))}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {events.map((event) => (
                <SortableEventCard
                  key={event.id}
                  event={event}
                  onEdit={() => {}}
                  onDuplicate={() => duplicateEvent(event.id)}
                  onDelete={() => deleteEvent(event.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {events.length > 0 && (
        <Button variant="outline" onClick={addEvent}>
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      )}
    </div>
  );
}
