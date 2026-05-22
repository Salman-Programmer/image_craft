"use client";

import { useCallback, useRef, useState, type DragEvent, type ReactNode } from "react";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  children?: ReactNode;
  hint?: string;
}

export function DropZone({
  onFile,
  accept = "image/jpeg,image/png",
  children,
  hint = "JPG or PNG — drag & drop or click to browse",
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const validTypes = accept.split(",").map((t) => t.trim());
      if (
        validTypes.length > 0 &&
        !validTypes.some(
          (t) =>
            file.type === t ||
            (t.endsWith("/*") && file.type.startsWith(t.replace("/*", "/"))),
        )
      ) {
        return;
      }
      onFile(file);
    },
    [accept, onFile],
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
        isDragging
          ? "border-accent bg-accent/5 scale-[1.01]"
          : "border-border hover:border-muted/50 hover:bg-surface-elevated/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {children ?? (
        <>
          <div
            className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              isDragging ? "bg-accent/20 text-accent" : "bg-surface-elevated text-muted group-hover:text-foreground"
            }`}
          >
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Drop your image here
          </p>
          <p className="mt-1 text-xs text-muted">{hint}</p>
        </>
      )}
    </div>
  );
}
