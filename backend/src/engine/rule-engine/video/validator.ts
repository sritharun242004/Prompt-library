// ─── Video Validator / Quality Scorer ──────────────────────────────────────────
// Scores prompts 0–100 based on completeness and section presence.
// No AI — deterministic rule-based scoring.

const SECTION_WEIGHTS: Record<string, number> = {
  SUBJECT:                        14,
  "SHOT TYPE":                     6,
  "ACTION & MICRO-ACTION":        10,
  ENVIRONMENT:                     8,
  "LIGHTING GEOMETRY":             6,
  "CAMERA MOVEMENT":              10,
  "TIME & WEATHER":                4,
  STYLE:                           4,
  "QUALITY TAG":                   3,
  AUDIO:                           3,
  "ASPECT RATIO":                  2,
  DURATION:                        2,
  "COLOR GRADE & RENDER ENGINE":   4,
  "MOOD & EMOTIONAL ATMOSPHERE":   3,
  "PHYSICS & MOTION DYNAMICS":     6,
  "VISUAL DETAIL":                 4,
  CINEMATOGRAPHY:                  3,
  REALISM:                         4,
  "SCENE CONSISTENCY":             5,
  "MOTION QUALITY":                5,
  "STORY TELLING":                 4,
}

function detectSection(prompt: string, section: string): boolean {
  const lower = prompt.toLowerCase()
  const sec = section.toLowerCase()
  return lower.includes(`${sec}:`) || lower.includes(`${sec} `) || lower.includes(`${sec}\n`)
}

export function scoreVideoPrompt(prompt: string): number {
  let total = 0
  let earned = 0
  for (const [section, weight] of Object.entries(SECTION_WEIGHTS)) {
    total += weight
    if (detectSection(prompt, section)) earned += weight
  }
  const wc = prompt.split(/\s+/).filter(Boolean).length
  if (wc > 60) earned += 3
  if (wc > 120) earned += 4
  const raw = Math.round((earned / (total + 7)) * 100)
  return Math.min(100, Math.max(0, raw))
}

export function getMissingVideoSections(prompt: string): string[] {
  return Object.keys(SECTION_WEIGHTS).filter((section) => !detectSection(prompt, section))
}
