"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Sparkles, Download, Copy, RefreshCw, ImageIcon,
  FileText, Loader2, Zap, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const MODELS = [
  {
    id: "flux-pro",
    label: "FLUX Pro",
    desc: "Photorealistic · Best quality",
    credits: 5,
    swatch: "bg-gradient-to-br from-[#C8A882]/30 to-[#B5704F]/20",
  },
  {
    id: "flux-dev",
    label: "FLUX Dev",
    desc: "Fast · Good quality",
    credits: 3,
    swatch: "bg-gradient-to-br from-[#8A9E8C]/30 to-[#C8A882]/20",
  },
  {
    id: "sdxl",
    label: "SDXL",
    desc: "Artistic · Creative",
    credits: 4,
    swatch: "bg-gradient-to-br from-[#B5704F]/30 to-[#8A9E8C]/20",
  },
];

const RATIOS = ["1:1", "16:9", "9:16", "4:3"] as const;

const RATIO_PREVIEW: Record<string, { w: number; h: number }> = {
  "1:1":  { w: 12, h: 12 },
  "16:9": { w: 16, h: 9 },
  "9:16": { w: 9,  h: 16 },
  "4:3":  { w: 14, h: 11 },
};

const TYPES = ["Blog Post", "Social Caption", "Ad Copy", "Script", "Email"] as const;
const TONES = ["Professional", "Casual", "Funny", "Formal"] as const;

type TextType = (typeof TYPES)[number];
type Tone     = (typeof TONES)[number];

