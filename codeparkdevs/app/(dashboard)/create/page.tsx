'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Upload,
  Play,
  Zap,
  Image as ImageIcon,
  Music,
  Mic,
  Box,
  Video,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react'

const MAIN_TABS = [
  { id: 'video', label: 'VIDEO', icon: Video },
  { id: 'image', label: 'IMAGE', icon: ImageIcon },
  { id: 'music', label: 'MUSIC', icon: Music },
  { id: 'voice', label: 'VOICE', icon: Mic },
  { id: '3d', label: '3D', icon: Box },
]

const VIDEO_MODELS = [
  { id: 'luma', name: 'Luma Dream Machine', tag: 'Popular', color: '#7C3AED' },
  { id: 'seedance', name: 'Seedance 2.0', tag: 'New', color: '#00FF87' },
  { id: 'kling', name: 'Kling 3.0', tag: 'Fast', color: '#EC4899' },
  { id: 'veo', name: 'Google Veo 3.1', tag: 'HD', color: '#00FF87' },
  { id: 'sora', name: 'Sora 2', tag: 'Premium', color: '#7C3AED' },
  { id: 'wan', name: 'WAN 2.6', tag: 'Open', color: '#AAAAAA' },
  { id: 'minimax', name: 'MiniMax Hailuo 02', tag: 'Budget', color: '#EC4899' },
]

const IMAGE_MODELS = [
  { id: 'flux-pro', name: 'FLUX Pro 1.1', tag: 'Best' },
  { id: 'ideogram', name: 'Ideogram 3.0', tag: 'Text' },
  { id: 'midjourney', name: 'Midjourney 7', tag: 'Art' },
  { id: 'stable-ultra', name: 'SDXL Ultra', tag: 'Fast' },
  { id: 'dalle3', name: 'DALL·E 3', tag: 'OpenAI' },
  { id: 'recraft', name: 'Recraft V3', tag: 'Design' },
  { id: 'playground', name: 'Playground v3', tag: 'Free' },
  { id: 'leonardo', name: 'Leonardo Phoenix', tag: 'Photo' },
]

const MOCK_VIDEO_RESULTS = [
  { id: '1', gradient: 'from-[#7C3AED] to-[#EC4899]', title: 'Cinematic drone shot, urban city', duration: '5s' },
  { id: '2', gradient: 'from-[#00FF87] to-[#7C3AED]', title: 'Neon lights in rain, close-up', duration: '5s' },
  { id: '3', gradient: 'from-[#EC4899] to-[#0A0A0A]', title: 'Abstract particles flowing', duration: '5s' },
]

const IMAGE_RESULTS = [
  { id: '1', gradient: 'from-[#7C3AED] to-[#00FF87]', title: 'Cyberpunk cityscape, night' },
  { id: '2', gradient: 'from-[#EC4899] to-[#7C3AED]', title: 'Minimal product shot, white' },
  { id: '3', gradient: 'from-[#00FF87] to-[#EC4899]', title: 'Portrait with neon lights' },
  { id: '4', gradient: 'from-[#0A0A0A] to-[#7C3AED]', title: 'Abstract digital art wave' },
]

const STYLE_OPTIONS = ['Cinematic', 'UGC', 'Viral', 'Dreamlike', 'Documentary']
const CAMERA_OPTIONS = ['Pan', 'Tilt', 'Zoom', 'Dolly', 'Orbit', 'Static']
const IMAGE_STYLES = ['Photorealistic', 'Illustration', 'Anime', 'Oil Paint', '3D Render', 'Sketch']
const RESOLUTION_OPTIONS = ['512×512', '768×768', '1024×1024', '1024×1792', '1792×1024']

function FrameUploadZone({ label }: { label: string }) {
  return (
    <div className="border-2 border-dashed border-[#2A2A2A] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-[#00FF87]/40 transition-colors cursor-pointer group min-h-[100px]">
      <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#00FF87]/10 transition-colors">
        <Upload className="w-4 h-4 text-[#555555] group-hover:text-[#00FF87]" />
      </div>
      <p className="text-xs text-[#555555] text-center leading-tight">{label}</p>
    </div>
  )
}

