"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";

export function ClientStep() {
  const data = useBuilderStore((s) => s.quotation?.data);
  const updateData = useBuilderStore((s) => s.updateData);

  if (!data) return null;

  const updateClient = (updates: Partial<typeof data.client>) => {
    updateData((d) => {
      const client = { ...d.client, ...updates };
      if (updates.brideName !== undefined || updates.groomName !== undefined) {
        const bride = updates.brideName ?? d.client.brideName;
        const groom = updates.groomName ?? d.client.groomName;
        if (bride && groom && !d.client.displayName) {
          client.displayName = `${bride} & ${groom}`;
        }
      }
      return { ...d, client };
    });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Client Information</h2>
        <p className="text-sm text-muted-foreground">Tell us about the couple and their celebration.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Input label="Bride Name" placeholder="Enter bride's name" value={data.client.brideName} onChange={(e) => updateClient({ brideName: e.target.value })} />
        <Input label="Groom Name" placeholder="Enter groom's name" value={data.client.groomName} onChange={(e) => updateClient({ groomName: e.target.value })} />
      </div>

      <Input
        label="Couple Display Name"
        placeholder="Sanghavi & Mani Kiran"
        value={data.client.displayName}
        onChange={(e) => updateClient({ displayName: e.target.value })}
        hint="Auto-generated from names, or customize"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Input label="Phone" type="tel" placeholder="+91" value={data.client.phone} onChange={(e) => updateClient({ phone: e.target.value })} />
        <Input label="Email" type="email" placeholder="couple@example.com" value={data.client.email} onChange={(e) => updateClient({ email: e.target.value })} />
      </div>

      <Input label="Wedding Location" placeholder="City or venue" value={data.client.location} onChange={(e) => updateClient({ location: e.target.value })} />

      <div className="grid md:grid-cols-2 gap-6">
        <Input label="Wedding Start Date" type="date" value={data.dates.startDate} onChange={(e) => updateData((d) => ({ ...d, dates: { ...d.dates, startDate: e.target.value } }))} />
        <Input label="Wedding End Date" type="date" value={data.dates.endDate} onChange={(e) => updateData((d) => ({ ...d, dates: { ...d.dates, endDate: e.target.value } }))} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Input label="Proposal Date" type="date" value={data.dates.proposalDate} onChange={(e) => updateData((d) => ({ ...d, dates: { ...d.dates, proposalDate: e.target.value } }))} />
        <Input label="Valid Until" type="date" value={data.dates.validUntil} onChange={(e) => updateData((d) => ({ ...d, dates: { ...d.dates, validUntil: e.target.value } }))} />
      </div>

      <Textarea label="Client Notes" placeholder="Any special notes about the client..." rows={3} value={data.client.notes} onChange={(e) => updateClient({ notes: e.target.value })} />

      <div className="border-t border-border pt-10">
        <h3 className="font-heading text-xl mb-6">Cover Images</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <ImageUpload
            label="Couple Hero Image"
            aspectRatio="hero"
            value={data.branding.images.heroImage}
            onChange={(heroImage) =>
              updateData((d) => ({
                ...d,
                branding: { ...d.branding, images: { ...d.branding.images, heroImage } },
              }))
            }
          />
          <ImageUpload
            label="Venue Image"
            aspectRatio="wide"
            value={data.branding.images.venueImage}
            onChange={(venueImage) =>
              updateData((d) => ({
                ...d,
                branding: { ...d.branding, images: { ...d.branding.images, venueImage } },
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}
