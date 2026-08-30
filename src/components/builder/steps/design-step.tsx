"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import type { ProposalTheme } from "@/types/quotation";
import { cn } from "@/lib/utils";

const THEMES: { id: ProposalTheme; label: string; description: string }[] = [
  { id: "luxury", label: "Luxury", description: "Warm gold accents, elegant serif typography" },
  { id: "editorial", label: "Editorial", description: "Bold, magazine-inspired layout" },
  { id: "classic", label: "Classic", description: "Timeless, refined aesthetic" },
  { id: "modern", label: "Modern", description: "Clean lines, contemporary feel" },
  { id: "minimal", label: "Minimal", description: "Understated, whitespace-focused" },
  { id: "traditional", label: "Traditional", description: "Rich, cultural warmth" },
];

export function DesignStep() {
  const data = useBuilderStore((s) => s.quotation?.data);
  const updateData = useBuilderStore((s) => s.updateData);

  if (!data) return null;

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Design & Branding</h2>
        <p className="text-sm text-muted-foreground">Customize the visual identity of this proposal.</p>
      </div>

      <div>
        <h3 className="text-xs tracking-wider uppercase text-muted-foreground mb-4">Proposal Theme</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => updateData((d) => ({ ...d, template: theme.id }))}
              className={cn(
                "p-5 border text-left transition-all",
                data.template === theme.id ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-accent/50"
              )}
            >
              <p className="font-heading text-lg">{theme.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-8 space-y-6">
        <h3 className="font-heading text-xl">Brand Settings</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Company Name" value={data.branding.companyName} onChange={(e) => updateData((d) => ({ ...d, branding: { ...d.branding, companyName: e.target.value } }))} />
          <Input label="Tagline" value={data.branding.tagline} onChange={(e) => updateData((d) => ({ ...d, branding: { ...d.branding, tagline: e.target.value } }))} />
          <Input label="Phone" value={data.branding.phone} onChange={(e) => updateData((d) => ({ ...d, branding: { ...d.branding, phone: e.target.value } }))} />
          <Input label="Email" value={data.branding.email} onChange={(e) => updateData((d) => ({ ...d, branding: { ...d.branding, email: e.target.value } }))} />
          <Input label="Website" value={data.branding.website} onChange={(e) => updateData((d) => ({ ...d, branding: { ...d.branding, website: e.target.value } }))} />
          <Input label="Instagram" value={data.branding.instagram} onChange={(e) => updateData((d) => ({ ...d, branding: { ...d.branding, instagram: e.target.value } }))} />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">Primary Color</label>
            <input type="color" value={data.branding.primaryColor} onChange={(e) => updateData((d) => ({ ...d, branding: { ...d.branding, primaryColor: e.target.value } }))} className="w-full h-12 cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">Secondary Color</label>
            <input type="color" value={data.branding.secondaryColor} onChange={(e) => updateData((d) => ({ ...d, branding: { ...d.branding, secondaryColor: e.target.value } }))} className="w-full h-12 cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">Accent Color</label>
            <input type="color" value={data.branding.accentColor} onChange={(e) => updateData((d) => ({ ...d, branding: { ...d.branding, accentColor: e.target.value } }))} className="w-full h-12 cursor-pointer" />
          </div>
        </div>

        <ImageUpload
          label="Logo"
          aspectRatio="square"
          value={data.branding.logo}
          onChange={(logo) => updateData((d) => ({ ...d, branding: { ...d.branding, logo } }))}
        />
      </div>

      <div className="border-t border-border pt-8 space-y-4">
        <h3 className="font-heading text-xl">Messages</h3>
        <Textarea label="Welcome Message" value={data.welcomeMessage} onChange={(e) => updateData((d) => ({ ...d, welcomeMessage: e.target.value }))} rows={3} />
        <Textarea label="Thank You Message" value={data.thankYouMessage} onChange={(e) => updateData((d) => ({ ...d, thankYouMessage: e.target.value }))} rows={3} />
      </div>
    </div>
  );
}
