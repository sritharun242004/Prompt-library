import { useState } from "react";
import {
  Copy, Save, Sparkles, Wand2, ChevronDown, ChevronUp,
  RefreshCw, Check, ArrowRight, Layers,
} from "lucide-react";
import { toast } from "sonner";
import { platforms } from "../theme";
import { authStore } from "../../lib/api";

// ─── Enhancement options ──────────────────────────────────────────────────────

const STYLES  = ["Cinematic", "Minimalist", "Vintage", "Dark Moody", "Vibrant", "Hyperrealistic", "Anime", "Watercolor", "3D Render", "Sketch", "Oil Painting", "Neon"];
const MOODS   = ["Dramatic", "Peaceful", "Energetic", "Mysterious", "Nostalgic", "Futuristic", "Romantic", "Eerie", "Epic", "Intimate"];
const ASPECTS = ["1:1", "16:9", "9:16", "4:3", "2:3", "3:2", "21:9"];

const FAMILIES = [
  { key: "image",   label: "🎨 Image",   desc: "Midjourney, Flux…" },
  { key: "video",   label: "🎬 Video",   desc: "Sora, Runway…" },
  { key: "text",    label: "✍️ Text",    desc: "ChatGPT, Claude…" },
  { key: "content", label: "📣 Content", desc: "Ads, posts, copy…" },
];

// ─── Prompt variations ────────────────────────────────────────────────────────
// Each platform × family pair has 4 structurally different prompt approaches.
// Regenerate cycles through them so each click gives a genuinely different result.

