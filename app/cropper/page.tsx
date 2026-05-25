"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Crop, Download, RotateCcw, RotateCw, Square } from "lucide-react";
import type { ReactCropperElement } from "react-cropper";
import { ToolPage } from "@/components/layout/tool-page";
import { Card, CardHeader } from "@/components/card";
import { DropZone } from "@/components/ui/drop-zone";
import { Button } from "@/components/ui/button";
import { downloadBlob } from "@/lib/format";

const Cropper = dynamic(
  () => import("react-cropper").then((mod) => mod.Cropper),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-lg bg-surface-elevated text-sm text-muted">
        Loading cropper…
      </div>
    ),
  },
);

type AspectPreset = {
  label: string;
  ratio: number | undefined;
};

const aspectPresets: AspectPreset[] = [
  { label: "Free", ratio: undefined },
  { label: "1:1", ratio: 1 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "9:16", ratio: 9 / 16 },
];

export default function CropperPage() {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("cropped.jpg");
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      const base = file.name.replace(/\.[^.]+$/, "");
      const ext = file.type === "image/png" ? "png" : "jpg";
      setFileName(`${base}-cropped.${ext}`);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = () => {
    setImageSrc(null);
    setAspectRatio(undefined);
  };

  const rotate = (deg: number) => {
    cropperRef.current?.cropper.rotate(deg);
  };

  const setAspect = (ratio: number | undefined) => {
    setAspectRatio(ratio);
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.setAspectRatio(ratio ?? NaN);
    }
  };

  const handleDownload = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });
    const isPng = fileName.endsWith(".png");
    canvas.toBlob(
      (blob) => {
        if (blob) downloadBlob(blob, fileName);
      },
      isPng ? "image/png" : "image/jpeg",
      0.92,
    );
  };

  return (
    <ToolPage
      title="Image Cropper"
description=""      icon={<Crop className="h-6 w-6" />}
    >
      {!imageSrc ? (
        <Card>
          <CardHeader
            title="Upload image"
            description="Drop a JPG or PNG to open the cropping workspace."
          />
          <DropZone onFile={handleFile} />
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Crop workspace" />
            <div className="overflow-hidden rounded-lg bg-black/40">
              <Cropper
                ref={cropperRef}
                src={imageSrc}
                style={{ height: 420, width: "100%" }}
                aspectRatio={aspectRatio}
                viewMode={1}
                dragMode="move"
                autoCropArea={0.8}
                responsive
                guides
                background={false}
                checkOrientation
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Controls" />
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                  Aspect ratio
                </p>
                <div className="flex flex-wrap gap-2">
                  {aspectPresets.map(({ label, ratio }) => (
                    <Button
                      key={label}
                      variant={
                        aspectRatio === ratio ? "primary" : "secondary"
                      }
                      size="sm"
                      onClick={() => setAspect(ratio)}
                    >
                      <Square className="h-3.5 w-3.5" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => rotate(-90)}>
                  <RotateCcw className="h-4 w-4" />
                  Rotate left
                </Button>
                <Button variant="secondary" size="sm" onClick={() => rotate(90)}>
                  <RotateCw className="h-4 w-4" />
                  Rotate right
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  New image
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </ToolPage>
  );
}
