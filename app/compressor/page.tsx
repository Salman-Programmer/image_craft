"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageMinus, Download, RotateCcw } from "lucide-react";
import { ToolPage } from "@/components/layout/tool-page";
import { Card, CardHeader } from "@/components/ui/card";
import { DropZone } from "@/components/ui/drop-zone";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { formatBytes, formatPercent, downloadBlob } from "@/lib/format";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

async function compressImage(
  img: HTMLImageElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0);
  const q = quality / 100;
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
      mimeType,
      q,
    );
  });
}

export default function CompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const mimeRef = useRef("image/jpeg");

  const process = useCallback(async (img: HTMLImageElement, q: number) => {
    setProcessing(true);
    try {
      const blob = await compressImage(img, mimeRef.current, q);
      setCompressedBlob(blob);
      setCompressedSize(blob.size);
      setCompressedPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFile = useCallback(
    async (f: File) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(f);
      setFile(f);
      setPreviewUrl(url);
      setOriginalSize(f.size);
      mimeRef.current =
        f.type === "image/png" ? "image/png" : "image/jpeg";
      const img = await loadImage(f);
      imgRef.current = img;
      await process(img, quality);
    },
    [previewUrl, process, quality],
  );

  useEffect(() => {
    if (imgRef.current) process(imgRef.current, quality);
  }, [quality, process]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (compressedPreview) URL.revokeObjectURL(compressedPreview);
    };
  }, [previewUrl, compressedPreview]);

  const reduction =
    originalSize > 0
      ? ((originalSize - compressedSize) / originalSize) * 100
      : 0;

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const ext = mimeRef.current === "image/png" ? "png" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "");
    downloadBlob(compressedBlob, `${base}-compressed.${ext}`);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressedBlob(null);
    if (compressedPreview) URL.revokeObjectURL(compressedPreview);
    setCompressedPreview(null);
    imgRef.current = null;
  };

  return (
    <ToolPage
      title="Image Compressor"
      description="Re-encode JPG and PNG images in your browser with adjustable quality. Compare file sizes instantly."
      icon={<ImageMinus className="h-6 w-6" />}
    >
      {!file ? (
        <Card>
          <CardHeader
            title="Upload image"
            description="Drop a JPG or PNG file to begin compression."
          />
          <DropZone onFile={handleFile} />
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Settings" />
            <Slider
              label="Quality"
              value={quality}
              min={1}
              max={100}
              onChange={setQuality}
              valueLabel={`${quality}%`}
            />
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="Original" value={formatBytes(originalSize)} />
              <Stat
                label="Compressed"
                value={formatBytes(compressedSize)}
              />
              <Stat
                label="Saved"
                value={formatPercent(reduction)}
                highlight={reduction > 0}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={handleDownload}
                disabled={!compressedBlob || processing}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
                New image
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Preview" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                  Original
                </p>
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="max-h-64 w-full rounded-lg border border-border object-contain bg-surface-elevated"
                  />
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                  Compressed
                  {processing && (
                    <span className="ml-2 text-accent">Updating…</span>
                  )}
                </p>
                {compressedPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={compressedPreview}
                    alt="Compressed"
                    className="max-h-64 w-full rounded-lg border border-border object-contain bg-surface-elevated"
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </ToolPage>
  );
}
