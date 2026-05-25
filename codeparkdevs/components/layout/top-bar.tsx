"use client";

import { Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  artisanLabel?: string;
}

export default function TopBar({ title, artisanLabel }: TopBarProps) {
  return (
    <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] bg-[#0E0C08] shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-medium text-[#F2EDE6] tracking-wide">{title}</h1>
        {artisanLabel && (
          <span className="artisan-label">[ {artisanLabel} ]</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-[background-color,color] duration-150 active:scale-[0.97]"
          aria-label="Search"
        >
          <Search style={{ width: 15, height: 15 }} />
        </button>
        <button
          className="relative w-8 h-8 rounded-[8px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-[background-color,color] duration-150 active:scale-[0.97]"
          aria-label="Notifications"
        >
          <Bell style={{ width: 15, height: 15 }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A882]" />
        </button>
        {/* Avatar with initials */}
        <div className="w-7 h-7 rounded-full border border-[#C8A882]/30 bg-[#221E18] flex items-center justify-center text-[11px] font-medium text-[#C8A882] ml-1 cursor-pointer hover:border-[#C8A882]/60 transition-[border-color] duration-150">
          A
        </div>
      </div>
    </header>
  );
}
