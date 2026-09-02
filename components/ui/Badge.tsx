"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase",
        variant === "default" &&
          "bg-[#1e293b] text-slate-300",
        variant === "success" &&
          "bg-emerald-500/10 text-emerald-400",
        variant === "danger" &&
          "bg-red-500/10 text-red-400",
        variant === "warning" &&
          "bg-amber-500/10 text-amber-400",
        variant === "info" &&
          "bg-blue-500/10 text-blue-400",
        className
      )}
    >
      {children}
    </span>
  );
}
