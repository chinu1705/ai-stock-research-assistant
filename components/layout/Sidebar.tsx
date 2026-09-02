"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTicker } from "@/contexts/TickerContext";
import {
  LayoutDashboard,
  Search,
  Swords,
  FileText,
  TrendingUp,
  Calendar,
  Crosshair,
  Activity,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { ticker } = useTicker();

  const NAV_ITEMS = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: `/research/${ticker}`, label: "Research", icon: Search },
    { href: `/debate/${ticker}`, label: "Debate", icon: Swords },
    { href: "/memo", label: "Memos", icon: FileText },
    { href: `/valuation/${ticker}`, label: "Valuation", icon: TrendingUp },
    { href: "/earnings", label: "Earnings", icon: Calendar },
    { href: "/scanner", label: "Scanner", icon: Crosshair },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-[#0d1117] border-r border-[#1e293b] min-h-screen">
      <div className="p-5 border-b border-[#1e293b]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight">
              AlphaTerminal
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Research Platform
            </p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500"
                  : "text-slate-400 hover:bg-[#161b22] hover:text-slate-200 border-l-2 border-transparent"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#1e293b]">
        <div className="px-3 py-2 text-[10px] text-slate-600 uppercase tracking-widest font-mono">
          {ticker}
        </div>
      </div>
    </aside>
  );
}
