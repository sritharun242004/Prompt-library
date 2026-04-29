import { useState } from "react";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { categories, platforms } from "../theme";
import { submissionsApi, authStore } from "../../lib/api";

const steps = ["Category", "Platform", "Prompt", "Variables", "Example", "Review"];

export function Submit() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({ category: "", platform: "chatgpt", prompt: "", vars: "", example: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const all = [...categories.image, ...categories.text, ...(categories as any).website];
  const update = (k: string, v: any) => setData({ ...data, [k]: v });

  function canAdvance(): string | null {
    if (step === 0 && !data.category) return "Please select a category to continue.";
    if (step === 2 && !data.prompt.trim()) return "Please enter your prompt text to continue.";
    return null;
  }

  async function handleSubmit() {
    if (!authStore.getUser()) {
      toast.error("Sign in required", { description: "Please log in to submit a prompt." });
      return;
    }
    setSubmitting(true);
    try {
      const vars = data.vars
        ? data.vars.split(",").map((v: string) => ({ name: v.trim(), placeholder: v.trim() }))
        : [];
      await submissionsApi.submit({
        title: data.category + " Prompt",
        family: "text",
        basePrompt: data.prompt,
        platformIds: [data.platform],
        variables: vars,
        exampleOutput: data.example || undefined,
      });
      setSubmitted(true);
      toast.success("Submitted for review!", { description: "Our editors will review your prompt shortly." });
    } catch (err: any) {
      toast.error("Submission failed", { description: err.message ?? "Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10 text-[#094067]">
      <h1 className="text-3xl mb-2">Submit a prompt</h1>
      <p className="text-[#5f6c7b] mb-6">A guided 6-step wizard. Our editors review before publishing.</p>

      {submitted && (
        <div className="mb-6 flex items-center gap-3 bg-[#bce4d8]/30 border border-[#bce4d8] rounded-2xl p-5">
          <div className="w-9 h-9 rounded-full bg-[#ffd803] border-2 border-[#094067] flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-[#094067]" />
          </div>
          <div>
            <div className="font-bold text-[#094067]">Submitted successfully!</div>
            <div className="text-[#5f6c7b] text-[13px]">Our editors will review your prompt. You'll be notified on approval.</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] ${
              i < step ? "bg-[#ffd803] text-[#094067]" :
              i === step ? "bg-[#094067]/10 text-[#094067] border border-[#ffd803]" :
              "bg-[#094067]/5 text-[#5f6c7b]"
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <div className={`${i===step?"text-[#094067]":"text-[#5f6c7b]"} hidden sm:block text-[13px]`}>{s}</div>
            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-[#5f6c7b]" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#094067]/15 rounded-2xl p-6 min-h-[320px]">
        {step === 0 && (
          <div>
            <div className="text-[#094067] mb-3" style={{ fontWeight: 600 }}>Pick a category</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {all.map(c => (
                <button
                  key={c.name}
                  onClick={() => update("category", c.name)}
                  className={`p-3 rounded-xl border text-left text-[13px] ${data.category===c.name?"bg-[#ffd803]/10 border-[#ffd803] text-[#094067]":"border-[#094067]/20 text-[#5f6c7b] hover:text-[#094067]"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-[#094067] mb-3" style={{ fontWeight: 600 }}>Pick a primary platform</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platforms.map(p => (
                <button
                  key={p.key}
                  onClick={() => update("platform", p.key)}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-[13px] ${data.platform===p.key?"bg-[#094067]/10 border-[#094067]/40 text-[#094067]":"border-[#094067]/20 text-[#5f6c7b] hover:text-[#094067]"}`}
                >
                  <span className="w-3 h-3 rounded-full" style={{background:p.color}} />{p.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-[#094067] mb-3" style={{ fontWeight: 600 }}>Prompt text</div>
            <textarea
              rows={8}
              value={data.prompt}
              onChange={e => update("prompt", e.target.value)}
              placeholder="Paste your prompt. Use [bracketed] placeholders for variables."
              className="w-full p-3 rounded-lg bg-[#f5f5f5] border border-[#094067]/20 text-[#094067] font-mono text-[13px] outline-none focus:border-[#ffd803]"
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-[#094067] mb-3" style={{ fontWeight: 600 }}>Variables</div>
            <input
              value={data.vars}
              onChange={e => update("vars", e.target.value)}
              placeholder="Comma-separated: subject, mood, style"
              className="w-full h-10 px-3 rounded-lg bg-[#094067]/5 border border-[#094067]/20 text-[#094067] placeholder:text-[#5f6c7b] outline-none focus:border-[#ffd803]"
            />
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-[#094067] mb-3" style={{ fontWeight: 600 }}>Example output (optional)</div>
            <input
              value={data.example}
              onChange={e => update("example", e.target.value)}
              placeholder="Image URL or short text sample"
              className="w-full h-10 px-3 rounded-lg bg-[#094067]/5 border border-[#094067]/20 text-[#094067] placeholder:text-[#5f6c7b] outline-none focus:border-[#ffd803]"
            />
          </div>
        )}
        {step === 5 && (
          <div className="space-y-3">
            <div className="text-[#094067]" style={{ fontWeight: 700 }}>Review & submit</div>
            <div><span className="text-[#5f6c7b]">Category:</span> <span className="text-[#094067]">{data.category || "—"}</span></div>
            <div><span className="text-[#5f6c7b]">Platform:</span> <span className="text-[#094067]">{data.platform}</span></div>
            <div><span className="text-[#5f6c7b]">Variables:</span> <span className="text-[#094067]">{data.vars || "—"}</span></div>
            <div className="bg-[#f5f5f5] border border-[#094067]/20 rounded-lg p-3 font-mono text-[13px] text-[#094067] whitespace-pre-wrap">{data.prompt || "—"}</div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          disabled={step === 0}
          onClick={() => setStep(s => s - 1)}
          className="h-10 px-5 rounded-full bg-[#094067]/5 border border-[#094067]/20 text-[#094067] disabled:opacity-40"
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={() => {
              const err = canAdvance();
              if (err) { toast.error(err); return; }
              setStep(s => s + 1);
            }}
            className="h-10 px-5 rounded-full bg-[#ffd803] text-[#094067]"
            style={{ fontWeight: 700 }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || submitted || !data.prompt.trim()}
            className="h-10 px-5 rounded-full bg-[#ef4565] text-[#bce4d8] inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: 700 }}
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</> : "Submit for review"}
          </button>
        )}
      </div>
    </div>
  );
}