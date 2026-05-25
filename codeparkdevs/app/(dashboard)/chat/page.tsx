'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Plus,
  Search,
  Send,
  Mic,
  Paperclip,
  ChevronRight,
  PanelRight,
  MessageSquare,
  Zap,
  Globe,
  Sparkles,
  BookOpen,
  Code2,
  Bot,
  User,
  X,
} from 'lucide-react'

const MODES = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'think', label: 'Think', icon: Zap },
  { id: 'search', label: 'Search', icon: Globe },
  { id: 'create', label: 'Create', icon: Sparkles },
  { id: 'research', label: 'Research', icon: BookOpen },
  { id: 'code', label: 'Code', icon: Code2 },
]

const CHAT_HISTORY = {
  Today: [
    { id: '1', title: 'Build a SaaS landing page', time: '2:41 PM' },
    { id: '2', title: 'Python data analysis script', time: '11:03 AM' },
    { id: '3', title: 'Marketing campaign ideas', time: '9:17 AM' },
  ],
  Yesterday: [
    { id: '4', title: 'Explain React Server Components', time: '6:55 PM' },
    { id: '5', title: 'Write a cover letter for tech job', time: '3:20 PM' },
    { id: '6', title: 'SQL query optimization tips', time: '10:42 AM' },
  ],
  'This Week': [
    { id: '7', title: 'Next.js 16 migration guide', time: 'Mon' },
    { id: '8', title: 'Design system color tokens', time: 'Mon' },
    { id: '9', title: 'Stripe webhook integration', time: 'Sun' },
    { id: '10', title: 'Docker Compose setup for dev', time: 'Sat' },
  ],
}

const MOCK_MESSAGES = [
  {
    id: '1',
    role: 'user',
    content: 'Can you help me build a real-time analytics dashboard using Next.js and Recharts? I need it to show live user counts, conversion rates, and revenue metrics.',
    time: '2:38 PM',
  },
  {
    id: '2',
    role: 'assistant',
    content: `Absolutely! Here's a solid approach for a real-time analytics dashboard with Next.js and Recharts.

**Architecture Overview**

We'll use:
- **Next.js App Router** for the layout and server components
- **Recharts** for interactive charts
- **Server-Sent Events (SSE)** or **WebSockets** for live data streaming
- **Zustand** or React state for local data management

**Core Components**

1. \`MetricCard\` — displays a single KPI with trend indicator
2. \`LiveLineChart\` — real-time time-series chart
3. \`ConversionFunnel\` — step-by-step funnel visualization
4. \`RevenueBarChart\` — daily/weekly revenue breakdown

**Quick Start**

\`\`\`typescript
// app/dashboard/analytics/page.tsx
import { MetricCard } from '@/components/MetricCard'
import { LiveChart } from '@/components/LiveChart'

export default function AnalyticsPage() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard title="Active Users" value={1_247} trend={+12.3} />
      <MetricCard title="Conversion" value="3.8%" trend={+0.4} />
      <MetricCard title="Revenue" value="$48,320" trend={+8.1} />
      <MetricCard title="Avg Session" value="4m 12s" trend={-0.3} />
      <div className="col-span-4">
        <LiveChart endpoint="/api/metrics/stream" />
      </div>
    </div>
  )
}
\`\`\`

Want me to generate the full component files, the SSE API route, and the chart configurations?`,
    time: '2:39 PM',
  },
  {
    id: '3',
    role: 'user',
    content: 'Yes please! Generate the full SSE API route and the LiveChart component with Recharts.',
    time: '2:41 PM',
  },
]

function StreamingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#00FF87] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </div>
  )
}

