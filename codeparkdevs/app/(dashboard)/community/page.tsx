"use client";

import { ExternalLink, Users, Zap, MessageSquare, Calendar, Megaphone, GitMerge, Sparkles, ChevronRight } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    id: 1,
    type: "feature" as const,
    title: "FLUX Pro Image Generation is Live",
    content: "Generate photorealistic images with FLUX Pro — our highest-quality model. Try it now in the Create tab.",
    time: "2 days ago",
  },
  {
    id: 2,
    type: "changelog" as const,
    title: "v1.2 — Social Scheduler + 7 Platform Connectors",
    content: "Schedule posts to Instagram, Facebook, Twitter/X, LinkedIn, TikTok, YouTube, and Pinterest from one place.",
    time: "1 week ago",
  },
  {
    id: 3,
    type: "announcement" as const,
    title: "Welcome to Codeparkdevs",
    content: "We are thrilled to have you on board. Start by creating your first AI agent or generating your first image.",
    time: "2 weeks ago",
  },
];

const CHANGELOG = [
  { version: "v1.2", title: "Image Generation v2 — FLUX Pro integration", date: "May 2025" },
  { version: "v1.1", title: "Social Scheduler + 7 platform connectors", date: "Apr 2025" },
  { version: "v1.0", title: "Platform Launch — AI Agents, Chat, Studio", date: "Mar 2025" },
];

const TYPE_CONFIG = {
  feature:      { label: "Feature",      color: "#C8A882", bg: "#C8A882/12", border: "#C8A882/25" },
  changelog:    { label: "Changelog",    color: "#8A9E8C", bg: "#8A9E8C/12", border: "#8A9E8C/25" },
  announcement: { label: "Announcement", color: "#A89880", bg: "#A89880/12", border: "#A89880/25" },
};

export default function CommunityPage() {
  const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "#";

  return (
    <div className="flex flex-col h-full">
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#F2EDE6] tracking-wide">Community</span>
          <span className="font-mono text-[10px] text-[#6B5E50] border border-[#2C271F] px-2 py-0.5 rounded-[4px]">[ discord: online ]</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 max-w-[820px] mx-auto w-full">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Members",       value: "1,247", icon: Users,          mono: "community.size" },
            { label: "Online Now",    value: "89",    icon: Zap,            mono: "discord.online" },
            { label: "Posts Today",   value: "34",    icon: MessageSquare,  mono: "posts.today" },
            { label: "Events / Week", value: "2",     icon: Calendar,       mono: "events.week" },
          ].map(({ label, value, icon: Icon, mono }) => (
            <div key={label} className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-4">
              <p className="font-mono text-[10px] text-[#6B5E50] mb-3 tracking-wide">{mono}</p>
              <p className="text-[26px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)", letterSpacing: "-0.02em" }}>{value}</p>
              <p className="text-[11px] text-[#6B5E50] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Discord CTA */}
        <div className="bg-[#1A1712] border border-[#5865F2]/20 rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-14 h-14 rounded-[14px] bg-[#5865F2]/15 border border-[#5865F2]/25 flex items-center justify-center shrink-0">
            <MessageSquare style={{ width: 24, height: 24, color: "#5865F2" }} />
          </div>
          <div className="flex-1">
            <h2 className="text-[20px] text-[#F2EDE6] mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>
              Join our community
            </h2>
            <p className="text-[13px] text-[#6B5E50]">
              Get help, share your work, and connect with other creators. 1,247 members and growing.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <a
              href={discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-9 px-5 rounded-[8px] text-[13px] font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] transition-[background-color,transform] duration-150 active:scale-[0.97]"
            >
              Join Discord <ExternalLink style={{ width: 12, height: 12 }} />
            </a>
            <button className="text-[12px] text-[#6B5E50] hover:text-[#C8A882] transition-[color] duration-150 flex items-center gap-1">
              Browse announcements <ChevronRight style={{ width: 11, height: 11 }} />
            </button>
          </div>
        </div>

        {/* Announcements */}
        <section>
          <h3 className="text-[16px] text-[#F2EDE6] mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
            <Megaphone style={{ width: 15, height: 15, color: "#C8A882" }} />
            Platform Announcements
          </h3>
          <div className="space-y-2">
            {ANNOUNCEMENTS.map((a) => {
              const cfg = TYPE_CONFIG[a.type];
              return (
                <div key={a.id} className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-4 hover:border-[#3A3328] transition-[border-color] duration-150">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                          style={{ color: cfg.color, backgroundColor: `${cfg.color}1a`, borderColor: `${cfg.color}40` }}
                        >
                          {cfg.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#6B5E50]">{a.time}</span>
                      </div>
                      <p className="text-[13px] font-medium text-[#F2EDE6] mb-1">{a.title}</p>
                      <p className="text-[12px] text-[#6B5E50] leading-relaxed">{a.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Changelog */}
        <section>
          <h3 className="text-[16px] text-[#F2EDE6] mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
            <GitMerge style={{ width: 15, height: 15, color: "#8A9E8C" }} />
            What&apos;s New
          </h3>
          <div className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] overflow-hidden">
            {CHANGELOG.map((item, i) => (
              <div key={item.version} className={`flex items-center gap-4 px-4 py-3 ${i < CHANGELOG.length - 1 ? "border-b border-[#2C271F]" : ""} hover:bg-[#1E1B15] transition-[background-color] duration-75`}>
                <span className="font-mono text-[11px] text-[#C8A882] w-10 shrink-0">{item.version}</span>
                <span className="text-[13px] text-[#A89880] flex-1">{item.title}</span>
                <span className="font-mono text-[10px] text-[#4A4135] shrink-0">{item.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Requests */}
        <section>
          <div className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#C8A882]/10 border border-[#C8A882]/20 flex items-center justify-center">
                <Sparkles style={{ width: 16, height: 16, color: "#C8A882" }} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#F2EDE6]">Vote on upcoming features</p>
                <p className="text-[12px] text-[#6B5E50]">Help shape the roadmap — your vote counts.</p>
              </div>
            </div>
            <a
              href="#"
              className="flex items-center gap-1.5 h-8 px-4 rounded-[8px] text-[12px] font-medium border border-[#2C271F] text-[#A89880] hover:border-[#3A3328] hover:text-[#F2EDE6] transition-[border-color,color,transform] duration-150 active:scale-[0.97] shrink-0"
            >
              View Roadmap <ExternalLink style={{ width: 11, height: 11 }} />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