export default function CreatePage() {
  const [tab,        setTab]        = useState<"images" | "text">("images");
  const [prompt,     setPrompt]     = useState("");
  const [model,      setModel]      = useState("flux-pro");
  const [ratio,      setRatio]      = useState("1:1");
  const [textType,   setTextType]   = useState<TextType>("Social Caption");
  const [tone,       setTone]       = useState<Tone>("Professional");
  const [loading,    setLoading]    = useState(false);
  const [imageUrl,   setImageUrl]   = useState<string | null>(null);
  const [textResult, setTextResult] = useState("");
  const [copied,     setCopied]     = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const textBoxRef = useRef<HTMLDivElement>(null);

  const selectedModel = MODELS.find((m) => m.id === model)!;

  async function generateImage() {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl(null);
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model, aspectRatio: ratio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setImageUrl(data.imageUrl);
      toast.success("Image generated!", { description: `${selectedModel.credits} credits used` });
    } catch (e: unknown) {
      toast.error("Generation failed", {
        description: e instanceof Error ? e.message : "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }

  async function generateText() {
    if (!prompt.trim()) return;
    setLoading(true);
    setTextResult("");
    try {
      const res = await fetch("/api/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          type: textType.toLowerCase().replace(" ", "_"),
          tone: tone.toLowerCase(),
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
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
            try {
              acc += JSON.parse(raw).text ?? "";
              setTextResult(acc);
            } catch {}
          }
        }
      }
      toast.success("Content generated!", { description: "2 credits used" });
    } catch (e: unknown) {
      toast.error("Failed", {
        description: e instanceof Error ? e.message : "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyText() {
    await navigator.clipboard.writeText(textResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#F2EDE6] tracking-wide">Create</span>
          <span className="artisan-label">[ ai_studio ]</span>
          <span className="w-px h-4 bg-[#2C271F]" />
          <span className="font-mono text-[10px] text-[#4A4135]">
            {tab === "images" ? `${selectedModel.credits} cr / image` : "2 cr / generation"}
          </span>
        </div>
        <button
          onClick={tab === "images" ? generateImage : generateText}
          disabled={!prompt.trim() || loading}
          className={cn(
            "flex items-center gap-2 h-8 px-4 rounded-[8px] text-[12px] font-semibold",
            "bg-[#C8A882] text-[#111009] hover:bg-[#BFA070]",
            "transition-[background-color,transform,opacity] duration-150 active:scale-[0.97]",
            (!prompt.trim() || loading) && "opacity-40 pointer-events-none"
          )}
        >
          {loading ? (
            <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" />
          ) : (
            <Sparkles style={{ width: 13, height: 13 }} />
          )}
          Generate
        </button>
      </header>

      {/* ── Scrollable body ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-[820px] mx-auto w-full animate-fade-up">
        {/* Tab switcher */}
        <div className="bg-[#0F0D0A] border border-[#2C271F] rounded-[10px] p-1 flex gap-1 w-fit">
          {(["images", "text"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 h-7 px-3 rounded-[7px] text-[12px] font-medium capitalize",
                "transition-all duration-150 active:scale-[0.97]",
                t === tab
                  ? "bg-[#1A1712] shadow-[0_1px_3px_rgba(0,0,0,0.3)] text-[#F2EDE6]"
                  : "text-[#6B5E50] hover:text-[#A89880]"
              )}
            >
              {t === "images" ? (
                <ImageIcon style={{ width: 12, height: 12 }} />
              ) : (
                <FileText style={{ width: 12, height: 12 }} />
              )}
              {t === "images" ? "Images" : "Text"}
            </button>
          ))}
        </div>

        {/* Prompt textarea */}
        <div className="bg-[#0F0D0A] border border-[#2C271F] rounded-[12px] p-4 transition-[border-color,box-shadow] duration-150 focus-within:border-[#C8A882]/40 focus-within:shadow-[0_0_0_3px_rgba(200,168,130,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-[#6B5E50] tracking-wider">
              {"{ prompt }"}
            </span>
            <span className="font-mono text-[10px] text-[#4A4135]">{prompt.length}/1000</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={1000}
            placeholder={
              tab === "images"
                ? "Describe the image you want to create…"
                : "Describe the content you want to generate…"
            }
            rows={4}
            className="w-full bg-transparent text-[#F2EDE6] placeholder:text-[#6B5E50]/50 text-[14px] resize-none focus:outline-none leading-relaxed"
          />
        </div>

        {tab === "images" ? (
          <>
            {/* Model selector */}
            <div>
              <p className="font-mono text-[10px] text-[#6B5E50] mb-3 tracking-widest uppercase">
                Model
              </p>
              <div className="grid grid-cols-3 gap-2">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={cn(
                      "rounded-[12px] border p-4 cursor-pointer text-left relative overflow-hidden",
                      "transition-all duration-150 active:scale-[0.98]",
                      model === m.id
                        ? "border-[#C8A882]/60 bg-[#C8A882]/5 shadow-[0_0_0_1px_rgba(200,168,130,0.15)]"
                        : "border-[#2C271F] bg-[#0F0D0A] hover:border-[#3A3328]"
                    )}
                  >
                    {/* Gradient swatch top-right */}
                    <div
                      className={cn(
                        "absolute top-3 right-3 w-8 h-8 rounded-[6px]",
                        m.swatch
                      )}
                    />
                    <p className="text-[12px] font-semibold text-[#F2EDE6] pr-10">{m.label}</p>
                    <p className="text-[11px] text-[#6B5E50] mt-1 leading-snug">{m.desc}</p>
                    <p className="font-mono text-[10px] text-[#C8A882] mt-3">
                      {m.credits} credits
                    </p>
                    {model === m.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C8A882]/60 via-[#C8A882]/40 to-transparent" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect ratio */}
            <div>
              <p className="font-mono text-[10px] text-[#6B5E50] mb-3 tracking-widest uppercase">
                Aspect Ratio
              </p>
              <div className="flex gap-2">
                {RATIOS.map((r) => {
                  const preview = RATIO_PREVIEW[r];
                  const scale = 14 / Math.max(preview.w, preview.h);
                  const pw = Math.round(preview.w * scale);
                  const ph = Math.round(preview.h * scale);
                  return (
                    <button
                      key={r}
                      onClick={() => setRatio(r)}
                      className={cn(
                        "flex items-center gap-2 h-9 px-3 rounded-[8px] text-[12px] font-mono",
                        "transition-all duration-150 active:scale-[0.97]",
                        ratio === r
                          ? "bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/40"
                          : "text-[#6B5E50] hover:text-[#A89880] border border-[#2C271F] hover:border-[#3A3328]"
                      )}
                    >
                      {/* Mini proportion rect */}
                      <span
                        className={cn(
                          "shrink-0 rounded-[1px] border",
                          ratio === r ? "border-[#C8A882]/60 bg-[#C8A882]/20" : "border-[#6B5E50]/50"
                        )}
                        style={{ width: pw, height: ph, display: "inline-block" }}
                      />
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generateImage}
              disabled={!prompt.trim() || loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 h-11 rounded-[10px] relative",
                "bg-[#C8A882] text-[#111009] text-[13px] font-semibold",
                "hover:bg-[#BFA070] hover:shadow-[0_0_20px_rgba(200,168,130,0.25)]",
                "transition-[background-color,box-shadow,transform,opacity] duration-150 active:scale-[0.97]",
                (!prompt.trim() || loading) && "opacity-40 pointer-events-none"
              )}
            >
              {loading ? (
                <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} />
              ) : (
                <Sparkles style={{ width: 14, height: 14 }} />
              )}
              {loading ? "Generating…" : "Generate Image"}
              {/* Credits badge */}
              <span className="absolute right-4 font-mono text-[11px] bg-[#111009]/25 px-2 py-0.5 rounded-[5px]">
                {selectedModel.credits} credits
              </span>
            </button>

            {/* Image result */}
            {imageUrl && (
              <div
                className="rounded-[16px] overflow-hidden border border-[#2C271F] animate-fade-in"
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
              >
                <div className="relative">
                  <Image
                    src={imageUrl}
                    alt="Generated"
                    width={800}
                    height={600}
                    className="w-full object-cover"
                    unoptimized
                  />
                  {/* Hover overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center gap-3",
                      "bg-[#111009]/60 backdrop-blur-[2px]",
                      "transition-opacity duration-200",
                      imageHover ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <a
                      href={imageUrl}
                      download="generated.png"
                      className="flex items-center gap-1.5 h-9 px-4 rounded-[8px] text-[12px] font-medium bg-[#0F0D0A] border border-[#2C271F] text-[#F2EDE6] hover:border-[#3A3328] transition-[border-color] duration-150"
                    >
                      <Download style={{ width: 13, height: 13 }} /> Download
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(imageUrl);
                        toast.success("URL copied");
                      }}
                      className="flex items-center gap-1.5 h-9 px-4 rounded-[8px] text-[12px] font-medium bg-[#0F0D0A] border border-[#2C271F] text-[#F2EDE6] hover:border-[#3A3328] transition-[border-color] duration-150"
                    >
                      <Copy style={{ width: 13, height: 13 }} /> Copy URL
                    </button>
                  </div>
                </div>
                {/* Metadata strip */}
                <div className="px-5 py-3 bg-[#0F0D0A] border-t border-[#2C271F] flex items-center gap-4">
                  <span className="font-mono text-[11px] text-[#6B5E50]">model: {model}</span>
                  <span className="w-px h-3 bg-[#2C271F]" />
                  <span className="font-mono text-[11px] text-[#6B5E50]">ratio: {ratio}</span>
                  <span className="w-px h-3 bg-[#2C271F]" />
                  <span className="font-mono text-[11px] text-[#C8A882]">
                    {selectedModel.credits} credits used
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Content type */}
            <div>
              <p className="font-mono text-[10px] text-[#6B5E50] mb-3 tracking-widest uppercase">
                Content Type
              </p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTextType(t)}
                    className={cn(
                      "h-8 px-3 rounded-[8px] text-[12px] font-medium",
                      "transition-all duration-150 active:scale-[0.97]",
                      textType === t
                        ? "bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/40"
                        : "text-[#6B5E50] hover:text-[#A89880] border border-[#2C271F] hover:border-[#3A3328]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <p className="font-mono text-[10px] text-[#6B5E50] mb-3 tracking-widest uppercase">
                Tone
              </p>
              <div className="flex gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "h-7 px-2.5 rounded-[6px] text-[11px] font-medium",
                      "transition-all duration-150 active:scale-[0.97]",
                      tone === t
                        ? "bg-[#8A9E8C]/15 text-[#8A9E8C] border border-[#8A9E8C]/40"
                        : "text-[#6B5E50] hover:text-[#A89880] border border-[#2C271F] hover:border-[#3A3328]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generateText}
              disabled={!prompt.trim() || loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 h-11 rounded-[10px] relative",
                "bg-[#C8A882] text-[#111009] text-[13px] font-semibold",
                "hover:bg-[#BFA070] hover:shadow-[0_0_20px_rgba(200,168,130,0.25)]",
                "transition-[background-color,box-shadow,transform,opacity] duration-150 active:scale-[0.97]",
                (!prompt.trim() || loading) && "opacity-40 pointer-events-none"
              )}
            >
              {loading ? (
                <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} />
              ) : (
                <Zap style={{ width: 14, height: 14 }} />
              )}
              {loading ? "Generating…" : "Generate Text"}
              <span className="absolute right-4 font-mono text-[11px] bg-[#111009]/25 px-2 py-0.5 rounded-[5px]">
                2 credits
              </span>
            </button>

            {/* Text result */}
            {textResult && (
              <div className="border border-[#2C271F] rounded-[12px] overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F0D0A] border-b border-[#2C271F]">
                  <span className="font-mono text-[10px] text-[#6B5E50]">
                    output · {textType.toLowerCase()}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={copyText}
                      className="flex items-center gap-1.5 h-6 px-2.5 rounded-[5px] text-[11px] text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-all duration-150"
                    >
                      {copied ? (
                        <CheckCircle2 style={{ width: 11, height: 11, color: "#8A9E8C" }} />
                      ) : (
                        <Copy style={{ width: 11, height: 11 }} />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={generateText}
                      className="flex items-center gap-1.5 h-6 px-2.5 rounded-[5px] text-[11px] text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-all duration-150"
                    >
                      <RefreshCw style={{ width: 11, height: 11 }} /> Regen
                    </button>
                  </div>
                </div>
                <div
                  ref={textBoxRef}
                  className="bg-[#0F0D0A] p-5 font-mono text-[13px] text-[#F2EDE6] leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto"
                >
                  {textResult}
                  {loading && (
                    <span className="inline-block w-[7px] h-[14px] bg-[#C8A882] ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Recent generations */}
        <section className="pb-4">
          <div className="flex items-center gap-3 mb-4">
            <h3
              className="text-[16px] text-[#F2EDE6]"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Recent Generations
            </h3>
            <span className="w-px h-4 bg-[#2C271F]" />
            <span className="font-mono text-[10px] text-[#4A4135]">session · 3 items</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                type: "IMAGE",
                title: "Product hero shot",
                model: "flux-pro",
                time: "8m ago",
                gradient: "from-[#B5704F]/50 to-[#C8A882]/30",
              },
              {
                type: "TEXT",
                title: "Instagram caption",
                model: "claude-3",
                time: "22m ago",
                gradient: "from-[#8A9E8C]/50 to-[#C8A882]/25",
              },
              {
                type: "IMAGE",
                title: "Brand banner",
                model: "sdxl",
                time: "1h ago",
                gradient: "from-[#C8A882]/40 to-[#B5704F]/30",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#0F0D0A] border border-[#2C271F] rounded-[12px] overflow-hidden hover:border-[#3A3328] transition-[border-color,box-shadow] duration-150 cursor-pointer group hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              >
                <div
                  className={cn(
                    "h-20 bg-gradient-to-br flex items-center justify-center",
                    item.gradient
                  )}
                >
                  {item.type === "TEXT" ? (
                    <FileText style={{ width: 22, height: 22, color: "#8A9E8C" }} />
                  ) : (
                    <ImageIcon style={{ width: 22, height: 22, color: "#C8A882" }} />
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "font-mono text-[9px] px-1.5 py-0.5 rounded-[3px]",
                        item.type === "IMAGE"
                          ? "text-[#C8A882] bg-[#C8A882]/8 border border-[#C8A882]/20"
                          : "text-[#8A9E8C] bg-[#8A9E8C]/8 border border-[#8A9E8C]/20"
                      )}
                    >
                      {item.type}
                    </span>
                    <span className="font-mono text-[9px] text-[#4A4135]">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-[#A89880] mt-1 truncate">{item.title}</p>
                  <p className="font-mono text-[9px] text-[#4A4135] mt-0.5">{item.model}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
