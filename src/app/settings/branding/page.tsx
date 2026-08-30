"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { useToastStore } from "@/store/builder-store";

interface BrandSettings {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
}

export default function BrandingSettingsPage() {
  const [brand, setBrand] = useState<BrandSettings | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    fetch("/api/settings/branding").then((r) => r.json()).then(setBrand);
  }, []);

  const save = async () => {
    if (!brand) return;
    await fetch("/api/settings/branding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brand),
    });
    addToast("Brand settings saved");
  };

  if (!brand) return <div className="p-8 animate-pulse">Loading...</div>;

  const update = (updates: Partial<BrandSettings>) => setBrand((b) => b ? { ...b, ...updates } : b);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-heading text-3xl mb-2">Brand Settings</h1>
      <p className="text-sm text-muted-foreground mb-10">Configure your studio branding for all proposals.</p>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Company Name" value={brand.companyName} onChange={(e) => update({ companyName: e.target.value })} />
          <Input label="Tagline" value={brand.tagline} onChange={(e) => update({ tagline: e.target.value })} />
          <Input label="Phone" value={brand.phone} onChange={(e) => update({ phone: e.target.value })} />
          <Input label="Email" value={brand.email} onChange={(e) => update({ email: e.target.value })} />
          <Input label="Website" value={brand.website} onChange={(e) => update({ website: e.target.value })} />
          <Input label="Instagram" value={brand.instagram} onChange={(e) => update({ instagram: e.target.value })} />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">Primary</label>
            <input type="color" value={brand.primaryColor} onChange={(e) => update({ primaryColor: e.target.value })} className="w-full h-12 cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">Secondary</label>
            <input type="color" value={brand.secondaryColor} onChange={(e) => update({ secondaryColor: e.target.value })} className="w-full h-12 cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">Accent</label>
            <input type="color" value={brand.accentColor} onChange={(e) => update({ accentColor: e.target.value })} className="w-full h-12 cursor-pointer" />
          </div>
        </div>

        <ImageUpload label="Logo" aspectRatio="square" value={brand.logo} onChange={(logo) => update({ logo })} />

        <Button onClick={save}>Save Brand Settings</Button>
      </div>
    </div>
  );
}