function VideoTab() {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('luma')
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [duration, setDuration] = useState('5s')
  const [aspect, setAspect] = useState('16:9')
  const [style, setStyle] = useState('Cinematic')
  const [camera, setCamera] = useState('Pan')
  const [motion, setMotion] = useState(5)
  const [fps, setFps] = useState('24')
  const [generating, setGenerating] = useState(false)
  const [hasResults, setHasResults] = useState(true)

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setHasResults(true)
    }, 3000)
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Left Controls */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-hide">
        {/* Prompt */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your video... A cinematic drone shot of a neon-lit city at night, rain reflecting lights on wet streets..."
            rows={4}
            className="w-full bg-[#111111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444444] outline-none resize-none focus:border-[#00FF87]/40 transition-colors leading-relaxed"
          />
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Model</label>
          <div className="space-y-1.5">
            {VIDEO_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  selectedModel === model.id
                    ? 'border-[#00FF87]/40 bg-[#00FF87]/5 text-white'
                    : 'border-[#2A2A2A] bg-[#111111] text-[#AAAAAA] hover:border-[#2A2A2A] hover:text-white'
                }`}
              >
                <span>{model.name}</span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ color: model.color, backgroundColor: `${model.color}15` }}
                  >
                    {model.tag}
                  </span>
                  {selectedModel === model.id && (
                    <Check className="w-3.5 h-3.5 text-[#00FF87]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Collapsible */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:bg-[#1A1A1A] transition-colors"
          >
            <span>Settings</span>
            {settingsOpen ? <ChevronUp className="w-4 h-4 text-[#AAAAAA]" /> : <ChevronDown className="w-4 h-4 text-[#AAAAAA]" />}
          </button>
          {settingsOpen && (
            <div className="px-4 pb-4 space-y-4 border-t border-[#2A2A2A] pt-4">
              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs text-[#AAAAAA]">Duration</label>
                <div className="flex gap-2">
                  {['3s', '5s', '10s', '30s'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        duration === d
                          ? 'bg-[#00FF87]/10 border-[#00FF87]/40 text-[#00FF87]'
                          : 'border-[#2A2A2A] text-[#AAAAAA] hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <label className="text-xs text-[#AAAAAA]">Aspect Ratio</label>
                <div className="flex gap-2">
                  {['9:16', '16:9', '1:1', '4:3'].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAspect(a)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        aspect === a
                          ? 'bg-[#00FF87]/10 border-[#00FF87]/40 text-[#00FF87]'
                          : 'border-[#2A2A2A] text-[#AAAAAA] hover:text-white'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <label className="text-xs text-[#AAAAAA]">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white outline-none"
                >
                  {STYLE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Camera */}
              <div className="space-y-2">
                <label className="text-xs text-[#AAAAAA]">Camera Movement</label>
                <select
                  value={camera}
                  onChange={(e) => setCamera(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white outline-none"
                >
                  {CAMERA_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Motion */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs text-[#AAAAAA]">Motion Intensity</label>
                  <span className="text-xs text-[#00FF87]">{motion}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={motion}
                  onChange={(e) => setMotion(Number(e.target.value))}
                  className="w-full accent-[#00FF87]"
                />
              </div>

              {/* FPS */}
              <div className="space-y-2">
                <label className="text-xs text-[#AAAAAA]">FPS</label>
                <div className="flex gap-2">
                  {['24', '30', '60'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFps(f)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        fps === f
                          ? 'bg-[#00FF87]/10 border-[#00FF87]/40 text-[#00FF87]'
                          : 'border-[#2A2A2A] text-[#AAAAAA] hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reference Images */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Reference Images</label>
          <div className="grid grid-cols-2 gap-2">
            <FrameUploadZone label="First Frame" />
            <FrameUploadZone label="Last Frame" />
            <FrameUploadZone label="Style Ref" />
            <FrameUploadZone label="Character" />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-black bg-[#00FF87] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] disabled:opacity-60 transition-all duration-300 text-sm"
          style={{ boxShadow: generating ? 'none' : '0 0 20px rgba(0,255,135,0.3)' }}
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Generate Video
              <span className="ml-auto bg-black/20 px-2 py-0.5 rounded-full text-xs">2 credits</span>
            </>
          )}
        </button>
      </div>

      {/* Right Results */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#AAAAAA] uppercase tracking-wider">Results</h3>
          {hasResults && (
            <span className="text-xs text-[#555555]">{MOCK_VIDEO_RESULTS.length} videos generated</span>
          )}
        </div>

        {hasResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {MOCK_VIDEO_RESULTS.map((result) => (
              <div
                key={result.id}
                className="relative rounded-xl overflow-hidden border border-[#2A2A2A] group cursor-pointer"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${result.gradient} flex items-center justify-center`}
                >
                  <button className="w-14 h-14 rounded-full bg-black/60 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </button>
                </div>
                <div className="p-3 bg-[#111111]">
                  <p className="text-xs text-[#AAAAAA] truncate">{result.title}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-[#555555]">{result.duration} · 16:9</span>
                    <span className="text-xs text-[#00FF87]">1080p</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center gap-3 border border-dashed border-[#2A2A2A] rounded-xl text-[#444444]">
            <Video className="w-10 h-10" />
            <p className="text-sm">Your generated videos will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ImageTab() {
  const [prompt, setPrompt] = useState('')
  const [styleEnhancer, setStyleEnhancer] = useState(true)
  const [selectedModels, setSelectedModels] = useState<string[]>(['flux-pro', 'ideogram'])
  const [resolution, setResolution] = useState('1024×1024')
  const [batchSize, setBatchSize] = useState(2)
  const [selectedStyle, setSelectedStyle] = useState('Photorealistic')
  const [generating, setGenerating] = useState(false)

  function toggleModel(id: string) {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Left Controls */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-hide">
        {/* Prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Prompt</label>
            <button
              onClick={() => setStyleEnhancer(!styleEnhancer)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${
                styleEnhancer
                  ? 'bg-[#7C3AED]/10 border-[#7C3AED]/40 text-[#7C3AED]'
                  : 'border-[#2A2A2A] text-[#AAAAAA]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Style Enhancer
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your image... A hyper-realistic portrait of a cyberpunk warrior with glowing neon tattoos..."
            rows={4}
            className="w-full bg-[#111111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444444] outline-none resize-none focus:border-[#7C3AED]/40 transition-colors leading-relaxed"
          />
        </div>

        {/* Model Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Models ({selectedModels.length} selected)</label>
          <div className="grid grid-cols-2 gap-2">
            {IMAGE_MODELS.map((model) => {
              const isSelected = selectedModels.includes(model.id)
              return (
                <button
                  key={model.id}
                  onClick={() => toggleModel(model.id)}
                  className={`relative p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#7C3AED]/50 bg-[#7C3AED]/10'
                      : 'border-[#2A2A2A] bg-[#111111] hover:border-[#2A2A2A] hover:bg-[#1A1A1A]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#7C3AED] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <p className="text-xs font-medium text-white leading-tight pr-4">{model.name}</p>
                  <p className="text-xs text-[#555555] mt-0.5">{model.tag}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Resolution */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Resolution</label>
          <div className="flex flex-wrap gap-2">
            {RESOLUTION_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setResolution(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  resolution === r
                    ? 'bg-[#7C3AED]/10 border-[#7C3AED]/40 text-[#7C3AED]'
                    : 'border-[#2A2A2A] text-[#AAAAAA] hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Size */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Batch Size</label>
          <div className="flex gap-2">
            {[1, 2, 4].map((b) => (
              <button
                key={b}
                onClick={() => setBatchSize(b)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  batchSize === b
                    ? 'bg-[#7C3AED]/10 border-[#7C3AED]/40 text-[#7C3AED]'
                    : 'border-[#2A2A2A] text-[#AAAAAA] hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Style Pills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Style</label>
          <div className="flex flex-wrap gap-2">
            {IMAGE_STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStyle(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedStyle === s
                    ? 'bg-[#7C3AED]/10 border-[#7C3AED]/40 text-[#7C3AED]'
                    : 'border-[#2A2A2A] text-[#AAAAAA] hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setGenerating(true)
            setTimeout(() => setGenerating(false), 2500)
          }}
          disabled={generating}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white bg-[#7C3AED] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] disabled:opacity-60 transition-all duration-300 text-sm"
        >
          {generating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Images<span className="ml-auto bg-black/20 px-2 py-0.5 rounded-full text-xs">1 credit</span></>
          )}
        </button>
      </div>

      {/* Right Results */}
      <div className="flex-1 space-y-4">
        <h3 className="text-sm font-semibold text-[#AAAAAA] uppercase tracking-wider">Results</h3>
        <div className="grid grid-cols-2 gap-4">
          {IMAGE_RESULTS.map((result) => (
            <div key={result.id} className="group relative rounded-xl overflow-hidden border border-[#2A2A2A] cursor-pointer">
              <div className={`h-56 bg-gradient-to-br ${result.gradient}`} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="px-3 py-1.5 bg-white text-black text-xs rounded-lg font-medium">Download</button>
                  <button className="px-3 py-1.5 bg-[#00FF87] text-black text-xs rounded-lg font-medium">Edit</button>
                </div>
              </div>
              <div className="p-3 bg-[#111111]">
                <p className="text-xs text-[#AAAAAA] truncate">{result.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#444444]">
      <Sparkles className="w-12 h-12" />
      <p className="text-lg font-semibold">{label} Generation</p>
      <p className="text-sm text-[#333333]">Coming soon — powered by CodePark AI</p>
    </div>
  )
}

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState('video')

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-6 pt-6 pb-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FF87] to-[#7C3AED] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Create</h1>
            <p className="text-xs text-[#AAAAAA]">AI-powered media generation</p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 border-b border-[#2A2A2A]">
          {MAIN_TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-widest transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-[#00FF87] text-[#00FF87]'
                    : 'border-transparent text-[#555555] hover:text-[#AAAAAA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6">
        {activeTab === 'video' && <VideoTab />}
        {activeTab === 'image' && <ImageTab />}
        {activeTab === 'music' && <PlaceholderTab label="Music" />}
        {activeTab === 'voice' && <PlaceholderTab label="Voice" />}
        {activeTab === '3d' && <PlaceholderTab label="3D" />}
      </div>
    </div>
  )
}
