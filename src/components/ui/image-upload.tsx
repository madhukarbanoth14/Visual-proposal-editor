"use client";

import { cn } from "@/lib/utils";
import { Upload, X, ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { fileToBase64 } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  aspectRatio?: "square" | "wide" | "hero";
  className?: string;
}

export function ImageUpload({ value, onChange, label, aspectRatio = "wide", className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const base64 = await fileToBase64(file);
      onChange(base64);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <span className="block text-xs font-medium tracking-wider uppercase text-muted-foreground">{label}</span>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative overflow-hidden border border-dashed transition-all duration-200",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "wide" && "aspect-[16/9]",
          aspectRatio === "hero" && "aspect-[3/4]",
          isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
          value ? "border-solid" : ""
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center bg-primary/80 text-primary-foreground transition-opacity hover:bg-primary"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-primary/0 opacity-0 transition-all hover:bg-primary/40 hover:opacity-100">
              <span className="text-sm text-white tracking-wide">Replace</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
          </>
        ) : (
          <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-3 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              {isDragging ? <Upload className="h-5 w-5 text-accent" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground">Drop image here or click to upload</p>
              <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        )}
      </div>
    </div>
  );
}