export default function ChatPage() {
  const [activeMode, setActiveMode] = useState('chat')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [isStreaming, setIsStreaming] = useState(false)
  const [activeChatId, setActiveChatId] = useState('1')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCanvas, setShowCanvas] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  function handleSend() {
    if (!input.trim()) return
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)
    setTimeout(() => {
      setIsStreaming(false)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Here\'s what I\'ve prepared for you! I\'ll generate the full SSE route and LiveChart component with Recharts, including real-time data updates via `EventSource`.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 2200)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    }
  }

  const filteredHistory = Object.entries(CHAT_HISTORY).reduce(
    (acc, [group, items]) => {
      const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (filtered.length) acc[group] = filtered
      return acc
    },
    {} as Record<string, typeof CHAT_HISTORY['Today']>
  )

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Left Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } hidden md:flex flex-col flex-shrink-0 border-r border-[#2A2A2A] bg-[#111111] transition-all duration-200 overflow-hidden`}
      >
        {/* New Chat */}
        <div className="p-3 border-b border-[#2A2A2A]">
          <button
            onClick={() => {
              setMessages([])
              setActiveChatId('')
            }}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-[#00FF87]/10 border border-[#00FF87]/30 text-[#00FF87] text-sm font-medium hover:bg-[#00FF87]/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
            <Search className="w-3.5 h-3.5 text-[#AAAAAA]" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-[#AAAAAA] outline-none"
            />
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          {Object.entries(filteredHistory).map(([group, items]) => (
            <div key={group} className="mb-2">
              <p className="px-4 py-1.5 text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">
                {group}
              </p>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveChatId(item.id)}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between group hover:bg-[#1A1A1A] transition-colors ${
                    activeChatId === item.id ? 'bg-[#1A1A1A]' : ''
                  }`}
                >
                  <span
                    className={`text-sm truncate flex-1 pr-2 ${
                      activeChatId === item.id ? 'text-white' : 'text-[#AAAAAA]'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-xs text-[#555555] flex-shrink-0">{item.time}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A] bg-[#111111] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md hover:bg-[#2A2A2A] text-[#AAAAAA] transition-colors"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00FF87] to-[#7C3AED] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="font-semibold text-sm text-white">CodePark AI</span>
              <span className="px-2 py-0.5 text-xs bg-[#7C3AED]/20 text-[#7C3AED] rounded-full border border-[#7C3AED]/30">
                Pro
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowCanvas(!showCanvas)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border ${
              showCanvas
                ? 'bg-[#00FF87]/10 border-[#00FF87]/30 text-[#00FF87]'
                : 'border-[#2A2A2A] text-[#AAAAAA] hover:bg-[#1A1A1A]'
            }`}
          >
            <PanelRight className="w-4 h-4" />
            Canvas
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#7C3AED] to-[#EC4899]'
                    : 'bg-gradient-to-br from-[#00FF87] to-[#7C3AED]'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-black" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#00FF87]/10 border border-[#00FF87]/20 text-white rounded-tr-sm'
                    : 'bg-[#111111] border border-[#2A2A2A] text-[#DDDDDD] rounded-tl-sm'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                <p className="text-xs text-[#555555] mt-2">{msg.time}</p>
              </div>
            </div>
          ))}

          {/* Streaming indicator */}
          {isStreaming && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#00FF87] to-[#7C3AED] flex items-center justify-center">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl rounded-tl-sm px-4 py-3">
                <StreamingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mode Chips */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-1 border-t border-[#2A2A2A] bg-[#0A0A0A] overflow-x-auto scrollbar-hide flex-shrink-0">
          {MODES.map((mode) => {
            const Icon = mode.icon
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  activeMode === mode.id
                    ? 'bg-[#00FF87] text-black border-[#00FF87]'
                    : 'bg-[#111111] text-[#AAAAAA] border-[#2A2A2A] hover:border-[#00FF87]/40 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                {mode.label}
              </button>
            )
          })}
        </div>

        {/* Input Bar */}
        <div className="px-4 py-3 bg-[#0A0A0A] flex-shrink-0">
          <div className="flex items-end gap-3 bg-[#111111] border border-[#2A2A2A] rounded-2xl px-4 py-3 focus-within:border-[#00FF87]/40 transition-colors">
            <button className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[#2A2A2A] text-[#AAAAAA] hover:text-white transition-colors mb-0.5">
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Message CodePark AI..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder-[#555555] outline-none resize-none leading-relaxed min-h-[24px] max-h-[120px]"
            />
            <div className="flex items-center gap-2 flex-shrink-0 mb-0.5">
              <button className="p-1.5 rounded-lg hover:bg-[#2A2A2A] text-[#AAAAAA] hover:text-white transition-colors">
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className={`p-1.5 rounded-lg transition-all ${
                  input.trim() && !isStreaming
                    ? 'bg-[#00FF87] text-black shadow-[0_0_12px_rgba(0,255,135,0.5)] hover:shadow-[0_0_20px_rgba(0,255,135,0.7)]'
                    : 'bg-[#2A2A2A] text-[#555555]'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-[#444444] mt-2">
            CodePark AI can make mistakes. Check important info.
          </p>
        </div>
      </div>

      {/* Canvas Panel */}
      {showCanvas && (
        <aside className="w-96 flex-shrink-0 border-l border-[#2A2A2A] bg-[#111111] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A]">
            <span className="font-semibold text-sm">Canvas</span>
            <button
              onClick={() => setShowCanvas(false)}
              className="p-1.5 rounded-md hover:bg-[#2A2A2A] text-[#AAAAAA]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center text-[#444444] text-sm">
            <div className="text-center space-y-2">
              <Code2 className="w-8 h-8 mx-auto text-[#2A2A2A]" />
              <p>Canvas will appear here</p>
              <p className="text-xs text-[#333333]">Ask AI to generate code, diagrams, or designs</p>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
