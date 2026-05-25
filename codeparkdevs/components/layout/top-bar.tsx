"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Sun, Moon, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function TopBar() {
  const { userId } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (!userId) return;

    // Fetch initial credits
    fetch("/api/user/credits")
      .then((r) => r.json())
      .then((d) => setCredits(d.credits ?? 0))
      .catch(() => setCredits(0));

    // Real-time credits via Supabase subscription
    const supabase = createClient();
    const channel = supabase
      .channel("credits")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setCredits((payload.new as { credits: number }).credits);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("theme", next);
  };

  return (
    <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] bg-[#111009] shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#F2EDE6] tracking-wide lg:hidden">
          CPD<span className="text-[#C8A882]">{"}"}</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        {/* Credits badge */}
        {credits !== null && (
          <div className="flex items-center gap-1.5 h-7 px-3 rounded-[6px] bg-[#1A1712] border border-[#2C271F] text-[12px] font-mono">
            <Zap style={{ width: 11, height: 11, color: "#C8A882" }} />
            <span className="text-[#C8A882] font-semibold">{credits.toLocaleString()}</span>
            <span className="text-[#6B5E50]">credits</span>
          </div>
        )}
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] border border-transparent hover:border-[#2C271F] transition-all duration-150"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun style={{ width: 14, height: 14 }} />
          ) : (
            <Moon style={{ width: 14, height: 14 }} />
          )}
        </button>
        {/* Clerk user button */}
        <UserButton
          appearance={{
            variables: { colorPrimary: "#C8A882" },
            elements: {
              avatarBox: "w-8 h-8 rounded-full border border-[#C8A882]/30",
            },
          }}
        />
      </div>
    </header>
  );
}

// Keep default export for backward compatibility
export default TopBar;
