import Link from "next/link";
import {
  ImageMinus,
  Crop,
  Shapes,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/card";

const tools = [
  {
    href: "/compressor",
    title: "Image Compressor",
    description: "Reduce JPG and PNG file sizes for free.",
    icon: ImageMinus,
    accent: "from-blue-500/20 to-blue-600/5",
  },
  {
    href: "/cropper",
    title: "Image Cropper",
    description: "Crop, rotate, and export images for free.",
    icon: Crop,
    accent: "from-violet-500/20 to-violet-600/5",
  },
  {
    href: "/placeholder",
    title: "SVG Placeholder",
    description: "Generate customizable SVGs for free ^_^.",
    icon: Shapes,
    accent: "from-emerald-500/20 to-emerald-600/5",
  },
];

export default function DashboardPage() {
  return (
    <div className="w-full">
      <section className="min-h-[60vh] flex items-center justify-center py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 place-content-center">
          {tools.map(({ href, title, description, icon: Icon, accent }) => (
            <Link key={href} href={href} className="group block">
              <Card
                className={`h-full transition-all duration-200 hover:border-muted/60 hover:bg-surface-elevated/80 bg-linear-to-br ${accent}`}
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Open tool
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}