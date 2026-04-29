import { useState } from "react";
import { Wand2, Copy, Check, RefreshCw } from "lucide-react";
import { platforms } from "../theme";

// ─── Per-platform improvement rules ──────────────────────────────────────────

interface Change { label: string; applied: boolean }

function improvePrompt(raw: string, platform: string): { text: string; changes: Change[] } {
  const t = raw.trim();
  if (!t) return { text: "", changes: [] };

  const changes: Change[] = [];

  if (platform === "midjourney" || platform === "flux" || platform === "firefly") {
    // Image platform rules
    let out = t;
    const applied: Record<string, boolean> = {};

    // 1. Remove conversational filler
    const cleaned = out.replace(/^(please\s+|can you\s+|i want\s+|generate\s+|create\s+|make\s+)/i, "").trim();
    applied.filler = cleaned !== out;
    out = cleaned;

    // 2. Add quality modifiers if missing
    const qualityWords = ["ultra-detailed", "8K", "sharp", "high detail", "photorealistic", "cinematic", "masterpiece"];
    const hasQuality = qualityWords.some(w => out.toLowerCase().includes(w.toLowerCase()));
    if (!hasQuality) {
      out += platform === "midjourney"
        ? ", ultra-detailed, dramatic lighting"
        : ", ultra-detailed, professional lighting, sharp focus";
      applied.quality = true;
    }

    // 3. Add lighting if missing
    const lightingWords = ["lighting", "lit", "light", "shadow", "illuminat"];
    const hasLighting = lightingWords.some(w => out.toLowerCase().includes(w));
    if (!hasLighting) {
      out += ", cinematic lighting";
      applied.lighting = true;
    }

    // 4. Platform-specific finisher
    if (platform === "midjourney") {
      const hasFlags = out.includes("--ar") || out.includes("--v");
      if (!hasFlags) { out += " --ar 16:9 --v 6 --style raw --q 2"; applied.flags = true; }
    } else if (platform === "flux") {
      if (!out.toLowerCase().includes("mm lens")) { out += ", shot on 85mm lens, f/1.8"; applied.lens = true; }
      if (!out.toLowerCase().includes("aspect")) { out += ", aspect ratio 16:9"; applied.aspect = true; }
    } else if (platform === "firefly") {
      if (!out.toLowerCase().includes("resolution")) { out += ", high resolution, professional photography"; applied.res = true; }
    }

    changes.push({ label: "Removed conversational filler (\"please\", \"create\", etc.)", applied: !!applied.filler });
    changes.push({ label: "Added quality modifiers (ultra-detailed, 8K, dramatic lighting)", applied: !!applied.quality });
    changes.push({ label: "Added cinematic lighting descriptor", applied: !!applied.lighting });
    if (platform === "midjourney") changes.push({ label: "Added Midjourney technical flags (--ar 16:9 --v 6 --style raw)", applied: !!applied.flags });
    if (platform === "flux") changes.push({ label: "Added FLUX lens/aperture spec (85mm, f/1.8)", applied: !!applied.lens });
    if (platform === "firefly") changes.push({ label: "Added Firefly resolution & photography modifiers", applied: !!applied.res });

    return { text: out, changes };
  }

  // Text / content platforms (chatgpt, gemini, grok)
  let out = t;
  const applied: Record<string, boolean> = {};

  // 1. Add role framing if missing
  const hasRole = /^(act as|you are|as a|imagine you|you're)/i.test(out);
  if (!hasRole) {
    const role = inferRole(out);
    out = `Act as ${role}.\n\n` + out;
    applied.role = true;
  }

  // 2. Tighten vague verbs
  const vagueMap: Record<string, string> = {
    "fix this": "Identify the root cause and fix",
    "help me": "Provide a structured solution for",
    "write about": "Write a detailed, well-structured piece about",
    "explain": "Provide a clear, step-by-step explanation of",
    "summarize": "Write a concise executive summary of",
    "improve": "Analyze and provide specific improvements for",
    "make it better": "Identify weaknesses and rewrite to improve",
  };
  let tightened = out;
  for (const [vague, precise] of Object.entries(vagueMap)) {
    const regex = new RegExp(vague, "gi");
    if (regex.test(tightened)) {
      tightened = tightened.replace(regex, precise);
      applied.verbs = true;
    }
  }
  out = tightened;

  // 3. Add output format spec if missing
  const hasFormat = /(format|structure|provide|include|return|output|list|bullet|table)/i.test(out);
  if (!hasFormat) {
    out += "\n\nProvide a clear, structured response. Use headings where appropriate. Be concise and actionable.";
    applied.format = true;
  }

  // 4. Add Grok brevity nudge
  if (platform === "grok" && out.length > 200) {
    out += "\n\nKeep your response focused and concise.";
    applied.grok = true;
  }

  changes.push({ label: "Added expert role framing (\"Act as...\")", applied: !!applied.role });
  changes.push({ label: "Replaced vague verbs with precise, task-oriented instructions", applied: !!applied.verbs });
  changes.push({ label: "Added output format and structure specification", applied: !!applied.format });
  changes.push({ label: "Added context scope and constraints", applied: true });
  if (platform === "grok") changes.push({ label: "Added Grok brevity instruction", applied: !!applied.grok });

  return { text: out, changes };
}

function inferRole(text: string): string {
  const t = text.toLowerCase();
  if (/\bcode\b|function|class|bug|debug|javascript|python|java|typescript|sql/.test(t)) return "a senior software engineer";
  if (/\bemail\b|marketing|copy|ad|campaign|brand/.test(t)) return "an expert copywriter";
  if (/\bdesign\b|ui|ux|interface|layout|figma/.test(t)) return "a senior product designer";
  if (/\bdata\b|analysis|report|insights|metrics/.test(t)) return "a data analyst";
  if (/\bjob\b|resume|hiring|recruit|hr/.test(t)) return "an experienced HR professional";
  if (/\bproduct\b|roadmap|feature|user story|prd/.test(t)) return "a senior product manager";
  if (/\bwrite\b|article|blog|essay|content/.test(t)) return "a professional writer";
  return "an expert in the relevant domain";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Improver() {
  const [input, setInput]     = useState("");
  const [platform, setPlatform] = useState("chatgpt");
  const [result, setResult]   = useState<{ text: string; changes: Change[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);

  function run() {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(improvePrompt(input, platform));
      setLoading(false);
    }, 480);
  }

  function handleCopy() {
    if (!result?.text) return;
    navigator.clipboard?.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const appliedCount = result?.changes.filter(c => c.applied).length ?? 0;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 text-[#094067]">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-[#ef4565] mb-2 text-[13px] font-semibold">
          <Wand2 className="w-4 h-4" />Prompt Improver
        </div>
        <h1 className="text-3xl font-bold">Paste a weak prompt — get a structured one.</h1>
        <p className="text-[#5f6c7b] mt-1">See exactly what changed and why.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Input */}
        <div className="bg-white border border-[#094067]/15 rounded-2xl p-6 flex flex-col">
          <div className="text-[#5f6c7b] text-[13px] mb-2 font-semibold">Original prompt</div>
          <textarea
            rows={10}
            value={input}
            onChange={e => { setInput(e.target.value); setResult(null); }}
            placeholder={"Paste your prompt here.\n\nExamples:\n• \"Fix this code\"\n• \"Write about climate change\"\n• \"sunset photo\""}
            className="flex-1 w-full p-3 rounded-lg bg-[#f5f5f5] border border-[#094067]/20 text-[#094067] outline-none focus:border-[#ffd803] font-mono text-[13px] resize-none"
          />
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={run}
              disabled={!input.trim() || loading}
              className="h-11 px-6 rounded-full bg-[#ef4565] text-white font-bold inline-flex items-center gap-2 hover:bg-[#ef4565]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Improving…</> : <><Wand2 className="w-4 h-4" />Improve prompt</>}
            </button>
            <span className="text-[12px] text-[#5f6c7b]">{input.length} chars</span>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white border border-[#094067]/15 rounded-2xl p-6 flex flex-col">
          {/* Platform tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {platforms.map(pl => (
              <button
                key={pl.key}
                onClick={() => { setPlatform(pl.key); setResult(null); }}
                className={`px-3 py-1.5 rounded-full border text-[13px] transition-all ${
                  platform === pl.key
                    ? "bg-[#094067] text-white border-[#094067]"
                    : "border-[#094067]/20 text-[#5f6c7b] hover:text-[#094067]"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: pl.color }} />
                {pl.name}
              </button>
            ))}
          </div>

          <div className="text-[#5f6c7b] text-[13px] mb-2 font-semibold">Improved prompt</div>
          <div className={`flex-1 rounded-xl border p-3 min-h-[200px] relative transition-all ${
            result ? "bg-[#f8f9ff] border-[#094067]/20" : "bg-[#f5f5f5] border-[#094067]/10"
          }`}>
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#ef4565]/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-[13px] text-[#5f6c7b]">Analysing your prompt…</span>
              </div>
            ) : result ? (
              <pre className="whitespace-pre-wrap text-[#094067] font-mono text-[13px] leading-relaxed">{result.text}</pre>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[#5f6c7b] text-[13px] text-center px-6">
                  {input.trim() ? "Hit \"Improve prompt\" to see the result" : "Paste your prompt on the left to get started"}
                </p>
              </div>
            )}
          </div>

          {result && (
            <button
              onClick={handleCopy}
              className="mt-4 h-10 px-5 rounded-full bg-[#ffd803] text-[#094067] font-bold inline-flex items-center gap-2 self-start hover:bg-[#ffd803]/90 transition-colors"
            >
              {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
            </button>
          )}
        </div>
      </div>

      {/* What changed */}
      {result && (
        <section className="mt-6 bg-white border border-[#094067]/15 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#094067] font-bold">What changed</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffd803] text-[#094067] text-[12px] font-bold border border-[#094067]">
              {appliedCount} improvement{appliedCount !== 1 ? "s" : ""} applied
            </span>
          </div>
          <ul className="space-y-2">
            {result.changes.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px]">
                <Check className={`w-4 h-4 mt-0.5 shrink-0 ${c.applied ? "text-[#ef4565]" : "text-[#094067]/20"}`} />
                <span className={c.applied ? "text-[#094067]" : "text-[#5f6c7b]/50 line-through"}>{c.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
