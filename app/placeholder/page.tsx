"use client";

import { useMemo, useState } from "react";
import { Shapes, Copy, Check } from "lucide-react";
import { ToolPage } from "@/components/layout/tool-page";
import { Card, CardHeader } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSvg(
  width: number,
  height: number,
  bg: string,
  textColor: string,
  label: string,
): string {
  const displayText = label.trim() || `${width} × ${height}`;
  const fontSize = Math.max(12, Math.min(width, height) / 8);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fontSize}" fill="${textColor}">${escapeXml(displayText)}</text>
</svg>`;
}

export default function PlaceholderPage() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState("#1c1c1f");
  const [textColor, setTextColor] = useState("#a1a1aa");
  const [label, setLabel] = useState("");
  const [copied, setCopied] = useState(false);

  const safeWidth = Math.min(4096, Math.max(1, width));
  const safeHeight = Math.min(4096, Math.max(1, height));

  const svgString = useMemo(
    () => buildSvg(safeWidth, safeHeight, bgColor, textColor, label),
    [safeWidth, safeHeight, bgColor, textColor, label],
  );

  const dataUrl = useMemo(
    () => `data:image/svg+xml,${encodeURIComponent(svgString)}`,
    [svgString],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(svgString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPage
      title="SVG Placeholder Generator"
      description="Create customizable SVG placeholders with live preview. Copy the markup for use in prototypes and mockups."
      icon={<Shapes className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Dimensions & colors" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Width"
              type="number"
              min={1}
              max={4096}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <Input
              label="Height"
              type="number"
              min={1}
              max={4096}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Background color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-transparent"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Text color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-transparent"
                />
                <Input
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Input
              label="Display text (optional)"
              placeholder={`Defaults to ${safeWidth} × ${safeHeight}`}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Live preview" />
          <div className="flex items-center justify-center overflow-auto rounded-lg border border-border bg-[repeating-conic-gradient(#1c1c1f_0%_25%,#141416_0%_50%)] bg-[length:16px_16px] p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt="SVG placeholder preview"
              width={safeWidth}
              height={safeHeight}
              className="max-h-72 max-w-full shadow-2xl"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <CardHeader
            title="SVG markup"
            description="Copy and paste into HTML, design tools, or component libraries."
          />
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy SVG
              </>
            )}
          </Button>
        </div>
        <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-background p-4 text-xs leading-relaxed text-muted scrollbar-thin">
          <code>{svgString}</code>
        </pre>
      </Card>
    </ToolPage>
  );
}
