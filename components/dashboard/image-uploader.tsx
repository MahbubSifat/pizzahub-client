"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const MAX_IMAGES = 4;
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

type Props = { value: string[]; onChange: (urls: string[]) => void };

export default function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);

  async function uploadOne(file: File): Promise<string | null> {
    if (!TYPES.includes(file.type)) {
      toast.error(`${file.name}: only JPG, PNG or WebP images are allowed`);
      return null;
    }
    if (file.size > MAX_BYTES) {
      toast.error(`${file.name}: image must be 4MB or smaller`);
      return null;
    }
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        toast.error(data.message ?? "Image upload failed");
        return null;
      }
      return data.url as string;
    } catch {
      toast.error("Image upload failed. Check your connection.");
      return null;
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const room = MAX_IMAGES - value.length;
    const chosen = Array.from(files).slice(0, Math.max(room, 0));
    if (files.length > chosen.length) {
      toast.error(`You can add up to ${MAX_IMAGES} images`);
    }
    if (chosen.length === 0) return;

    setUploading(chosen.length);
    const results = await Promise.all(chosen.map(uploadOne));
    setUploading(0);

    const urls = results.filter((url): url is string => Boolean(url));
    if (urls.length > 0) onChange([...value, ...urls]);
    if (inputRef.current) inputRef.current.value = "";
  }

  const canAdd = value.length + uploading < MAX_IMAGES;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={url}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border bg-secondary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Menu item ${index + 1}`} className="size-full object-cover" />
            {index === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium">
                Cover
              </span>
            )}
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(value.filter((item) => item !== url))}
              className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition-colors hover:bg-destructive hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        {Array.from({ length: uploading }).map((_, index) => (
          <div
            key={`loading-${index}`}
            className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed bg-secondary"
          >
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ImagePlus className="size-6" />
            <span className="text-xs font-medium">Add image</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        Up to {MAX_IMAGES} images, JPG, PNG or WebP, 4MB each. The first image is the cover.
      </p>
    </div>
  );
}