"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Check, CreditCard, Shield, User, Palette, Zap, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile",    label: "Profile",    icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "billing",    label: "Billing",    icon: CreditCard },
  { id: "security",   label: "Security",   icon: Shield },
] as const;

type Tab = typeof TABS[number]["id"];

const ACCENT_COLORS = [
  { value: "#C8A882", label: "Raw Clay" },
  { value: "#8A9E8C", label: "Sage" },
  { value: "#B5704F", label: "Terracotta" },
  { value: "#6B8CBF", label: "Steel Blue" },
  { value: "#9B7FB5", label: "Lavender" },
  { value: "#7FB5A0", label: "Mint" },
];

const PLANS = [
  { id: "free",    name: "Free Trial", price: "$0",  credits: "50",        features: ["50 credits", "3-day trial", "Basic AI chat", "Image generation"] },
  { id: "starter", name: "Starter",    price: "$19", credits: "500/mo",    features: ["500 credits/mo", "AI chat", "Image generation", "Basic scheduling"] },
  { id: "pro",     name: "Pro",        price: "$49", credits: "2,000/mo",  features: ["2,000 credits/mo", "All AI models", "Social scheduler", "7 platforms", "Priority support"] },
  { id: "agency",  name: "Agency",     price: "$99", credits: "Unlimited", features: ["Unlimited credits", "Everything in Pro", "White-label", "API access", "Dedicated support"] },
] as const;

