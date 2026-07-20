// ─── Video Rule Engine Types ───────────────────────────────────────────────────
// Motion Formula v2.0 — zero-API deterministic video prompt construction across
// a fixed 15-section core structure (shot type through physics/motion dynamics)
// plus a 6-section Advanced Enhancement layer (visual detail through story
// telling) that's always assembled, never optional. Unlike the image engine
// (which locks static geometry/color), video prompting fails on TEMPORAL
// consistency: identity drift, unnatural motion, morphing, camera arcs that
// don't match the described action — the enhancement layer's Scene Consistency
// and Motion Quality sections exist specifically to pin that down.

export type VideoCategory = "narrative" | "product" | "nature" | "action" | "abstract"

export type VideoPlatformKey = "kling" | "sora" | "runway" | "pika" | "luma" | "veo" | "seedance" | "higgsfield"

export interface VideoBuildRequest {
  category: VideoCategory
  subject?: string
  action?: string
  setting?: string
  cameraMove?: string
  lighting?: string
  colorGrade?: string
  mood?: string
  // Optional overrides for the new v2.0 sections — every one of these falls
  // back to a category-tuned default (see CATEGORY_DEFAULTS) when omitted, so
  // no caller is required to supply them.
  shotType?: string
  timeOfDay?: string
  weather?: string
  style?: string
  extraNotes?: string
  platform: VideoPlatformKey
}

export interface VideoImproveRequest {
  promptText: string
  platform: VideoPlatformKey
  category?: VideoCategory
}

export interface ParsedVideoPrompt {
  detectedCategory: VideoCategory
  subject: string | null
  action: string | null
  setting: string | null
  cameraMove: string | null
  lighting: string | null
  colorGrade: string | null
  shotType: string | null
  timeOfDay: string | null
  weather: string | null
  style: string | null
  missingComponents: string[]
  originalWords: string[]
}

export interface VideoLockValues {
  motionSpeed: string
  motionDirection: string
  cameraMoveType: string
  cameraStart: string
  cameraEnd: string
  beginState: string
  endState: string
  identityAnchor: string
}

export interface VideoRuleEngineResult {
  prompt: string
  platform: VideoPlatformKey
  category: VideoCategory
  score: number
  components: {
    subject: boolean
    action: boolean
    setting: boolean
    cameraMove: boolean
    lighting: boolean
    colorGrade: boolean
    shotType: boolean
    style: boolean
    locks: boolean
  }
  locks: {
    continuity: string
    motion: string
    camera: string
    temporal: string
  }
  negatives: string[]
  wordCount: number
  engine: "rule-based"
}

export interface VideoCategoryTemplate {
  name: string
  sections: string[]
  defaultCameraMove: string
  defaultLighting: string
  defaultDuration: string
}
