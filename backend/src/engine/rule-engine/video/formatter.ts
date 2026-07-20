// ─── Video Platform Formatter ──────────────────────────────────────────────────
// Converts the structured Motion Formula v2.0 prompt (21 labeled sections: a
// 15-section core structure plus the 6-section Advanced Enhancement layer) to
// each target platform's native prompting style. No AI — pure string
// transformation, but each platform genuinely prompts differently: Kling wants
// explicit physics language, Sora wants narrative prose, Pika wants short
// punchy descriptions, Runway/Luma respond well to explicit labeled
// camera-move vocabulary, Veo accepts natural-language camera direction inline
// with the action. Every platform still needs to receive the full structure —
// just reshaped into its own voice, not truncated. Pika is the sole deliberate
// exception: it stays terse by design, surfacing only the top guardrails
// rather than the full 21-section set.

import type { VideoPlatformKey } from "./types.js"

function extractValue(text: string, label: string): string {
  const regex = new RegExp(`${label}:\\s*(.+?)(?=\\n[A-Z]|$)`, "si")
  const m = text.match(regex)
  return m?.[1]?.trim() ?? ""
}

// Some extracted fields already end in a period (lock sentences, the
// Time & Weather / Color Grade & Render Engine composites); others never do
// (plain dictionary lookups). Rather than track that per field at every call
// site, normalize to exactly one trailing period here.
function asSentence(text: string): string {
  if (!text) return ""
  return /[.!?]$/.test(text) ? text : `${text}.`
}

interface Fields {
  shotType: string; subject: string; actionMicro: string; environment: string;
  lightingGeometry: string; cameraMovement: string; timeWeather: string; style: string;
  qualityTag: string; audio: string; aspectRatio: string; duration: string;
  colorGradeRender: string; moodAtmosphere: string; physicsMotion: string;
  visualDetail: string; cinematography: string; realism: string[];
  sceneConsistency: string; motionQuality: string; storyTelling: string;
}

function extractFields(raw: string): Fields {
  return {
    shotType:         extractValue(raw, "SHOT TYPE"),
    subject:          extractValue(raw, "SUBJECT"),
    actionMicro:      extractValue(raw, "ACTION & MICRO-ACTION"),
    environment:      extractValue(raw, "ENVIRONMENT"),
    lightingGeometry: extractValue(raw, "LIGHTING GEOMETRY"),
    cameraMovement:   extractValue(raw, "CAMERA MOVEMENT"),
    timeWeather:      extractValue(raw, "TIME & WEATHER"),
    style:            extractValue(raw, "STYLE"),
    qualityTag:       extractValue(raw, "QUALITY TAG"),
    audio:            extractValue(raw, "AUDIO"),
    aspectRatio:      extractValue(raw, "ASPECT RATIO"),
    duration:         extractValue(raw, "DURATION"),
    colorGradeRender: extractValue(raw, "COLOR GRADE & RENDER ENGINE"),
    moodAtmosphere:   extractValue(raw, "MOOD & EMOTIONAL ATMOSPHERE"),
    physicsMotion:    extractValue(raw, "PHYSICS & MOTION DYNAMICS"),
    visualDetail:     extractValue(raw, "VISUAL DETAIL"),
    cinematography:   extractValue(raw, "CINEMATOGRAPHY"),
    realism:          extractValue(raw, "REALISM").split(" | ").filter(Boolean),
    sceneConsistency: extractValue(raw, "SCENE CONSISTENCY"),
    motionQuality:    extractValue(raw, "MOTION QUALITY"),
    storyTelling:     extractValue(raw, "STORY TELLING"),
  }
}

// ─── Kling — explicit physics language, flowing sentences ────────────────────