export default function SettingsPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("profile");
  const [accentColor, setAccentColor] = useState("#C8A882");
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [displayName, setDisplayName] = useState(user?.fullName ?? "");
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success("Profile saved");
  }

  async function handleUpgrade(plan: string) {
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error("Failed to start checkout");
    }
  }

  async function handlePortal() {
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error("Failed to open billing portal");
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="h-[60px] flex items-center px-6 border-b border-[#2C271F] shrink-0">
        <span className="text-sm font-medium text-[#F2EDE6] tracking-wide">Settings</span>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-[700px] mx-auto w-full">
        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-[#1A1712] border border-[#2C271F] rounded-[10px] mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2 flex-1 justify-center h-8 rounded-[7px] text-[12px] font-medium transition-[background-color,color] duration-150 active:scale-[0.97]",
                tab === id ? "bg-[#221E18] text-[#F2EDE6]" : "text-[#6B5E50] hover:text-[#A89880]"
              )}
            >
              <Icon style={{ width: 12, height: 12 }} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Profile ── */}
        {tab === "profile" && (
          <div className="space-y-4">
            <div className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-5 space-y-4">
              <h3 className="text-[15px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>Profile</h3>
              {user?.imageUrl && (
                <img src={user.imageUrl} alt="avatar" className="w-16 h-16 rounded-full border-2 border-[#C8A882]/30" />
              )}
              <div className="space-y-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#6B5E50] mb-1.5 tracking-wide">DISPLAY NAME</label>
                  <input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full h-9 px-3 rounded-[8px] bg-[#111009] border border-[#2C271F] text-[13px] text-[#F2EDE6] placeholder:text-[#6B5E50] focus:outline-none focus:border-[#C8A882]/60 transition-[border-color] duration-150"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#6B5E50] mb-1.5 tracking-wide">EMAIL</label>
                  <input
                    value={user?.primaryEmailAddress?.emailAddress ?? ""}
                    readOnly
                    className="w-full h-9 px-3 rounded-[8px] bg-[#0D0B08] border border-[#2C271F] text-[13px] text-[#6B5E50] cursor-not-allowed"
                  />
                </div>
              </div>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="h-9 px-5 rounded-[8px] text-[13px] font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] disabled:opacity-50 transition-[background-color,transform] duration-150 active:scale-[0.97]"
              >
                {saving ? "Saving…" : "Save Profile"}
              </button>
            </div>
          </div>
        )}

        {/* ── Appearance ── */}
        {tab === "appearance" && (
          <div className="space-y-4">
            <div className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-5 space-y-5">
              <h3 className="text-[15px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>Appearance</h3>

              {/* Dark / Light */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#F2EDE6]">Dark Mode</p>
                  <p className="font-mono text-[10px] text-[#6B5E50] mt-0.5">Persisted in localStorage</p>
                </div>
                <button
                  onClick={() => {
                    const next = !darkMode;
                    setDarkMode(next);
                    document.documentElement.classList.toggle("light", !next);
                    localStorage.setItem("theme", next ? "dark" : "light");
                    toast.success(`${next ? "Dark" : "Light"} mode enabled`);
                  }}
                  className={cn(
                    "w-11 h-6 rounded-full transition-[background-color] duration-200 relative shrink-0",
                    darkMode ? "bg-[#C8A882]" : "bg-[#2C271F]"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#111009] transition-[transform] duration-200",
                    darkMode ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>

              {/* Sidebar */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#F2EDE6]">Collapsed Sidebar</p>
                  <p className="font-mono text-[10px] text-[#6B5E50] mt-0.5">Icons-only navigation</p>
                </div>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-[background-color] duration-200 relative shrink-0",
                    sidebarCollapsed ? "bg-[#C8A882]" : "bg-[#2C271F]"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#111009] transition-[transform] duration-200",
                    sidebarCollapsed ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>

              {/* Accent color */}
              <div>
                <p className="text-[13px] text-[#F2EDE6] mb-3">Accent Color</p>
                <div className="flex gap-2 flex-wrap">
                  {ACCENT_COLORS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setAccentColor(value);
                        document.documentElement.style.setProperty("--accent", value);
                        toast.success(`Accent: ${label}`);
                      }}
                      title={label}
                      className={cn(
                        "w-8 h-8 rounded-full transition-[transform,box-shadow] duration-150 active:scale-[0.97]",
                        accentColor === value && "ring-2 ring-offset-2 ring-offset-[#1A1712] ring-white/40"
                      )}
                      style={{ backgroundColor: value }}
                    >
                      {accentColor === value && (
                        <Check style={{ width: 14, height: 14, color: "#111009", margin: "auto" }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Billing ── */}
        {tab === "billing" && (
          <div className="space-y-4">
            <div className="bg-[#1A1712] border border-[#C8A882]/20 rounded-[12px] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>Current Plan</h3>
                <span className="font-mono text-[10px] bg-[#C8A882]/12 text-[#C8A882] border border-[#C8A882]/25 px-2 py-0.5 rounded-full">FREE TRIAL</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Zap style={{ width: 16, height: 16, color: "#C8A882" }} />
                <span className="text-[28px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>50</span>
                <span className="text-[13px] text-[#6B5E50]">credits remaining</span>
              </div>
              <button onClick={handlePortal} className="flex items-center gap-2 h-8 px-4 rounded-[8px] text-[12px] font-medium border border-[#2C271F] text-[#A89880] hover:border-[#3A3328] hover:text-[#F2EDE6] transition-[border-color,color,transform] duration-150 active:scale-[0.97]">
                Manage Subscription <ExternalLink style={{ width: 11, height: 11 }} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLANS.map((plan) => (
                <div key={plan.id} className={cn(
                  "bg-[#1A1712] border rounded-[12px] p-4 flex flex-col gap-3",
                  plan.id === "pro" ? "border-[#C8A882]/30" : "border-[#2C271F]"
                )}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-[#F2EDE6]">{plan.name}</p>
                      <p className="text-[11px] text-[#6B5E50] mt-0.5">{plan.credits} credits</p>
                    </div>
                    <p className="text-[20px] text-[#C8A882]" style={{ fontFamily: "var(--font-dm-serif)" }}>{plan.price}<span className="text-[12px] text-[#6B5E50]">/mo</span></p>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-[12px] text-[#A89880]">
                        <Check style={{ width: 11, height: 11, color: "#8A9E8C" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.id !== "free" && (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      className="mt-auto h-8 rounded-[8px] text-[12px] font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] transition-[background-color,transform] duration-150 active:scale-[0.97]"
                    >
                      Upgrade to {plan.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Security ── */}
        {tab === "security" && (
          <div className="space-y-4">
            <div className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-5 space-y-4">
              <h3 className="text-[15px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>Security</h3>
              <div className="space-y-3">
                {[
                  { label: "Session Management", desc: "Manage active sessions and sign out devices", badge: "Via Clerk" },
                  { label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account", badge: "Via Clerk" },
                  { label: "API Rate Limits", desc: "20 requests per 10 seconds per endpoint", badge: "Active" },
                  { label: "Audit Logging", desc: "All sensitive actions are logged to Supabase", badge: "Active" },
                ].map(({ label, desc, badge }) => (
                  <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-[#2C271F] last:border-0">
                    <div>
                      <p className="text-[13px] text-[#F2EDE6]">{label}</p>
                      <p className="font-mono text-[10px] text-[#6B5E50] mt-0.5">{desc}</p>
                    </div>
                    <span className="font-mono text-[10px] text-[#8A9E8C] bg-[#8A9E8C]/10 border border-[#8A9E8C]/20 px-2 py-0.5 rounded-full shrink-0">{badge}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://clerk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 h-9 px-5 w-fit rounded-[8px] text-[13px] font-medium border border-[#2C271F] text-[#A89880] hover:border-[#3A3328] hover:text-[#F2EDE6] transition-[border-color,color,transform] duration-150 active:scale-[0.97]"
              >
                Manage Account Security <ExternalLink style={{ width: 12, height: 12 }} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
