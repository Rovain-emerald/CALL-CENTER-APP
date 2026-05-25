"use client";

import { Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-[#1E1E1E] bg-[#0A0A0A] shrink-0">
      <h1 className="text-sm font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-1">
        <button
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center",
            "text-[#666] hover:text-white hover:bg-[#1A1A1A]",
            "transition-[background-color,color] duration-150 active:scale-[0.97]"
          )}
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          className={cn(
            "relative w-9 h-9 rounded-xl flex items-center justify-center",
            "text-[#666] hover:text-white hover:bg-[#1A1A1A]",
            "transition-[background-color,color] duration-150 active:scale-[0.97]"
          )}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#00FF87]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] ml-1 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:opacity-90 transition-opacity duration-150">
          A
        </div>
      </div>
    </header>
  );
}
