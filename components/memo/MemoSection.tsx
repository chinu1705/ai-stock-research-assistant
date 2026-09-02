"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { FileText } from "lucide-react";

interface MemoSectionProps {
  title: string;
  content: string;
  variant?: "default" | "highlight";
}

export function MemoSection({
  title,
  content,
  variant = "default",
}: MemoSectionProps) {
  return (
    <Card
      className={
        variant === "highlight"
          ? "border-blue-500/20 bg-blue-500/5"
          : undefined
      }
    >
      <CardContent>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" />
          {title}
        </h3>
        <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
