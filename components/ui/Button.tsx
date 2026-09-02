"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none font-mono text-xs",
        variant === "primary" &&
          "bg-blue-600 text-white hover:bg-blue-500",
        variant === "secondary" &&
          "bg-[#1e293b] text-slate-300 hover:bg-[#2d3748] border border-[#2d3748]",
        variant === "ghost" &&
          "text-slate-400 hover:bg-[#161b22] hover:text-slate-200",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-500",
        size === "sm" && "px-2.5 py-1.5",
        size === "md" && "px-3 py-2",
        size === "lg" && "px-4 py-2.5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
