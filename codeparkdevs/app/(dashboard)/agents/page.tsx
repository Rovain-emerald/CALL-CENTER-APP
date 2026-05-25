"use client";

import { useState } from "react";
import { Plus, Play, Pause, Settings, Trash2, FileText, CheckCircle2, XCircle, Bot, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const AGENTS = [
  { id: 1, name: "Customer Service Bot", type: "customer_service", status: "active" as const, desc: "Handles inbound customer enquiries 24/7 via website chat", runs: 1234, lastRun: "2 min ago", success: 98.2 },
  { id: 2, name: "Lead Research Agent",  type: "lead_gen",          status: "active" as const, desc: "Finds businesses without websites needing automation services", runs: 456, lastRun: "4h ago", success: 94.1 },
  { id: 3, name: "Content Scheduler",   type: "content",           status: "paused" as const, desc: "Auto-publishes social media content on schedule", runs: 89, lastRun: "1d ago", success: 91.0 },
];

const LOGS = [
  { agent: "Customer Service Bot", status: "completed", duration: "2.1s", tokens: 412,  time: "2m ago" },
  { agent: "Lead Research Agent",  status: "completed", duration: "18.4s",tokens: 3201, time: "4h ago" },
  { agent: "Customer Service Bot", status: "failed",    duration: "0.4s", tokens: 42,   time: "6h ago" },
  { agent: "Lead Research Agent",  status: "completed", duration: "22.1s",tokens: 4100, time: "8h ago" },
];

const APPROVALS_INIT = [
  { id: 1, agent: "Lead Research Agent",  type: "Send Email",   preview: "To: info@plumbingpros.co.za — Hi, I noticed your business doesn't have a website…", time: "5m ago" },
  { id: 2, agent: "Customer Service Bot", type: "Issue Refund", preview: "Customer #4821 — R450 refund for order #ORD-9921 (item not delivered)", time: "12m ago" },
];

export default function AgentsPage() {
  const [approvals, setApprovals] = useState(APPROVALS_INIT);
  const dismiss = (id: number) => setApprovals((p) => p.filter((a) => a.id !== id));

  return (
    <div className="flex flex-col h-full">
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#F2EDE6] tracking-wide">Agents</span>
          <span className="artisan-label">[ {AGENTS.filter(a=>a.status==="active").length} active ]</span>
        </div>
        <button className="flex items-center gap-2 h-8 px-4 rounded-[8px] text-[12px] font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] transition-[background-color,transform] duration-150 active:scale-[0.97]">
          <Plus style={{ width: 13, height: 13 }} /> New Agent
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 max-w-[820px] mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Agents",     value: "3",  mono: "agents.total",   icon: Bot },
            { label: "Active Now",       value: "2",  mono: "agents.active",  icon: Play },
            { label: "Runs Today",       value: "47", mono: "runs.today",     icon: TrendingUp },
            { label: "Needs Approval",   value: String(approvals.length), mono: "inbox.pending", icon: AlertCircle },
          ].map(({ label, value, mono, icon: Icon }) => (
            <div key={label} className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-4">
              <p className="font-mono text-[10px] text-[#6B5E50] mb-3 tracking-wide">{mono}</p>
              <p className="text-[26px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)", letterSpacing: "-0.02em" }}>{value}</p>
              <p className="text-[11px] text-[#6B5E50] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Agent cards */}
        <section>
          <h3 className="text-[16px] text-[#F2EDE6] mb-3" style={{ fontFamily: "var(--font-dm-serif)" }}>Your Agents</h3>
          <div className="space-y-2">
            {AGENTS.map((agent) => (
              <div key={agent.id} className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-4 hover:border-[#3A3328] transition-[border-color] duration-150">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="relative mt-1">
                      <div className={cn("w-2 h-2 rounded-full", agent.status === "active" ? "bg-[#8A9E8C]" : "bg-[#C8A882]/40")} />
                      {agent.status === "active" && <div className="absolute inset-0 rounded-full bg-[#8A9E8C] animate-ping opacity-30" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#F2EDE6]">{agent.name}</p>
                      <p className="text-[12px] text-[#6B5E50] mt-0.5">{agent.desc}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-mono text-[10px] text-[#A89880]">runs: {agent.runs.toLocaleString()}</span>
                        <span className="font-mono text-[10px] text-[#6B5E50]">last: {agent.lastRun}</span>
                        <span className={cn("font-mono text-[10px]", agent.success >= 95 ? "text-[#8A9E8C]" : "text-[#C8A882]")}>{agent.success}% success</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {[Settings, FileText].map((Icon, i) => (
                      <button key={i} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#221E18] transition-[background-color,color] duration-150 active:scale-[0.97]">
                        <Icon style={{ width: 13, height: 13 }} />
                      </button>
                    ))}
                    <button className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#221E18] transition-[background-color,color] duration-150 active:scale-[0.97]">
                      {agent.status === "active" ? <Pause style={{ width: 13, height: 13 }} /> : <Play style={{ width: 13, height: 13 }} />}
                    </button>
                    <button className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#6B5E50] hover:text-[#B5704F] hover:bg-[#B5704F]/10 transition-[background-color,color] duration-150 active:scale-[0.97]">
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Approval inbox */}
        {approvals.length > 0 && (
          <section>
            <h3 className="text-[16px] text-[#F2EDE6] mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
              Approval Inbox
              <span className="font-mono text-[10px] bg-[#C8A882]/12 text-[#C8A882] border border-[#C8A882]/25 px-2 py-0.5 rounded-full">{approvals.length}</span>
            </h3>
            <div className="space-y-2">
              {approvals.map((a) => (
                <div key={a.id} className="bg-[#1A1712] border border-[#C8A882]/18 rounded-[12px] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-[#C8A882]">[ {a.type} ]</span>
                        <span className="font-mono text-[10px] text-[#6B5E50]">{a.agent} · {a.time}</span>
                      </div>
                      <p className="text-[12px] text-[#A89880] truncate">{a.preview}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => dismiss(a.id)} className="flex items-center gap-1 h-7 px-3 rounded-[6px] text-[11px] font-medium bg-[#8A9E8C]/12 text-[#8A9E8C] hover:bg-[#8A9E8C]/22 transition-[background-color] duration-150 active:scale-[0.97]">
                        <CheckCircle2 style={{ width: 11, height: 11 }} /> Approve
                      </button>
                      <button onClick={() => dismiss(a.id)} className="flex items-center gap-1 h-7 px-3 rounded-[6px] text-[11px] font-medium bg-[#B5704F]/12 text-[#B5704F] hover:bg-[#B5704F]/22 transition-[background-color] duration-150 active:scale-[0.97]">
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
        <section>
          <h3 className="text-[16px] text-[#F2EDE6] mb-3" style={{ fontFamily: "var(--font-dm-serif)" }}>Recent Logs</h3>
          <div className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] overflow-hidden">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-[#2C271F]">{["Agent","Status","Duration","Tokens","Time"].map(h=><th key={h} className="text-left px-4 py-2.5 font-mono text-[10px] text-[#6B5E50] tracking-wide uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {LOGS.map((log, i) => (
                  <tr key={i} className="border-b border-[#1A1712] last:border-0 hover:bg-[#1E1B15] transition-colors duration-75">
                    <td className="px-4 py-2.5 text-[#A89880]">{log.agent}</td>
                    <td className="px-4 py-2.5"><span className={cn("font-mono text-[10px] flex items-center gap-1", log.status==="completed"?"text-[#8A9E8C]":"text-[#B5704F]")}>{log.status==="completed"?<CheckCircle2 style={{width:10,height:10}}/>:<XCircle style={{width:10,height:10}}/>}{log.status}</span></td>
                    <td className="px-4 py-2.5 font-mono text-[#6B5E50]">{log.duration}</td>
                    <td className="px-4 py-2.5 font-mono text-[#6B5E50]">{log.tokens.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-[#4A4135]">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
