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
  { id: "flux-pro",  label: "FLUX Pro",  desc: "Photorealistic · Best quality",  credits: 5 },
  { id: "flux-dev",  label: "FLUX Dev",  desc: "Fast · Good quality",             credits: 3 },
  { id: "sdxl",      label: "SDXL",      desc: "Artistic · Creative",             credits: 4 },
];

const RATIOS  = ["1:1", "16:9", "9:16", "4:3"];
const TYPES   = ["Blog Post", "Social Caption", "Ad Copy", "Script", "Email"] as const;
const TONES   = ["Professional", "Casual", "Funny", "Formal"] as const;

type TextType = typeof TYPES[number];
type Tone     = typeof TONES[number];

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
  const textBoxRef = useRef<HTMLDivElement>(null);

  const selectedModel = MODELS.find(m => m.id === model)!;

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
      toast.error("Generation failed", { description: e instanceof Error ? e.message : "Please try again" });
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
        body: JSON.stringify({ prompt, type: textType.toLowerCase().replace(" ", "_"), tone: tone.toLowerCase() }),
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
            try { acc += JSON.parse(raw).text ?? ""; setTextResult(acc); } catch {}
          }
        }
      }
      toast.success("Content generated!", { description: "2 credits used" });
    } catch (e: unknown) {
      toast.error("Failed", { description: e instanceof Error ? e.message : "Please try again" });
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
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#F2EDE6] tracking-wide">Create</span>
          <span className="font-mono text-[10px] text-[#6B5E50] border border-[#2C271F] px-2 py-0.5 rounded-[4px]">[ ai_studio ]</span>
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
          {loading ? <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" /> : <Sparkles style={{ width: 13, height: 13 }} />}
          Generate
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-[820px] mx-auto w-full">
        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-[#1A1712] border border-[#2C271F] rounded-[10px] w-fit">
          {(["images", "text"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 h-7 px-3 rounded-[7px] text-[12px] font-medium capitalize",
                "transition-[background-color,color] duration-150 active:scale-[0.97]",
                tab === t ? "bg-[#C8A882] text-[#111009]" : "text-[#6B5E50] hover:text-[#A89880]"
              )}
            >
              {t === "images" ? <ImageIcon style={{ width: 12, height: 12 }} /> : <FileText style={{ width: 12, height: 12 }} />}
              {t === "images" ? "Images" : "Text"}
            </button>
          ))}
        </div>

        {/* Prompt */}
        <div className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-[#6B5E50] tracking-wider">{"{ prompt }"}</span>
            <span className="font-mono text-[10px] text-[#6B5E50]">{prompt.length}/1000</span>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            maxLength={1000}
            placeholder={tab === "images" ? "Describe the image you want to create…" : "Describe the content you want to generate…"}
            rows={4}
            className="w-full bg-transparent text-[#F2EDE6] placeholder:text-[#6B5E50]/60 text-[14px] resize-none focus:outline-none leading-relaxed"
          />
        </div>

        {tab === "images" ? (
          <>
            {/* Model selector */}
            <div>
              <p className="font-mono text-[10px] text-[#6B5E50] mb-2 tracking-wide">MODEL</p>
              <div className="grid grid-cols-3 gap-2">
                {MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={cn(
                      "p-3 rounded-[10px] border text-left",
                      "transition-[border-color,background-color] duration-150 active:scale-[0.97]",
                      model === m.id
                        ? "border-[#C8A882] bg-[#C8A882]/8"
                        : "border-[#2C271F] bg-[#1A1712] hover:border-[#3A3328]"
                    )}
                  >
                    <p className="text-[12px] font-semibold text-[#F2EDE6]">{m.label}</p>
                    <p className="text-[11px] text-[#6B5E50] mt-0.5">{m.desc}</p>
                    <p className="font-mono text-[10px] text-[#C8A882] mt-1.5">{m.credits} credits</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect ratio */}
            <div>
              <p className="font-mono text-[10px] text-[#6B5E50] mb-2 tracking-wide">ASPECT RATIO</p>
              <div className="flex gap-2">
                {RATIOS.map(r => (
                  <button
                    key={r}
                    onClick={() => setRatio(r)}
                    className={cn(
                      "h-8 px-3 rounded-[8px] text-[12px] font-mono",
                      "transition-[background-color,color,border-color] duration-150 active:scale-[0.97]",
                      ratio === r
                        ? "bg-[#C8A882]/15 text-[#C8A882] border border-[#C8A882]/40"
                        : "text-[#6B5E50] hover:text-[#A89880] border border-[#2C271F]"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generateImage}
              disabled={!prompt.trim() || loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 h-10 rounded-[10px]",
                "bg-[#C8A882] text-[#111009] text-[13px] font-semibold",
                "hover:bg-[#BFA070] hover:shadow-[0_0_20px_rgba(200,168,130,0.25)]",
                "transition-[background-color,box-shadow,transform,opacity] duration-150 active:scale-[0.97]",
                (!prompt.trim() || loading) && "opacity-40 pointer-events-none"
              )}
            >
              {loading ? <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} /> : <Sparkles style={{ width: 14, height: 14 }} />}
              {loading ? "Generating…" : `Generate Image · ${selectedModel.credits} credits`}
            </button>

            {/* Result */}
            {imageUrl && (
              <div className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] overflow-hidden">
                <div className="relative">
                  <Image src={imageUrl} alt="Generated" width={800} height={600} className="w-full object-cover" unoptimized />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <a
                      href={imageUrl}
                      download="generated.png"
                      className="flex items-center gap-1 h-7 px-3 rounded-[6px] text-[11px] font-medium bg-[#111009]/80 text-[#F2EDE6] hover:bg-[#111009] transition-[background-color] duration-150 backdrop-blur-sm"
                    >
                      <Download style={{ width: 11, height: 11 }} /> Save
                    </a>
                    <button
                      onClick={() => { navigator.clipboard.writeText(imageUrl); toast.success("URL copied"); }}
                      className="flex items-center gap-1 h-7 px-3 rounded-[6px] text-[11px] font-medium bg-[#111009]/80 text-[#F2EDE6] hover:bg-[#111009] transition-[background-color] duration-150 backdrop-blur-sm"
                    >
                      <Copy style={{ width: 11, height: 11 }} /> Copy URL
                    </button>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-[#2C271F]">
                  <p className="text-[12px] text-[#6B5E50] font-mono">model: {model} · ratio: {ratio}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Content type */}
            <div>
              <p className="font-mono text-[10px] text-[#6B5E50] mb-2 tracking-wide">CONTENT TYPE</p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTextType(t)}
                    className={cn(
                      "h-8 px-3 rounded-[8px] text-[12px] font-medium",
                      "transition-[background-color,color,border-color] duration-150 active:scale-[0.97]",
                      textType === t
                        ? "bg-[#C8A882]/15 text-[#C8A882] border border-[#C8A882]/40"
                        : "text-[#6B5E50] hover:text-[#A89880] border border-[#2C271F]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <p className="font-mono text-[10px] text-[#6B5E50] mb-2 tracking-wide">TONE</p>
              <div className="flex gap-2">
                {TONES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "h-7 px-2.5 rounded-[6px] text-[11px] font-medium",
                      "transition-[background-color,color,border-color] duration-150 active:scale-[0.97]",
                      tone === t
                        ? "bg-[#8A9E8C]/20 text-[#8A9E8C] border border-[#8A9E8C]/40"
                        : "text-[#6B5E50] hover:text-[#A89880] border border-[#2C271F]"
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
                "w-full flex items-center justify-center gap-2 h-10 rounded-[10px]",
                "bg-[#C8A882] text-[#111009] text-[13px] font-semibold",
                "hover:bg-[#BFA070] hover:shadow-[0_0_20px_rgba(200,168,130,0.25)]",
                "transition-[background-color,box-shadow,transform,opacity] duration-150 active:scale-[0.97]",
                (!prompt.trim() || loading) && "opacity-40 pointer-events-none"
              )}
            >
              {loading ? <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} /> : <Zap style={{ width: 14, height: 14 }} />}
              {loading ? "Generating…" : "Generate Text · 2 credits"}
            </button>

            {/* Text result */}
            {textResult && (
              <div className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2C271F]">
                  <span className="font-mono text-[10px] text-[#6B5E50]">output · {textType.toLowerCase()}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={copyText}
                      className="flex items-center gap-1 h-6 px-2.5 rounded-[5px] text-[11px] text-[#6B5E50] hover:text-[#A89880] hover:bg-[#221E18] transition-[background-color,color] duration-150"
                    >
                      {copied ? <CheckCircle2 style={{ width: 11, height: 11, color: "#8A9E8C" }} /> : <Copy style={{ width: 11, height: 11 }} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={generateText}
                      className="flex items-center gap-1 h-6 px-2.5 rounded-[5px] text-[11px] text-[#6B5E50] hover:text-[#A89880] hover:bg-[#221E18] transition-[background-color,color] duration-150"
                    >
                      <RefreshCw style={{ width: 11, height: 11 }} /> Regenerate
                    </button>
                  </div>
                </div>
                <div ref={textBoxRef} className="p-4 text-[13px] text-[#F2EDE6] leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                  {textResult}
                  {loading && <span className="inline-block w-2 h-4 bg-[#C8A882] ml-0.5 animate-pulse" />}
                </div>
              </div>
            )}
          </>
        )}

        {/* Recent generations */}
        <section>
          <h3 className="text-[16px] text-[#F2EDE6] mb-3" style={{ fontFamily: "var(--font-dm-serif)" }}>Recent Generations</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: "IMAGE", title: "Product hero shot", gradient: "from-[#B5704F]/50 to-[#C8A882]/30" },
              { type: "TEXT",  title: "Instagram caption",  gradient: "from-[#8A9E8C]/50 to-[#C8A882]/25" },
              { type: "IMAGE", title: "Brand banner",        gradient: "from-[#C8A882]/40 to-[#B5704F]/30" },
            ].map((item, i) => (
              <div key={i} className="bg-[#1A1712] border border-[#2C271F] rounded-[10px] overflow-hidden hover:border-[#3A3328] transition-[border-color] duration-150 cursor-pointer group">
                <div className={cn("h-20 bg-gradient-to-br", item.gradient, "flex items-center justify-center")}>
                  {item.type === "TEXT" ? <FileText style={{ width: 20, height: 20, color: "#8A9E8C" }} /> : <ImageIcon style={{ width: 20, height: 20, color: "#C8A882" }} />}
                </div>
                <div className="p-2.5">
                  <span className="font-mono text-[9px] text-[#6B5E50]">{item.type}</span>
                  <p className="text-[11px] text-[#F2EDE6] mt-0.5 truncate">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
