import type { ReactNode } from "react";

interface ToolPageProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export function ToolPage({ title, description, icon, children }: ToolPageProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
          {icon}
        </div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
          {description}
        </p>
      </header>
      {children}
    </div>
  );
}