function formatKling(raw: string): string {
  const f = extractFields(raw)
  return [
    asSentence(f.subject),
    f.shotType ? asSentence(`Shot type: ${f.shotType}`) : "",
    asSentence(f.actionMicro),
    f.environment ? asSentence(`Set in ${f.environment}`) : "",
    f.timeWeather ? `Time and weather: ${f.timeWeather}` : "",
    f.cameraMovement ? asSentence(`Camera: ${f.cameraMovement}`) : "",
    asSentence(f.lightingGeometry),
    f.style ? asSentence(`Visual style: ${f.style}`) : "",
    f.colorGradeRender,
    f.moodAtmosphere ? asSentence(`Mood: ${f.moodAtmosphere}`) : "",
    f.storyTelling ? asSentence(`Story arc: ${f.storyTelling}`) : "",
    f.cinematography ? asSentence(f.cinematography) : "",
    f.physicsMotion,
    f.motionQuality,
    f.sceneConsistency,
    f.visualDetail ? asSentence(`Detail: ${f.visualDetail}`) : "",
    f.audio ? asSentence(`Audio: ${f.audio}`) : "",
    f.qualityTag ? asSentence(`Quality: ${f.qualityTag}`) : "",
    f.realism.length ? `Avoid: ${f.realism.join(", ")}.` : "",
    f.aspectRatio || f.duration ? `Format: ${[f.aspectRatio, f.duration].filter(Boolean).join(", ")}.` : "",
  ].filter(Boolean).join(" ")
}

// ─── Sora — cinematic narrative prose ─────────────────────────────────────────

function formatSora(raw: string): string {
  const f = extractFields(raw)
  return [
    `A cinematic shot of ${f.subject}, set in ${f.environment || "a richly detailed environment"}.`,
    f.shotType ? asSentence(`Shot type: ${f.shotType}`) : "",
    asSentence(f.actionMicro),
    f.timeWeather,
    f.cameraMovement ? asSentence(`Camera: ${f.cameraMovement}`) : "",
    f.lightingGeometry ? asSentence(`Lit with ${f.lightingGeometry}`) : "",
    f.style ? asSentence(`Visual style: ${f.style}`) : "",
    f.colorGradeRender,
    f.moodAtmosphere ? asSentence(`The overall mood is ${f.moodAtmosphere}`) : "",
    asSentence(f.storyTelling),
    f.cinematography ? asSentence(f.cinematography) : "",
    f.physicsMotion,
    f.motionQuality,
    f.sceneConsistency,
    asSentence(f.visualDetail),
    f.audio ? asSentence(`Sound: ${f.audio}`) : "",
    f.realism.length ? `Avoid: ${f.realism.join(", ")}.` : "",
  ].filter(Boolean).join(" ")
}

// ─── Runway — labeled camera-vocabulary spec sheet ────────────────────────────

function formatRunway(raw: string): string {
  const f = extractFields(raw)
  return [
    asSentence(f.subject),
    f.actionMicro,
    `Shot type: ${f.shotType}.`,
    f.environment ? asSentence(`Setting: ${f.environment}`) : "",
    f.timeWeather ? `Time & weather: ${f.timeWeather}` : "",
    `Camera movement: ${f.cameraMovement}.`,
    f.lightingGeometry ? asSentence(`Lighting: ${f.lightingGeometry}`) : "",
    f.colorGradeRender,
    f.style ? asSentence(`Style: ${f.style}`) : "",
    f.moodAtmosphere ? asSentence(`Mood: ${f.moodAtmosphere}`) : "",
    f.storyTelling ? asSentence(`Story arc: ${f.storyTelling}`) : "",
    f.cinematography,
    "",
    f.physicsMotion,
    f.motionQuality,
    f.sceneConsistency,
    f.visualDetail ? `Visual detail: ${f.visualDetail}` : "",
    f.audio ? `Audio: ${f.audio}` : "",
    f.qualityTag ? `Quality: ${f.qualityTag}` : "",
    f.realism.length ? `Avoid: ${f.realism.join(", ")}.` : "",
    (f.aspectRatio || f.duration) ? `Format: ${[f.aspectRatio, f.duration].filter(Boolean).join(", ")}` : "",
  ].filter((l) => l !== undefined).join("\n")
}