function getVariations(
  idea: string,
  family: string,
  style: string,
  mood: string,
  aspect: string,
  platform: string,
): string[] {
  const s  = style ? `, ${style.toLowerCase()} style`      : "";
  const m  = mood  ? `, ${mood.toLowerCase()} mood`        : "";
  const sa = style ? `, ${style.toLowerCase()} aesthetic`  : "";
  const ma = mood  ? `, ${mood.toLowerCase()} atmosphere`  : "";
  const ar = aspect || "16:9";
  const st = style || "cinematic";
  const mo = mood  || "dramatic";

  // ── IMAGE ──────────────────────────────────────────────────────────────────
  if (family === "image") {
    if (platform === "midjourney") return [
      `${idea}${s}${m}, ultra-detailed, dramatic lighting, professional composition --ar ${ar} --v 6 --style raw --q 2`,
      `${idea}${sa}${ma}, 8K resolution, sharp focus, masterpiece quality --ar ${ar} --v 6 --chaos 10 --stylize 500`,
      `cinematic still of ${idea}${s}${m}, film grain, anamorphic bokeh, golden hour --ar ${ar} --v 6 --style expressive`,
      `editorial photography of ${idea}${s}${m}, studio lighting, high contrast, award-winning shot --ar ${ar} --v 6 --q 2`,
    ];
    if (platform === "flux") return [
      `Ultra-detailed ${idea}${sa}${ma}, shot on 85mm lens, f/1.8, soft diffused lighting, editorial composition, photorealistic 8K, aspect ratio ${ar}.`,
      `Photorealistic render of ${idea}${s}${m}. Hyperdetailed textures, professional studio lighting, sharp focus, 4K resolution. Aspect ratio ${ar}.`,
      `${idea} — ${st} aesthetic, ${mo} atmosphere, depth-of-field bokeh, golden ratio composition, ultra-sharp, cinematic 8K. Ratio ${ar}.`,
      `High-end commercial photograph of ${idea}. Style: ${st}. Mood: ${mo}. Technical: Hasselblad medium format, 50mm, f/2.8, natural light. ${ar} crop.`,
    ];
    if (platform === "firefly") return [
      `${idea}${s}${m}, high detail, professional photography, sharp focus, dramatic lighting, high resolution.`,
      `${idea}, ${st} look, ${mo} tone, vibrant colors, ultra sharp, 8K quality, cinematic framing.`,
      `Detailed artistic render of ${idea}${s}${m}. Professional composition, rich colors, studio-quality lighting.`,
      `${idea}, photorealistic, ${st} style, ${mo} atmosphere, depth of field, award-winning photography.`,
    ];
    if (platform === "grok") return [
      `Visualize: ${idea}.${style ? ` Style: ${style}.` : ""}${mood ? ` Mood: ${mood}.` : ""} Aspect ratio ${ar}.`,
      `Imagine a ${mo} scene: ${idea}. Rendered in ${st} style. Sharp details, professional quality. ${ar}.`,
      `Create image — Subject: ${idea}. Aesthetic: ${st}. Atmosphere: ${mo}. Format: ${ar}.`,
      `${idea} — depicted with ${st} visual style and ${mo} emotional tone. High quality, ${ar} format.`,
    ];
    if (platform === "chatgpt") return [
      `Generate an image of ${idea}.${style ? `\nArt style: ${style}.` : ""}${mood ? `\nMood: ${mood}.` : ""}\nAspect ratio: ${ar}\nQuality: ultra-detailed, professional composition, sharp focus.`,
      `Create a photorealistic image showing ${idea}.\nVisual style: ${st}\nEmotional tone: ${mo}\nTechnical specs: high resolution, ${ar} aspect ratio, professional lighting.`,
      `I want an image of ${idea}. Apply a ${st} visual treatment with a ${mo} atmosphere. Use dramatic lighting, sharp detail, and ${ar} format.`,
      `Render: ${idea}\nStyle parameters: ${st} aesthetic, ${mo} mood, editorial composition\nOutput: high-resolution, ${ar} aspect ratio, print-quality detail.`,
    ];
    if (platform === "gemini") return [
      `Create a photorealistic image of ${idea}${s}${m}. Ultra-detailed with professional composition and dramatic lighting. Aspect ratio ${ar}.`,
      `Generate ${idea} in ${st} visual style with ${mo} mood. Include rich textures, dramatic lighting, and professional composition. ${ar} format.`,
      `Produce a high-quality image depicting ${idea}. Aesthetic: ${st}. Tone: ${mo}. Ensure sharp focus, vibrant detail, and ${ar} ratio.`,
      `Image prompt: ${idea} — ${st} style, ${mo} atmosphere, cinematic framing, ultra-detailed render, ${ar} aspect ratio.`,
    ];
  }

  // ── VIDEO ──────────────────────────────────────────────────────────────────
  if (family === "video") {
    const cam = "slow cinematic push-in, shallow depth of field";
    if (platform === "chatgpt" || platform === "gemini" || platform === "grok") return [
      `Create a short cinematic video of ${idea}${s}${m}.\nCamera: ${cam}.\nLighting: dramatic and natural.\nDuration: 5–10 seconds, seamless loop.`,
      `Direct a ${mo} video sequence: ${idea}. Style: ${st}. Use slow motion, cinematic color grading, and atmospheric sound design. 8–12 seconds.`,
      `Video brief — Scene: ${idea}. Visual tone: ${st}. Emotion: ${mo}. Camera work: handheld, intimate. Duration: 6 seconds. Seamless loop.`,
      `Cinematic short: ${idea}. Apply ${st} color grading. Mood: ${mo}. Transition: fade in/out. Duration: 10 seconds. Aspect: ${ar}.`,
    ];
    return [
      `Cinematic video — ${idea}${s}${m}. Camera: ${cam}. Lighting: dramatic and natural. 5–10 second seamless loop. ${ar}.`,
      `${idea}, ${st} color grade, ${mo} energy, slow motion, depth of field, cinematic quality. 8 seconds, loop. ${ar}.`,
      `Short film sequence: ${idea}. Style: ${st}. Mood: ${mo}. Steady-cam movement, anamorphic lens flare. 10 seconds. ${ar} format.`,
      `Atmospheric video clip — ${idea}. ${st} aesthetic. ${mo} feel. 24fps cinematic, golden hour lighting, seamless loop. Ratio: ${ar}.`,
    ];
  }

  // ── TEXT ──────────────────────────────────────────────────────────────────
  if (family === "text") {
    const tone = style || "professional";
    return [
      `You are an expert writer. Write about: "${idea}".\n${style ? `Tone: ${style}.\n` : ""}${mood ? `Mood: ${mood}.\n` : ""}Keep it clear, engaging, and well-structured. Begin directly without preamble.`,
      `Act as a ${tone} writer. Create compelling content about "${idea}". Maintain a ${mo} tone throughout. Use vivid language, strong verbs, and clear structure.`,
      `Write a detailed, engaging piece on "${idea}". Style: ${tone}. Emotional register: ${mo}. Include a strong opening, supporting detail, and memorable close.`,
      `Craft a ${tone}-style piece about "${idea}". Voice: confident and authoritative. Tone: ${mo}. Length: 3–5 paragraphs. No filler — every sentence should earn its place.`,
    ];
  }

  // ── CONTENT ───────────────────────────────────────────────────────────────
  if (family === "content") {
    const voice = style || "conversational";
    return [
      `Act as a professional content strategist. Create compelling content for: "${idea}".\n${style ? `Voice: ${style}.\n` : ""}Goal: engage the audience, drive action, and communicate value clearly.`,
      `Write high-converting content about "${idea}". Voice: ${voice}. Format: punchy headline + 3 key points + CTA. Audience-first, benefit-driven.`,
      `Content brief — Topic: "${idea}". Tone: ${voice}. Goal: share, engage, convert. Lead with a hook, support with value, close with a clear action.`,
      `Create scroll-stopping content on "${idea}". Style: ${voice}. Structure: hook → insight → proof → CTA. Keep each line intentional and punchy.`,
    ];
  }

  return [`${idea}${s}${m}.`];
}

