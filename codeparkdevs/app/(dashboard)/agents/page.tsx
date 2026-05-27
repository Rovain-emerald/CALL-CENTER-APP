"use client";

import { useState } from "react";
import {
  Plus, Play, Pause, Settings, Trash2, FileText,
  CheckCircle2, XCircle, Bot, TrendingUp, AlertCircle,
  X, Zap, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────── */
interface Agent {
  id: number;
  name: string;
  type: string;
  status: "active" | "paused";
  desc: string;
  runs: number;
  lastRun: string;
  success: number;
}

interface ApprovalItem {
  id: number;
  agent: string;
  type: string;
  preview: string;
  time: string;
}

interface Log {
  agent: string;
  status: string;
  duration: string;
  tokens: number;
  time: string;
}

/* ── Static data ───────────────────────────────────────── */
const AGENTS_INIT: Agent[] = [
  {
    id: 1,
    name: "Customer Service Bot",
    type: "customer_service",
    status: "active",
    desc: "Handles inbound customer enquiries 24/7 via website chat",
    runs: 1234,
    lastRun: "2 min ago",
    success: 98.2,
  },
  {
    id: 2,
    name: "Lead Research Agent",
    type: "lead_gen",
    status: "active",
    desc: "Finds businesses without websites needing automation services",
    runs: 456,
    lastRun: "4h ago",
    success: 94.1,
  },
  {
    id: 3,
    name: "Content Scheduler",
    type: "content",
    status: "paused",
    desc: "Auto-publishes social media content on schedule",
    runs: 89,
    lastRun: "1d ago",
    success: 91.0,
  },
];

const LOGS: Log[] = [
  { agent: "Customer Service Bot", status: "completed", duration: "2.1s",  tokens: 412,  time: "2m ago" },
  { agent: "Lead Research Agent",  status: "completed", duration: "18.4s", tokens: 3201, time: "4h ago" },
  { agent: "Customer Service Bot", status: "failed",    duration: "0.4s",  tokens: 42,   time: "6h ago" },
  { agent: "Lead Research Agent",  status: "completed", duration: "22.1s", tokens: 4100, time: "8h ago" },
];

const APPROVALS_INIT: ApprovalItem[] = [
  {
    id: 1,
    agent: "Lead Research Agent",
    type: "Send Email",
    preview: "To: info@plumbingpros.co.za — Hi, I noticed your business doesn't have a website…",
    time: "5m ago",
  },
  {
    id: 2,
    agent: "Customer Service Bot",
    type: "Issue Refund",
    preview: "Customer #4821 — R450 refund for order #ORD-9921 (item not delivered)",
    time: "12m ago",
  },
];

/* ── Helpers ───────────────────────────────────────────── */
function agentInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ── Component ─────────────────────────────────────────── */
export default function AgentsPage() {
  const [agents,    setAgents]    = useState<Agent[]>(AGENTS_INIT);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(APPROVALS_INIT);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName,    setNewName]    = useState("");
  const [newDesc,    setNewDesc]    = useState("");
  const [newType,    setNewType]    = useState("customer_service");

  // Run panel
  const [runAgent,  setRunAgent]  = useState<Agent | null>(null);
  const [runInput,  setRunInput]  = useState("");
  const [runOutput, setRunOutput] = useState("");
  const [running,   setRunning]   = useState(false);

  function dismiss(id: number) {
    setApprovals((p) => p.filter((a) => a.id !== id));
  }

  function toggleStatus(id: number) {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "paused" : "active" }
          : a
      )
    );
  }

  function deleteAgent(id: number) {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const next: Agent = {
      id: Date.now(),
      name: newName.trim(),
      type: newType,
      status: "active",
      desc: newDesc.trim() || "No description provided",
      runs: 0,
      lastRun: "never",
      success: 100,
    };
    setAgents((p) => [...p, next]);
    setNewName("");
    setNewDesc("");
    setNewType("customer_service");
    setShowCreate(false);
  }

  async function sendRun() {
    if (!runInput.trim() || !runAgent) return;
    setRunning(true);
    setRunOutput("");
    try {
      const res = await fetch(`/api/agents/${runAgent.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: runInput }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = dec.decode(value).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6);
            if (raw === "[DONE]") break;
            try { acc += JSON.parse(raw).text ?? ""; setRunOutput(acc); } catch {}
          }
        }
      }
    } catch {
      setRunOutput("Error: could not reach agent.");
    } finally {
      setRunning(false);
    }
  }

  const activeCount = agents.filter((a) => a.status === "active").length;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#F2EDE6] tracking-wide">Agents</span>
          <span className="artisan-label">[ {activeCount} active ]</span>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 h-8 px-4 rounded-[8px] text-[12px] font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] hover:shadow-[0_0_20px_rgba(200,168,130,0.2)] transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.97]"
        >
          <Plus style={{ width: 13, height: 13 }} /> New Agent
        </button>
      </header>

      {/* ── Scrollable body ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 max-w-[820px] mx-auto w-full animate-fade-up">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Agents",   value: String(agents.length),           mono: "agents.total",   Icon: Bot },
            { label: "Active Now",     value: String(activeCount),             mono: "agents.active",  Icon: Play },
            { label: "Runs Today",     value: "47",                            mono: "runs.today",     Icon: TrendingUp },
            { label: "Needs Approval", value: String(approvals.length),        mono: "inbox.pending",  Icon: AlertCircle },
          ].map(({ label, value, mono, Icon }) => (
            <div
              key={label}
              className="bg-[#0F0D0A] border border-[#2C271F] rounded-[12px] p-4 flex flex-col"
            >
              <p className="font-mono text-[10px] text-[#6B5E50] mb-3 tracking-wide">{mono}</p>
              <p
                className="text-[28px] text-[#F2EDE6] leading-none"
                style={{ fontFamily: "var(--font-dm-serif)", letterSpacing: "-0.02em" }}
              >
                {value}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-[#6B5E50]">{label}</p>
                <Icon style={{ width: 13, height: 13, color: "#4A4135" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Agent cards */}
        <section>
          <h3
            className="text-[16px] text-[#F2EDE6] mb-4"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Your Agents
          </h3>

          {agents.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 gap-5 animate-fade-in">
              <div className="w-16 h-16 rounded-[16px] bg-[#0F0D0A] border border-[#2C271F] flex items-center justify-center">
                <Bot style={{ width: 28, height: 28, color: "#C8A882" }} />
              </div>
              <div className="text-center">
                <p
                  className="text-[20px] text-[#F2EDE6] mb-2"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  No agents yet
                </p>
                <p className="text-[13px] text-[#6B5E50] max-w-[260px] mx-auto leading-relaxed">
                  Create your first AI agent to automate tasks and workflows.
                </p>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 h-9 px-5 rounded-[9px] text-[13px] font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] hover:shadow-[0_0_20px_rgba(200,168,130,0.2)] transition-[background-color,box-shadow] duration-150"
              >
                <Plus style={{ width: 13, height: 13 }} /> Create Agent
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    "bg-[#0F0D0A] border border-[#2C271F] rounded-[14px] p-5",
                    "hover:border-[#3A3328] transition-[border-color,box-shadow] duration-150",
                    "hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
                    "flex items-start gap-4",
                    "border-l-2",
                    agent.status === "active" ? "border-l-[#8A9E8C]" : "border-l-[#2C271F]"
                  )}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-[10px] bg-[#1A1712] border border-[#2C271F] flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-semibold text-[#C8A882]">
                      {agentInitials(agent.name)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Status dot */}
                      <span className="relative flex items-center">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            agent.status === "active" ? "bg-[#8A9E8C]" : "bg-[#4A4135]"
                          )}
                        />
                        {agent.status === "active" && (
                          <span className="absolute inset-0 rounded-full bg-[#8A9E8C] animate-ping opacity-40" />
                        )}
                      </span>
                      <p className="text-[13px] font-medium text-[#F2EDE6] truncate">
                        {agent.name}
                      </p>
                    </div>
                    <p className="text-[12px] text-[#6B5E50] leading-snug mb-2">{agent.desc}</p>
                    {/* Meta row */}
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-[#A89880]">
                        {agent.runs.toLocaleString()} runs
                      </span>
                      <span className="font-mono text-[10px] text-[#6B5E50]">
                        last: {agent.lastRun}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[10px]",
                          agent.success >= 95 ? "text-[#8A9E8C]" : "text-[#C8A882]"
                        )}
                      >
                        {agent.success}% success
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-all duration-150 active:scale-[0.95]"
                      title="Settings"
                    >
                      <Settings style={{ width: 13, height: 13 }} />
                    </button>
                    <button
                      onClick={() => { setRunAgent(agent); setRunOutput(""); setRunInput(""); }}
                      className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#6B5E50] hover:text-[#8A9E8C] hover:bg-[#1A1712] transition-all duration-150 active:scale-[0.95]"
                      title="Run"
                    >
                      <FileText style={{ width: 13, height: 13 }} />
                    </button>
                    <button
                      onClick={() => toggleStatus(agent.id)}
                      className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-all duration-150 active:scale-[0.95]"
                      title={agent.status === "active" ? "Pause" : "Resume"}
                    >
                      {agent.status === "active" ? (
                        <Pause style={{ width: 13, height: 13 }} />
                      ) : (
                        <Play style={{ width: 13, height: 13 }} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#6B5E50] hover:text-[#B5704F] hover:bg-[#B5704F]/10 transition-all duration-150 active:scale-[0.95]"
                      title="Delete"
                    >
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approval inbox */}
        {approvals.length > 0 && (
          <section>
            <h3
              className="text-[16px] text-[#F2EDE6] mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Approval Inbox
              <span className="font-mono text-[10px] bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/25 px-2 py-0.5 rounded-full">
                {approvals.length}
              </span>
            </h3>
            <div className="space-y-2">
              {approvals.map((a) => (
                <div
                  key={a.id}
                  className="bg-[#0F0D0A] border border-[#C8A882]/15 rounded-[12px] p-4 hover:border-[#C8A882]/25 transition-[border-color] duration-150"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-[10px] text-[#C8A882]">[ {a.type} ]</span>
                        <span className="font-mono text-[10px] text-[#6B5E50]">
                          {a.agent} · {a.time}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#A89880] truncate">{a.preview}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => dismiss(a.id)}
                        className="flex items-center gap-1 h-7 px-3 rounded-[6px] text-[11px] font-medium bg-[#8A9E8C]/10 text-[#8A9E8C] hover:bg-[#8A9E8C]/20 transition-[background-color] duration-150 active:scale-[0.97]"
                      >
                        <CheckCircle2 style={{ width: 11, height: 11 }} /> Approve
                      </button>
                      <button
                        onClick={() => dismiss(a.id)}
                        className="flex items-center gap-1 h-7 px-3 rounded-[6px] text-[11px] font-medium bg-[#B5704F]/10 text-[#B5704F] hover:bg-[#B5704F]/20 transition-[background-color] duration-150 active:scale-[0.97]"
                      >
                        <XCircle style={{ width: 11, height: 11 }} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Logs */}
        <section className="pb-4">
          <h3
            className="text-[16px] text-[#F2EDE6] mb-4"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Recent Logs
          </h3>
          <div className="bg-[#0F0D0A] border border-[#2C271F] rounded-[12px] overflow-hidden">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#2C271F]">
                  {["Agent", "Status", "Duration", "Tokens", "Time"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 font-mono text-[10px] text-[#6B5E50] tracking-widest uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LOGS.map((log, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#1A1712] last:border-0 hover:bg-[#1A1712] transition-colors duration-75"
                  >
                    <td className="px-4 py-2.5 text-[#A89880]">{log.agent}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "font-mono text-[10px] flex items-center gap-1",
                          log.status === "completed" ? "text-[#8A9E8C]" : "text-[#B5704F]"
                        )}
                      >
                        {log.status === "completed" ? (
                          <CheckCircle2 style={{ width: 10, height: 10 }} />
                        ) : (
                          <XCircle style={{ width: 10, height: 10 }} />
                        )}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[#6B5E50]">{log.duration}</td>
                    <td className="px-4 py-2.5 font-mono text-[#6B5E50]">
                      {log.tokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[#4A4135]">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Create Agent Modal ──────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 bg-[#111009]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0F0D0A] border border-[#2C271F] rounded-[20px] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.6)] w-full max-w-[440px] animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-[20px] text-[#F2EDE6]"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                New Agent
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-all duration-150"
              >
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] text-[#6B5E50] mb-2 tracking-widest uppercase">
                  Agent Name
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Customer Support Bot"
                  required
                  className="w-full bg-[#1A1712] border border-[#2C271F] rounded-[10px] px-3 h-10 text-[13px] text-[#F2EDE6] placeholder:text-[#4A4135] focus:outline-none focus:border-[#C8A882]/40 focus:shadow-[0_0_0_3px_rgba(200,168,130,0.06)] transition-[border-color,box-shadow] duration-150"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#6B5E50] mb-2 tracking-widest uppercase">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What does this agent do?"
                  rows={3}
                  className="w-full bg-[#1A1712] border border-[#2C271F] rounded-[10px] px-3 py-2.5 text-[13px] text-[#F2EDE6] placeholder:text-[#4A4135] focus:outline-none focus:border-[#C8A882]/40 focus:shadow-[0_0_0_3px_rgba(200,168,130,0.06)] transition-[border-color,box-shadow] duration-150 resize-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#6B5E50] mb-2 tracking-widest uppercase">
                  Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-[#1A1712] border border-[#2C271F] rounded-[10px] px-3 h-10 text-[13px] text-[#F2EDE6] focus:outline-none focus:border-[#C8A882]/40 transition-[border-color] duration-150 appearance-none"
                >
                  <option value="customer_service">Customer Service</option>
                  <option value="lead_gen">Lead Generation</option>
                  <option value="content">Content</option>
                  <option value="research">Research</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 h-10 rounded-[10px] text-[13px] font-medium text-[#6B5E50] border border-[#2C271F] hover:border-[#3A3328] hover:text-[#A89880] transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-[10px] text-[13px] font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] hover:shadow-[0_0_20px_rgba(200,168,130,0.2)] transition-[background-color,box-shadow] duration-150 active:scale-[0.97]"
                >
                  Create Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Run Panel ───────────────────────────────────────── */}
      {runAgent && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-[#111009]/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setRunAgent(null)}
          />
          {/* Slide-in panel */}
          <div className="fixed right-0 top-0 h-full w-[400px] bg-[#0F0D0A] border-l border-[#2C271F] z-50 flex flex-col animate-slide-right">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2C271F] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#1A1712] border border-[#2C271F] flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-[#C8A882]">
                    {agentInitials(runAgent.name)}
                  </span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#F2EDE6]">{runAgent.name}</p>
                  <p className="font-mono text-[10px] text-[#6B5E50]">run mode</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Credits badge */}
                <span className="flex items-center gap-1 font-mono text-[10px] text-[#A89880] bg-[#1A1712] border border-[#2C271F] px-2 py-1 rounded-[6px]">
                  <Zap style={{ width: 10, height: 10, color: "#C8A882" }} /> 10 credits
                </span>
                <button
                  onClick={() => setRunAgent(null)}
                  className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-all duration-150"
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>

            {/* Output area */}
            <div className="flex-1 overflow-y-auto p-5">
              {runOutput ? (
                <div className="bg-[#1A1712] border border-[#2C271F] rounded-[10px] p-4 font-mono text-[12px] text-[#F2EDE6] leading-relaxed whitespace-pre-wrap">
                  {runOutput}
                  {running && (
                    <span className="inline-block w-[6px] h-[13px] bg-[#C8A882] ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div className="w-10 h-10 rounded-[10px] bg-[#1A1712] border border-[#2C271F] flex items-center justify-center">
                    <Bot style={{ width: 18, height: 18, color: "#6B5E50" }} />
                  </div>
                  <p className="text-[12px] text-[#6B5E50] max-w-[220px] leading-relaxed">
                    Send a message to run this agent and see the output here.
                  </p>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="shrink-0 p-4 border-t border-[#2C271F]">
              <div className="flex gap-2">
                <input
                  value={runInput}
                  onChange={(e) => setRunInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendRun()}
                  placeholder="Send a message…"
                  className="flex-1 bg-[#1A1712] border border-[#2C271F] rounded-[10px] px-3 h-10 text-[13px] text-[#F2EDE6] placeholder:text-[#4A4135] focus:outline-none focus:border-[#C8A882]/40 transition-[border-color] duration-150"
                />
                <button
                  onClick={sendRun}
                  disabled={!runInput.trim() || running}
                  className={cn(
                    "w-10 h-10 rounded-[10px] flex items-center justify-center",
                    "bg-[#C8A882] text-[#111009]",
                    "hover:bg-[#BFA070] transition-[background-color,opacity] duration-150",
                    (!runInput.trim() || running) && "opacity-40 pointer-events-none"
                  )}
                >
                  <Send style={{ width: 14, height: 14 }} />
                </button>
              </div>
              <p className="font-mono text-[10px] text-[#4A4135] mt-2 text-center">
                Enter to send · Esc to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
