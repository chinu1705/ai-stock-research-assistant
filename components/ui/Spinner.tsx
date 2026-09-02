"use client";

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div
      className={
        size === "sm"
          ? "h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"
          : size === "lg"
            ? "h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"
            : "h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"
      }
    />
  );
}

export function LoadingCard() {
  return (
    <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4 animate-pulse">
      <div className="h-3 bg-[#1e293b] rounded w-1/3 mb-3" />
      <div className="h-2.5 bg-[#1e293b] rounded w-full mb-2" />
      <div className="h-2.5 bg-[#1e293b] rounded w-2/3" />
    </div>
  );
}
