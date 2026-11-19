"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  initial?: string;
  placeholder?: string;
  onCommit: (value: string) => void;
  delay?: number;
};

// টাইপ থামার একটু পরে তবেই search চালায়, প্রতিটা অক্ষরে নয়
export default function SearchBox({
  initial = "",
  placeholder = "Search...",
  onCommit,
  delay = 400,
}: Props) {
  const [value, setValue] = useState(initial);
  const commitRef = useRef(onCommit);

  useEffect(() => {
    commitRef.current = onCommit;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim() !== initial.trim()) commitRef.current(value.trim());
    }, delay);
    return () => clearTimeout(timer);
  }, [value, initial, delay]);

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl pr-10 pl-10"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setValue("")}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}