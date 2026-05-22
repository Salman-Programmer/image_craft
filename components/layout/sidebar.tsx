"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ImageMinus,
  Crop,
  Shapes,
  Menu,
  X,
  Wrench,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/compressor", label: "Compressor", icon: ImageMinus },
  { href: "/cropper", label: "Cropper", icon: Crop },
  { href: "/placeholder", label: "Placeholder", icon: Shapes },
];

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-accent/15 text-accent"
          : "text-muted hover:bg-surface-elevated hover:text-foreground"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur-md lg:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              isActive ? "text-accent" : "text-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Wrench className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">Asset Toolbox</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-elevated hover:text-foreground"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:top-0`}
      >
        <div className="hidden border-b border-border p-5 lg:block">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                Image & Asset
              </p>
              <p className="text-xs text-muted">Toolbox</p>
            </div>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4 pt-20 lg:pt-4 scrollbar-thin">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted/70">
            Tools
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-[11px] leading-relaxed text-muted">
            100% client-side. Your files never leave the browser.
          </p>
        </div>
      </aside>

      <MobileBottomNav />
    </>
  );
}
