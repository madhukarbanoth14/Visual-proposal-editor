"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { generateId } from "@/lib/utils";
import { formatINR } from "@/lib/pricing";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { AlbumTemplate } from "@/types/quotation";

export function AlbumsStep() {
  const albums = useBuilderStore((s) => s.quotation?.data.albums ?? []);
  const updateData = useBuilderStore((s) => s.updateData);
  const [templates, setTemplates] = useState<AlbumTemplate[]>([]);

  useEffect(() => {
    fetch("/api/albums").then((r) => r.json()).then(setTemplates);
  }, []);

  const addFromTemplate = (template: AlbumTemplate) => {
    updateData((d) => ({
      ...d,
      albums: [
        ...d.albums,
        {
          id: generateId(),
          name: template.name,
          albumType: template.albumType,
          coverImage: template.image,
          size: template.size,
          sheets: template.sheets,
          quantity: 1,
          unitPrice: template.defaultPrice,
          description: template.description,
        },
      ],
    }));
  };

  const addCustom = () => {
    updateData((d) => ({
      ...d,
      albums: [
        ...d.albums,
        { id: generateId(), name: "", albumType: "standard", coverImage: null, size: "", sheets: 0, quantity: 1, unitPrice: 0, description: "" },
      ],
    }));
  };

  const updateAlbum = (id: string, updates: Record<string, unknown>) => {
    updateData((d) => ({
      ...d,
      albums: d.albums.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const removeAlbum = (id: string) => {
    updateData((d) => ({ ...d, albums: d.albums.filter((a) => a.id !== id) }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl mb-2">Albums</h2>
        <p className="text-sm text-muted-foreground">Configure album products for this proposal.</p>
      </div>

      {templates.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {templates.map((t) => (
            <button key={t.id} onClick={() => addFromTemplate(t)} className="p-4 border border-border bg-card hover:border-accent text-left transition-colors">
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.size} · {t.sheets} sheets</p>
              <p className="text-sm text-accent mt-2">{formatINR(t.defaultPrice)}</p>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {albums.map((album) => (
          <div key={album.id} className="p-5 border border-border bg-card space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-heading text-lg">{album.name || "New Album"}</h3>
              <button onClick={() => removeAlbum(album.id)} className="p-2 hover:bg-muted text-danger" aria-label="Remove album">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Album Name" value={album.name} onChange={(e) => updateAlbum(album.id, { name: e.target.value })} />
              <Input label="Album Type" value={album.albumType} onChange={(e) => updateAlbum(album.id, { albumType: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <Input label="Size" value={album.size} onChange={(e) => updateAlbum(album.id, { size: e.target.value })} />
              <Input label="Sheets" type="number" value={album.sheets} onChange={(e) => updateAlbum(album.id, { sheets: parseInt(e.target.value) || 0 })} />
              <Input label="Quantity" type="number" min={1} value={album.quantity} onChange={(e) => updateAlbum(album.id, { quantity: parseInt(e.target.value) || 1 })} />
              <Input label="Price" type="number" min={0} value={album.unitPrice} onChange={(e) => updateAlbum(album.id, { unitPrice: parseFloat(e.target.value) || 0 })} />
            </div>
            <Textarea label="Description" value={album.description} onChange={(e) => updateAlbum(album.id, { description: e.target.value })} rows={2} />
            <ImageUpload label="Cover Image" aspectRatio="square" value={album.coverImage} onChange={(coverImage) => updateAlbum(album.id, { coverImage })} />
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addCustom}>
        <Plus className="h-4 w-4" /> Add Album
      </Button>
    </div>
  );
}
