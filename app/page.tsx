import Link from "next/link";
import {
  ImageMinus,
  Crop,
  Shapes,
  ArrowRight,
  Zap,
  Shield,
  Monitor,
} from "lucide-react";
import { Card } from "@/components/card";

const tools = [
  {
    href: "/compressor",
    title: "Image Compressor",
    description:
      "Reduce JPG and PNG file sizes with a quality slider. See savings in real time.",
    icon: ImageMinus,
    accent: "from-blue-500/20 to-blue-600/5",
  },
  {
    href: "/cropper",
    title: "Image Cropper",
    description:
      "Crop, rotate, and export images with preset aspect ratios — all in the browser.",
    icon: Crop,
    accent: "from-violet-500/20 to-violet-600/5",
  },
  {
    href: "/placeholder",
    title: "SVG Placeholder",
    description:
      "Generate customizable SVG placeholders with live preview and copyable markup.",
    icon: Shapes,
    accent: "from-emerald-500/20 to-emerald-600/5",
  },
];

const features = [
  {
    icon: Zap,
    title: "Instant processing",
    text: "Canvas and File APIs — no uploads, no waiting.",
  },
  {
    icon: Shield,
    title: "Private by design",
    text: "Images never leave your device. Zero server calls.",
  },
  {
    icon: Monitor,
    title: "Works everywhere",
    text: "Responsive layout for desktop and mobile.",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
          Dashboard
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Image & Asset Toolbox
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          A minimalist suite of browser-native tools for compressing, cropping,
          and generating placeholder assets — fast, private, and free.
        </p>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(({ href, title, description, icon: Icon, accent }) => (
          <Link key={href} href={href} className="group block">
            <Card
              className={`h-full transition-all duration-200 hover:border-muted/60 hover:bg-surface-elevated/80 bg-gradient-to-br ${accent}`}
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
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Why this toolbox
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="!p-4">
              <Icon className="mb-3 h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