// ─── Pika — short, punchy, comma-separated ────────────────────────────────────
// Deliberately terse by design — surfaces only the top guardrails rather than
// the full 21-section structure, since Pika rewards short prompts over prose.

function formatPika(raw: string): string {
  const f = extractFields(raw)
  const topGuardrails = f.realism.slice(0, 2).join(", ")
  return [
    f.shotType,
    f.subject,
    f.actionMicro.split(" — ")[0], // action only, drop the micro-action clause for brevity
    f.cameraMovement ? `-camera ${f.cameraMovement}` : "",
    f.style,
    topGuardrails,
  ].filter(Boolean).join(", ")
}

// ─── Luma — clean labeled lines ───────────────────────────────────────────────

function formatLuma(raw: string): string {
  const f = extractFields(raw)
  return [
    `Shot type: ${f.shotType}`,
    `Subject: ${f.subject}`,
    f.actionMicro ? `Action: ${f.actionMicro}` : "",
    f.environment ? `Environment: ${f.environment}` : "",
    f.timeWeather ? `Time & weather: ${f.timeWeather}` : "",
    `Camera: ${f.cameraMovement}`,
    f.lightingGeometry ? `Lighting: ${f.lightingGeometry}` : "",
    f.style ? `Style: ${f.style}` : "",
    f.colorGradeRender ? `Color & render: ${f.colorGradeRender}` : "",
    f.moodAtmosphere ? `Mood: ${f.moodAtmosphere}` : "",
    f.storyTelling ? `Story arc: ${f.storyTelling}` : "",
    f.cinematography ? `Cinematography: ${f.cinematography}` : "",
    f.visualDetail ? `Visual detail: ${f.visualDetail}` : "",
    f.audio ? `Audio: ${f.audio}` : "",
    (f.aspectRatio || f.duration) ? `Format: ${[f.aspectRatio, f.duration].filter(Boolean).join(", ")}` : "",
    `Consistency: ${[f.physicsMotion, f.motionQuality, f.sceneConsistency].filter(Boolean).join(" ")}`,
    f.realism.length ? `Avoid: ${f.realism.join(", ")}` : "",
  ].filter(Boolean).join("\n")
}

// ─── Veo — natural language, camera direction inline with the action ─────────

function formatVeo(raw: string): string {
  const f = extractFields(raw)
  return [
    asSentence(`${f.subject}${f.actionMicro ? `, ${f.actionMicro.replace(/[.!?]$/, "")}` : ""}`),
    f.shotType ? asSentence(`Shot type: ${f.shotType}`) : "",
    f.environment
      ? asSentence(`The scene takes place in ${f.environment}${f.timeWeather ? `, ${f.timeWeather.replace(/[.!?]$/, "")}` : ""}`)
      : "",
    f.cameraMovement ? asSentence(`Camera: ${f.cameraMovement}`) : "",
    f.lightingGeometry ? asSentence(`Lighting is ${f.lightingGeometry}`) : "",
    f.style ? asSentence(`Visual style: ${f.style}`) : "",
    f.colorGradeRender,
    f.moodAtmosphere ? asSentence(`The mood is ${f.moodAtmosphere}`) : "",
    asSentence(f.storyTelling),
    f.cinematography ? asSentence(f.cinematography) : "",
    f.physicsMotion,
    [f.motionQuality, f.sceneConsistency].filter(Boolean).join(" "),
    f.audio ? asSentence(`Audio: ${f.audio}`) : "",
    f.realism.length ? `Avoid ${f.realism.map((n) => n.replace(/^No\s+/i, "")).join(", ")}.` : "",
  ].filter(Boolean).join(" ")
}

export function formatForVideoPlatform(raw: string, platform: VideoPlatformKey): string {
  switch (platform) {
    case "kling":  return formatKling(raw)
    case "sora":   return formatSora(raw)
    case "runway": return formatRunway(raw)
    case "pika":   return formatPika(raw)
    case "luma":   return formatLuma(raw)
    case "veo":    return formatVeo(raw)
    default:       return raw
  }
}