// ─── Chip selector ────────────────────────────────────────────────────────────

function ChipGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[13px] text-[#5f6c7b] mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? "" : opt)}
            className={`px-3 py-1 rounded-full text-[12px] border transition-all ${
              value === opt
                ? "bg-[#094067] text-white border-[#094067]"
                : "bg-white border-[#094067]/20 text-[#5f6c7b] hover:border-[#094067]/50 hover:text-[#094067]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Builder() {
  const [idea, setIdea]         = useState("");
  const [family, setFamily]     = useState("image");
  const [style, setStyle]       = useState("");
  const [mood, setMood]         = useState("");
  const [aspect, setAspect]     = useState("16:9");
  const [platform, setPlatform] = useState("midjourney");
  const [showEnhance, setShowEnhance] = useState(true);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  // Generation state
  const [generated, setGenerated]   = useState("");
  const [varIndex, setVarIndex]     = useState(0);
  const [isLoading, setIsLoading]   = useState(false);
  const [copied, setCopied]         = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const canGenerate = idea.trim().length > 0;

  function runGenerate(nextVarIndex: number) {
    if (!canGenerate) return;
    setIsLoading(true);
    setHasGenerated(false);
    setTimeout(() => {
      const variations = getVariations(idea, family, style, mood, aspect, platform);
      setGenerated(variations[nextVarIndex % variations.length]);
      setIsLoading(false);
      setHasGenerated(true);
    }, 520);
  }

  function handleGenerate() {
    const next = 0;
    setVarIndex(next);
    runGenerate(next);
  }

  function handleRegenerate() {
    const next = varIndex + 1;
    setVarIndex(next);
    runGenerate(next);
  }

  function handleCopy() {
    if (!generated) return;
    navigator.clipboard?.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // All-platforms preview
  const allPlatformOutputs = platforms.map((pl) => ({
    ...pl,
    prompt: getVariations(idea, family, style, mood, aspect, pl.key)[varIndex % 4],
  }));

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 text-[#094067]">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-[#ef4565] mb-2">
          <Sparkles className="w-4 h-4" /> Prompt Builder
        </div>
        <h1 className="text-3xl font-bold">Describe your idea — generate a ready-to-use prompt</h1>
        <p className="text-[#5f6c7b] mt-1">
          Type a sentence or scene title, pick your platform, and hit Generate.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">

        {/* ── Left: Input panel ──────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Idea input */}
          <div className="bg-white border-2 border-[#094067]/20 rounded-2xl p-5 focus-within:border-[#ffd803] transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-4 h-4 text-[#ef4565]" />
              <span className="text-[13px] font-semibold">Your idea or scene</span>
            </div>
            <textarea
              rows={3}
              value={idea}
              onChange={(e) => { setIdea(e.target.value); setHasGenerated(false); }}
              placeholder={`Try:\n"a samurai standing in rain at night"\n"write a product launch email for an AI tool"`}
              className="w-full resize-none text-[#094067] placeholder:text-[#5f6c7b]/50 text-[15px] outline-none leading-relaxed bg-transparent"
            />
            <div className="text-[11px] text-[#5f6c7b]/50 mt-1 text-right">{idea.length} chars</div>
          </div>

          {/* Family */}
          <div>
            <div className="text-[13px] text-[#5f6c7b] mb-2">What are you creating?</div>
            <div className="grid grid-cols-4 gap-2">
              {FAMILIES.map((f) => (
                <button
                  key={f.key}
                  onClick={() => { setFamily(f.key); setHasGenerated(false); }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    family === f.key
                      ? "bg-[#094067] border-[#094067]"
                      : "bg-white border-[#094067]/20 hover:border-[#094067]/40"
                  }`}
                >
                  <div className={`text-[13px] font-semibold ${family === f.key ? "text-white" : "text-[#094067]"}`}>{f.label}</div>
                  <div className={`text-[10px] mt-0.5 ${family === f.key ? "text-white/70" : "text-[#5f6c7b]"}`}>{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhancements */}
          <div className="bg-white border border-[#094067]/15 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowEnhance(!showEnhance)}
              className="w-full flex items-center justify-between px-5 py-3 text-[13px] font-semibold text-[#094067] hover:bg-[#094067]/3"
            >
              <span>
                Enhancements{" "}
                <span className="text-[#5f6c7b] font-normal">(optional)</span>
                {(style || mood) && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#ffd803] text-[10px] font-bold text-[#094067]">
                    {[style, mood].filter(Boolean).length} active
                  </span>
                )}
              </span>
              {showEnhance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showEnhance && (
              <div className="px-5 pb-5 space-y-4 border-t border-[#094067]/10 pt-4">
                <ChipGroup label="Style"       options={STYLES}  value={style}  onChange={(v) => { setStyle(v);  setHasGenerated(false); }} />
                <ChipGroup label="Mood"        options={MOODS}   value={mood}   onChange={(v) => { setMood(v);   setHasGenerated(false); }} />
                {(family === "image" || family === "video") && (
                  <ChipGroup label="Aspect Ratio" options={ASPECTS} value={aspect} onChange={(v) => { setAspect(v); setHasGenerated(false); }} />
                )}
              </div>
            )}
          </div>

          {/* Platform picker */}
          <div>
            <div className="text-[13px] text-[#5f6c7b] mb-2">Platform</div>
            <div className="flex flex-wrap gap-2">
              {platforms.map((pl) => (
                <button
                  key={pl.key}
                  onClick={() => { setPlatform(pl.key); setHasGenerated(false); }}
                  className={`px-3 py-1.5 rounded-full border text-[13px] transition-all ${
                    platform === pl.key
                      ? "bg-[#094067] text-white border-[#094067]"
                      : "border-[#094067]/20 text-[#5f6c7b] hover:text-[#094067] hover:border-[#094067]/40"
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: pl.color }} />
                  {pl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isLoading}
            className="w-full h-14 rounded-2xl bg-[#094067] text-white font-bold text-[16px] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#094067]/90 active:scale-[0.98] transition-all shadow-lg shadow-[#094067]/20"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Prompt
                <ArrowRight className="w-4 h-4 opacity-60" />
              </>
            )}
          </button>
        </div>

        {/* ── Right: Output panel ────────────────────────────────────────── */}
        <div className="bg-white border border-[#094067]/15 rounded-2xl p-6 flex flex-col gap-4">

          {/* View toggle */}
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-[#094067]">
              {hasGenerated ? "Generated prompt" : "Output"}
            </div>
            <button
              onClick={() => setShowAllPlatforms(!showAllPlatforms)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition-all ${
                showAllPlatforms
                  ? "bg-[#094067] text-white border-[#094067]"
                  : "border-[#094067]/20 text-[#5f6c7b] hover:border-[#094067]/40 hover:text-[#094067]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All platforms
            </button>
          </div>

          {/* Single platform output */}
          {!showAllPlatforms && (
            <div className={`relative rounded-xl border min-h-[220px] p-4 transition-all ${
              hasGenerated ? "bg-[#f8f9ff] border-[#094067]/20" : "bg-[#f5f5f5] border-[#094067]/10"
            }`}>
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-[#094067]/40 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-[13px] text-[#5f6c7b]">Building your prompt…</span>
                </div>
              ) : hasGenerated ? (
                <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[#094067]">{generated}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
                  <Wand2 className="w-8 h-8 text-[#094067]/20" />
                  <p className="text-[#5f6c7b] text-[13px]">
                    {canGenerate
                      ? "Hit Generate to build your prompt"
                      : "Type your idea to get started"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* All platforms output */}
          {showAllPlatforms && (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {allPlatformOutputs.map((pl) => (
                <div key={pl.key} className="rounded-xl border border-[#094067]/10 p-3 bg-[#f8f9ff]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: pl.color }} />
                    <span className="text-[12px] font-semibold text-[#094067]">{pl.name}</span>
                    <button
                      onClick={() => { navigator.clipboard?.writeText(pl.prompt); }}
                      className="ml-auto text-[11px] text-[#5f6c7b] hover:text-[#094067] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-[#5f6c7b] leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {canGenerate ? pl.prompt : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Active tags */}
          {hasGenerated && (style || mood || aspect) && !showAllPlatforms && (
            <div className="flex flex-wrap gap-1.5">
              {style  && <span className="px-2 py-0.5 rounded-full bg-[#094067]/8 text-[11px] text-[#094067]">{style}</span>}
              {mood   && <span className="px-2 py-0.5 rounded-full bg-[#ef4565]/10 text-[11px] text-[#ef4565]">{mood}</span>}
              {(family === "image" || family === "video") && aspect && (
                <span className="px-2 py-0.5 rounded-full bg-[#ffd803]/30 text-[11px] text-[#094067]">{aspect}</span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-[#bce4d8]/40 text-[11px] text-[#094067]">
                variation {(varIndex % 4) + 1}/4
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">

            {/* Regenerate */}
            <button
              onClick={handleRegenerate}
              disabled={!canGenerate || isLoading}
              className="h-11 rounded-xl border border-[#094067]/20 text-[#094067] text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#094067]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              disabled={!hasGenerated || isLoading}
              className="h-11 rounded-xl bg-[#ffd803] text-[#094067] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#ffd803]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>

            {/* Save */}
            <button
              onClick={() => {
                if (!authStore.getUser()) { toast.error("Sign in to save prompts"); return; }
                toast.success("Saved to library", { description: `${platform} · ${family}` });
              }}
              disabled={!hasGenerated || isLoading}
              className="h-11 rounded-xl border border-[#094067]/20 text-[#094067] text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#094067]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all col-span-2"
            >
              <Save className="w-4 h-4" />
              Save to Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
