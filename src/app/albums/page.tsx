"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/pricing";
import type { AlbumTemplate } from "@/types/quotation";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<AlbumTemplate[]>([]);

  useEffect(() => {
    fetch("/api/albums").then((r) => r.json()).then(setAlbums);
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-heading text-3xl mb-2">Album Library</h1>
      <p className="text-sm text-muted-foreground mb-10">Reusable album products for your proposals.</p>
      <div className="grid md:grid-cols-2 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="flex gap-5 p-5 border border-border bg-card">
            <div className="w-24 h-24 bg-muted shrink-0 flex items-center justify-center">
              <span className="font-heading text-sm text-muted-foreground">Album</span>
            </div>
            <div>
              <h3 className="text-sm font-medium">{album.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{album.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{album.size} · {album.sheets} sheets</p>
              <p className="text-sm text-accent mt-2 tabular-nums">{formatINR(album.defaultPrice)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
