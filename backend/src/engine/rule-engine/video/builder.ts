// ─── Rule-Based Video Builder ───────────────────────────────────────────────────
// Assembles a complete structured video prompt from user selections.
// Zero API calls — Motion Formula v2.0 assembly only: a fixed 15-section core
// structure (shot type through physics/motion dynamics) followed by the
// 6-section Advanced Enhancement layer (visual detail through story telling),
// always assembled in full — never an optional/premium tier.

import type { VideoBuildRequest, VideoRuleEngineResult } from "./types.js"
import { NEGATIVE_LOCKS, CATEGORY_DEFAULTS, CINEMATOGRAPHY_MOOD_DEFAULT } from "./dictionaries.js"
import {
  expandCameraMove, expandLighting, expandAction, expandSetting, expandColorGrade,
  expandSubject, getCameraNumericSpec, expandShotType, expandTimeOfDay, expandWeather, expandStyle,
} from "./context-expander.js"
import { generateVideoLocks } from "./lock-generator.js"
import {
  buildShotTypeSection, buildSubjectSection, buildActionSection, buildEnvironmentSection,
  buildLightingGeometrySection, buildCameraMovementSection, buildTimeWeatherSection, buildStyleSection,
  buildQualityTagSection, buildAudioSection, buildAspectRatioSection, buildDurationSection,
  buildColorGradeRenderSection, buildMoodAtmosphereSection, buildPhysicsMotionSection,
  buildVisualDetailSection, buildCinematographySection, buildRealismSection,
  buildSceneConsistencySection, buildMotionQualitySection, buildStoryTellingSection,
} from "./templates/narrative.js"
import { buildProductRotation } from "./templates/product.js"
import { buildNatureAtmosphere } from "./templates/nature.js"
import { buildActionIntensity } from "./templates/action.js"
import { buildAbstractTransform } from "./templates/abstract.js"
import { formatForVideoPlatform } from "./formatter.js"
import { scoreVideoPrompt } from "./validator.js"

export function buildVideoFromRules(req: VideoBuildRequest): VideoRuleEngineResult {
  const cat = req.category ?? "narrative"
  const defaults = CATEGORY_DEFAULTS[cat] ?? CATEGORY_DEFAULTS.narrative

  const subjectRaw    = req.subject ?? "the subject"
  const subjectExp    = expandSubject(subjectRaw) ?? subjectRaw
  // Short anchor form (first clause) for repeated use inside LOCKS text —
  // keeps lock sentences readable even when the SUBJECT dictionary expands
  // subjectRaw into a full descriptive clause.
  const subjectAnchor = subjectExp.split(",")[0].trim() || subjectExp
  const actionExp     = expandAction(req.action ?? null)          ?? req.action ?? "moving naturally within the frame"
  const settingExp    = expandSetting(req.setting ?? null)        ?? req.setting ?? "a clearly defined environment"
  const resolvedCameraMove = req.cameraMove ?? defaults.cameraMove
  const cameraSpec    = getCameraNumericSpec(resolvedCameraMove, req.platform)
  const cameraExpBase = expandCameraMove(resolvedCameraMove) ?? defaults.cameraMove
  const cameraExp     = cameraSpec ? `${cameraExpBase}, ${cameraSpec}` : cameraExpBase
  const lightingExp   = expandLighting(req.lighting ?? null)      ?? expandLighting(defaults.lighting) ?? defaults.lighting
  const gradeExp      = expandColorGrade(req.colorGrade ?? null)  ?? expandColorGrade("natural neutral") ?? "natural neutral grade"
  const shotTypeExp   = expandShotType(req.shotType ?? null)      ?? expandShotType(defaults.shotType)   ?? defaults.shotType
  const timeOfDayExp  = expandTimeOfDay(req.timeOfDay ?? null)    ?? expandTimeOfDay(defaults.timeOfDay) ?? defaults.timeOfDay
  const weatherExp    = expandWeather(req.weather ?? null)        ?? expandWeather(defaults.weather)     ?? defaults.weather
  const styleExp      = expandStyle(req.style ?? null)            ?? expandStyle(defaults.style)         ?? defaults.style

  // ── Core structure (sections 1-15) ──────────────────────────────────────────
  const sections: string[] = [
    buildShotTypeSection(shotTypeExp),
    buildSubjectSection(subjectExp),
  ]

  if (cat === "narrative" || cat === "action") sections.push(buildActionSection(actionExp, cat))
  if (cat === "product")  sections.push(buildProductRotation())
  if (cat === "nature")   sections.push(buildNatureAtmosphere())
  if (cat === "action")   sections.push(buildActionIntensity())
  if (cat === "abstract") sections.push(buildAbstractTransform())

  sections.push(buildEnvironmentSection(settingExp))
  sections.push(buildLightingGeometrySection(lightingExp))
  sections.push(buildCameraMovementSection(cameraExp))
  sections.push(buildTimeWeatherSection(timeOfDayExp, weatherExp))
  sections.push(buildStyleSection(styleExp))
  sections.push(buildQualityTagSection(cat))
  sections.push(buildAudioSection(cat))
  sections.push(buildAspectRatioSection(cat))
  sections.push(buildDurationSection(cat))
  sections.push(buildColorGradeRenderSection(gradeExp, cat))
  sections.push(buildMoodAtmosphereSection(cat))

  const negatives = NEGATIVE_LOCKS[cat] ?? NEGATIVE_LOCKS.narrative
  const locks = generateVideoLocks(cat, subjectAnchor, {
    action: req.action ?? null,
    setting: req.setting ?? null,
    cameraMove: req.cameraMove ?? null,
  })

  sections.push(buildPhysicsMotionSection(locks.motion))

  // ── Advanced Enhancement layer (sections 16-21, always assembled) ──────────
  sections.push(buildVisualDetailSection(cat))
  sections.push(buildCinematographySection(req.mood ?? CINEMATOGRAPHY_MOOD_DEFAULT[cat]))
  sections.push(buildRealismSection(negatives))
  sections.push(buildSceneConsistencySection(locks.continuity))
  sections.push(buildMotionQualitySection(locks.camera, locks.temporal))
  sections.push(buildStoryTellingSection(cat))

  if (req.extraNotes?.trim()) sections.push(`NOTES: ${req.extraNotes.trim()}`)

  const rawPrompt = sections.join("\n\n")
  const formatted = formatForVideoPlatform(rawPrompt, req.platform)
  // Score the structured (pre-format) text — platform formatters rewrite
  // labeled sections into each platform's own native style, which would make
  // section-presence scoring blind to content that's genuinely there, just
  // no longer under an explicit "LABEL:" prefix.
  const score = scoreVideoPrompt(rawPrompt)

  return {
    prompt: formatted,
    platform: req.platform,
    category: cat,
    score,
    components: {
      subject: !!req.subject, action: !!req.action, setting: !!req.setting,
      cameraMove: !!req.cameraMove, lighting: !!req.lighting, colorGrade: !!req.colorGrade,
      shotType: !!req.shotType, style: !!req.style,
      locks: true,
    },
    locks,
    negatives,
    wordCount: formatted.split(/\s+/).filter(Boolean).length,
    engine: "rule-based",
  }
}
