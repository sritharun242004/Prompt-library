// ─── Motion Formula v2.0 — Dictionaries ────────────────────────────────────────
// Term → rich cinematographic description. No API calls — pure lookup.

import type { VideoCategory } from "./types.js"

export const CAMERA_MOVE: Record<string, string> = {
  "dolly in":       "slow dolly-in on a smooth track, steady constant speed, tightening from establishing to medium framing over the full clip",
  "dolly out":      "slow dolly-out on a smooth track, steady constant speed, opening from medium to wide framing to reveal environment",
  "truck left":     "camera trucks laterally left at a constant walking pace, subject held in consistent frame position, parallax reveal of background",
  "truck right":    "camera trucks laterally right at a constant walking pace, subject held in consistent frame position, parallax reveal of background",
  "pan":            "static tripod position, smooth horizontal pan following the subject's movement, consistent angular velocity, no jitter",
  "tilt up":        "static tripod position, smooth tilt upward revealing scale and vertical context, slow constant angular speed",
  "tilt down":      "static tripod position, smooth tilt downward from wide establishing to grounded detail, slow constant angular speed",
  "crane up":       "crane/jib rising vertically while camera holds subject in frame, elevation reveal of full environment, smooth constant lift",
  "crane down":     "crane/jib descending from an elevated establishing view down to eye-level with the subject, smooth constant descent",
  "arc":            "camera arcs in a continuous curved path around the subject at a fixed radius, subject remains centered throughout the arc",
  "orbit":          "full 360-degree orbit around the subject at a fixed radius and height, constant angular speed, subject stays centered",
  "static":         "locked-off static camera, zero movement, all motion comes from the subject and environment within the frame",
  "handheld":       "handheld camera with natural micro-movement and subtle breathing motion, following the subject organically without stabilization",
  "steadicam":      "steadicam follow, smooth floating stabilized movement tracking the subject at a consistent following distance",
  "push in":        "gradual push-in toward the subject's face or focal point, accelerating slightly as it approaches, ending on a tight frame",
  "pull out":       "gradual pull-out from a tight frame revealing the wider scene, decelerating as it reaches the final wide composition",
  "whip pan":       "fast whip pan transition, motion-blurred mid-movement, snapping to the new subject or framing at the end",
}

export const LIGHTING_ATMOSPHERE: Record<string, string> = {
  "golden hour":    "warm golden-hour sunlight, low 15-20 degree sun angle, long soft shadows, warm amber-orange cast across the whole scene",
  "blue hour":      "cool blue-hour ambient twilight, even directionless skylight, muted low-contrast tones, soft shadowless illumination",
  "overcast":       "flat overcast daylight, soft even diffusion from full cloud cover, low contrast, no hard shadows anywhere in frame",
  "harsh midday":   "harsh direct midday sun, high overhead angle, hard-edged short shadows, strong contrast between lit and shaded surfaces",
  "neon night":     "urban neon night ambiance, mixed magenta/cyan/amber practical light sources, wet-reflective surfaces, deep shadow pockets",
  "practical interior": "warm practical interior lighting from visible lamps and fixtures, soft pools of light with natural falloff into shadow",
  "moonlight":      "cool low-intensity moonlight, blue-toned ambient fill, deep shadows, minimal practical light sources",
  "storm light":    "dramatic storm-lit sky, diffused grey overcast with occasional lightning highlight, desaturated cool tones, moody atmosphere",
  "firelight":      "warm flickering firelight as the primary source, orange-red cast with soft movement in the shadows, close-range falloff",
  "studio soft":    "even soft studio-style illumination, neutral color temperature, minimal shadow, controlled and consistent across the clip",
}

export const SUBJECT: Record<string, string> = {
  "man":              "an adult man, average athletic build, naturalistic upright posture, moves with a steady deliberate gait and confident weight transfer between steps",
  "woman":            "an adult woman, naturalistic upright posture, moves with a steady deliberate gait and confident weight transfer between steps",
  "child":            "a young child, light quick-footed movement, unselfconscious natural body language, shorter stride length and higher energy motion than an adult",
  "elderly person":   "an elderly person, careful measured gait, deliberate weight-supported movement, natural age-appropriate posture and reduced pace",
  "crowd":            "a crowd of people, natural asynchronous individual movement within the group, believable density and flow between bodies, no repeating or cloned figures",
  "athlete":          "a professional athlete mid-performance, explosive controlled movement, visible muscular effort, correct sport-specific biomechanics and follow-through",
  "dog":              "a dog, natural quadrupedal gait, tail and ear movement responsive to the environment, believable weight shift through the shoulders and hips",
  "cat":              "a cat, fluid low-slung quadrupedal movement, natural feline caution punctuated by sudden bursts of speed, tail used as a counterbalance",
  "bird":             "a bird, natural wingbeat rhythm in flight or subtle perch-balance micro-movements when still, believable aerodynamic banking through turns",
  "horse":            "a horse, natural equine gait — walk, trot, canter or gallop — with correctly sequenced leg movement and responsive mane/tail motion",
  "car":              "a car, consistent suspension travel and body roll through corners, wheels rotating at a speed matched to the vehicle's actual ground speed",
  "motorcycle":       "a motorcycle with rider, natural lean angle through turns, consistent wheel rotation speed, rider body-English matching the bike's motion",
  "drone":            "a small consumer drone, stable hover with subtle prop-wash micro-vibration, smooth directional thrust transitions with no sudden snaps",
  "robot":            "a robot or android figure, mechanically precise joint articulation, consistent servo-driven motion speed, no organic overshoot or human-like hesitation",
  "object":           "an inanimate object, no self-generated motion — all movement in frame comes from the camera path or an external rotation/reveal mechanism",
}

export const ACTION: Record<string, string> = {
  "walking":        "walking at a natural human pace, steady rhythmic gait, weight shifting naturally between steps",
  "running":        "running at a dynamic athletic pace, visible effort and momentum, natural arm-leg counter-movement",
  "turning to camera": "turning smoothly to face the camera, natural head-then-body rotation, settling into a steady final pose",
  "reaching":       "reaching toward an object with a natural arm extension, fingers opening just before contact, smooth deceleration on contact",
  "sitting down":   "lowering into a seated position with natural knee bend and weight transfer, settling smoothly without abrupt stops",
  "standing up":    "rising from seated to standing with natural weight shift, smooth continuous motion without hesitation",
  "driving":        "driving at a steady controlled speed, subtle vehicle body roll, road and environment passing at consistent relative speed",
  "flying":         "smooth continuous flight path, consistent altitude and speed, natural banking on any directional change",
  "falling":        "natural accelerating fall under gravity, believable tumble physics, no floating or unnatural deceleration",
  "rotating":       "smooth constant-speed rotation on a fixed axis, no wobble, consistent surface detail visible through the turn",
  "growing":        "gradual continuous growth or bloom, natural organic expansion, no sudden jumps in scale or form",
  "floating":       "gentle floating drift, subtle vertical bob, weightless and slow with no gravity-driven acceleration",
}

export const ENVIRONMENT: Record<string, string> = {
  "urban street":   "city street environment, passing pedestrians and traffic at natural speed, contemporary architecture, ambient city sound implied",
  "forest":         "dense forest environment, dappled light through canopy, natural ambient rustle of leaves, earthy grounded palette",
  "ocean":          "open ocean environment, natural wave rhythm, horizon line steady, reflective water surface responding to light",
  "desert":         "arid desert landscape, heat-shimmer at the horizon, sparse vegetation, vast negative space and open sky",
  "interior office": "modern interior office space, practical ceiling and desk lighting, glass partitions, controlled indoor ambience",
  "mountain":       "mountain landscape, layered atmospheric haze on distant peaks, natural wind-driven motion in foreground foliage",
  "space":          "zero-gravity space environment, stars and celestial bodies as static backdrop, weightless drifting motion",
  "underwater":     "underwater environment, light rays filtering from the surface, natural buoyant drift, particulate suspended in water",
}

export const COLOR_GRADE: Record<string, string> = {
  "teal orange":    "teal-and-orange cinematic grade, cool shadows pushed toward teal, warm skin tones and highlights pushed toward orange",
  "kodak print":    "warm film-emulation grade reminiscent of Kodak print stock, gentle highlight rolloff, rich but natural saturation",
  "bleach bypass":  "bleach-bypass grade, desaturated with retained silver contrast, gritty high-contrast look",
  "cool blue":      "cool blue-toned grade, lifted shadows with a blue cast, desaturated warm tones",
  "warm sepia":     "warm sepia-leaning grade, reduced blue channel, nostalgic amber-brown overall cast",
  "high contrast noir": "high-contrast black-and-white or near-monochrome grade, deep crushed blacks, punchy specular highlights",
  "pastel dreamlike": "soft pastel grade, lifted blacks, low contrast, gentle desaturated color palette with a dreamlike quality",
  "natural neutral": "natural neutral grade, accurate color reproduction, balanced contrast, minimal stylization",
}

// ─── Numeric camera specs ─────────────────────────────────────────────────────
// Adds real numeric precision (focal length, degrees of movement, travel
// distance) to the qualitative CAMERA_MOVE descriptions above, mirroring the
// image engine's lens/aperture/ISO precision in its CAMERA dictionary.

export interface CameraMoveNumeric {
  focalLength: string
  degrees?: number
  travel?: string
}

export const CAMERA_MOVE_NUMERICS: Record<string, CameraMoveNumeric> = {
  "dolly in":    { focalLength: "35mm-equivalent tightening to 50mm-equivalent field of view", travel: "1.5-2m dolly travel" },
  "dolly out":   { focalLength: "50mm-equivalent opening to 24mm-equivalent field of view", travel: "1.5-2m dolly travel" },
  "truck left":  { focalLength: "35mm-equivalent", travel: "2-3m lateral travel" },
  "truck right": { focalLength: "35mm-equivalent", travel: "2-3m lateral travel" },
  "pan":         { focalLength: "35mm-equivalent", degrees: 45 },
  "tilt up":     { focalLength: "24mm-equivalent", degrees: 30 },
  "tilt down":   { focalLength: "24mm-equivalent", degrees: 30 },
  "crane up":    { focalLength: "24mm-equivalent", travel: "2-4m vertical rise" },
  "crane down":  { focalLength: "24mm-equivalent", travel: "2-4m vertical descent" },
  "arc":         { focalLength: "50mm-equivalent", degrees: 90 },
  "orbit":       { focalLength: "50mm-equivalent", degrees: 360 },
  "static":      { focalLength: "35mm-equivalent" },
  "handheld":    { focalLength: "28mm-equivalent" },
  "steadicam":   { focalLength: "35mm-equivalent" },
  "push in":     { focalLength: "50mm-equivalent tightening to 85mm-equivalent field of view", travel: "1-1.5m push" },
  "pull out":    { focalLength: "85mm-equivalent opening to 50mm-equivalent field of view", travel: "1-1.5m pull" },
  "whip pan":    { focalLength: "35mm-equivalent", degrees: 120 },
}

// Typical native output frame rate per platform — used to give the CAMERA
// lock real per-platform numeric grounding instead of a generic "smooth".
export const PLATFORM_FPS: Record<string, number> = {
  kling:  30,
  sora:   24,
  runway: 24,
  pika:   24,
  luma:   24,
  veo:    24,
}

// ─── Category defaults ────────────────────────────────────────────────────────

export const CATEGORY_DEFAULTS: Record<string, {
  motionSpeed: string; motionDirection: string; duration: string;
  cameraMove: string; lighting: string;
  shotType: string; timeOfDay: string; weather: string; style: string;
}> = {
  narrative: { motionSpeed: "natural human pace", motionDirection: "left to right",  duration: "5-10s", cameraMove: "steadicam", lighting: "practical interior",
    shotType: "medium shot", timeOfDay: "dusk", weather: "clear", style: "photorealistic cinematic" },
  product:   { motionSpeed: "slow and deliberate",  motionDirection: "clockwise",     duration: "4-6s",  cameraMove: "orbit",     lighting: "studio soft",
    shotType: "close-up", timeOfDay: "n/a", weather: "n/a", style: "hyperrealistic commercial" },
  nature:    { motionSpeed: "slow ambient drift",   motionDirection: "steady",        duration: "6-12s", cameraMove: "pan",       lighting: "golden hour",
    shotType: "establishing shot", timeOfDay: "golden hour", weather: "clear", style: "photorealistic documentary" },
  action:    { motionSpeed: "fast dynamic",         motionDirection: "forward",       duration: "3-6s",  cameraMove: "handheld",  lighting: "harsh midday",
    shotType: "wide shot", timeOfDay: "midday", weather: "clear", style: "photorealistic gritty" },
  abstract:  { motionSpeed: "fluid continuous",     motionDirection: "expanding",     duration: "4-8s",  cameraMove: "static",    lighting: "studio soft",
    shotType: "macro", timeOfDay: "n/a", weather: "n/a", style: "stylized generative" },
}

// ─── Motion Formula v2.0 — new section dictionaries ──────────────────────────
// SHOT TYPE (section 1) — framing/scale, independent of camera movement (which
// describes how the camera travels, not how tightly it's framed).

export const SHOT_TYPE: Record<string, string> = {
  "close-up":          "intimate close-up framing, subject fills most of the frame, fine surface/facial detail clearly resolved",
  "extreme close-up":  "extreme close-up framing isolating a single feature or detail, texture and surface micro-detail dominate the frame",
  "medium shot":       "medium framing from roughly the waist up, balancing subject presence with immediate surroundings",
  "wide shot":         "wide framing, subject occupies a modest portion of the frame with the environment clearly legible around them",
  "establishing shot": "wide establishing framing that sets geographic and spatial context before any subsequent narrowing to the subject",
  "over-the-shoulder": "over-the-shoulder framing, a foreground shoulder/frame edge with the subject visible beyond it",
  "pov":               "first-person point-of-view framing, the camera itself represents the subject's own eyeline",
  "macro":             "macro framing at extreme magnification on fine surface or material detail, shallow depth of field",
  "aerial":            "elevated aerial framing looking down across the scene from height",
  "low angle":         "low-angle framing, camera positioned below eye level looking up so the subject reads as dominant",
  "high angle":        "high-angle framing, camera positioned above eye level looking down so the subject reads as small or vulnerable",
  "dutch angle":       "deliberately tilted dutch-angle framing, horizon line off-level for tension or disorientation",
}

// TIME & WEATHER (section 7) — narrative time-of-day and atmospheric weather
// condition. Product/abstract categories default to "n/a" (controlled studio
// or void environment) rather than an invented time/weather that would
// contradict the studio lighting already specified for those categories.

export const TIME_OF_DAY: Record<string, string> = {
  "dawn":        "dawn, low warm light just breaking the horizon, long cool shadows still present",
  "morning":     "morning, bright clear light with a gentle warm cast, shadows still moderately long",
  "midday":      "midday, high overhead sun, shortest shadows of the day",
  "afternoon":   "afternoon, light beginning to warm and lengthen shadows",
  "golden hour": "golden hour, low warm sun angle, long soft shadows across the scene",
  "dusk":        "dusk, fading warm light giving way to cool ambient twilight",
  "night":       "night, artificial or moon-driven light sources only, deep ambient shadow",
  "n/a":         "not applicable — controlled studio/void environment with no natural time-of-day cycle",
}

export const WEATHER: Record<string, string> = {
  "clear":       "clear conditions, unobstructed light and visibility",
  "overcast":    "overcast sky, soft even diffusion, no hard shadows",
  "light rain":  "light rain, wet reflective surfaces, fine visible droplets in the air",
  "heavy rain":  "heavy rain, streaking droplets, reduced visibility, saturated wet surfaces",
  "fog":         "fog/mist, reduced visibility and softened contrast with distance",
  "snow":        "falling or settled snow, muted cool palette, softened ambient light",
  "windy":       "visibly windy, foliage/hair/fabric in constant responsive motion",
  "storm":       "storm conditions, dramatic sky, occasional lightning highlight, desaturated cool tones",
  "n/a":         "not applicable — controlled studio/void environment with no natural weather variance",
}

// STYLE (section 8) — overall visual/artistic treatment.

export const STYLE: Record<string, string> = {
  "photorealistic cinematic":     "photorealistic cinematic treatment, naturalistic light response, film-grade color science",
  "hyperrealistic commercial":    "hyperrealistic commercial treatment, glossy controlled finish, retouched-grade surface fidelity",
  "photorealistic documentary":   "photorealistic documentary treatment, naturalistic and unforced, no artificial polish",
  "photorealistic gritty":        "photorealistic gritty treatment, higher grain and contrast, unpolished energy",
  "stylized generative":          "stylized non-representational generative-motion treatment, emphasis on form, color and transformation over photographic realism",
  "stylized anime":               "stylized anime/illustrative treatment, cel-shaded or painterly rendering rather than photoreal",
  "retro film":                   "retro film-emulation treatment, period-accurate grain, halation and color response",
  "cyberpunk neon":               "cyberpunk neon treatment, saturated mixed practical light sources, high-contrast urban night palette",
}

// MICRO-ACTION (folds into section 3, ACTION & MICRO-ACTION) — the subtle
// secondary motion that keeps a clip from reading as a static pose holding
// still between the primary beats of the described action.

export const MICRO_ACTION_BY_CATEGORY: Record<VideoCategory, string> = {
  narrative: "natural secondary motion runs underneath the primary action throughout — subtle breathing, fabric sway, and minor weight shifts, never a held static pose",
  product:   "faint reflective micro-shifts move across the product's surface as it catches changing light through the move, keeping the reveal from reading as a static render",
  nature:    "fine-grained secondary motion continues in the environment throughout — leaf flutter, water ripple, or grass sway consistent with the stated wind/water conditions",
  action:    "continuous secondary motion — muscle tension, fabric strain, dust or debris kicked up by the primary action — runs alongside the main movement without ever pausing into a held pose",
  abstract:  "continuous micro-variation plays across the surface/edge detail throughout the transformation, so the form never reads as a static loop between beats",
}

// QUALITY TAG (section 9) — baseline fidelity bar, phrased to also exclude
// the AI-generation artifacts that most commonly break a video model's output.

export const QUALITY_TAG_BY_CATEGORY: Record<VideoCategory, string> = {
  narrative: "photorealistic detail retained through motion, no compression artifacts, no AI-generation artifacts (no extra/fused fingers, no warped text, no waxy plastic-skin look)",
  product:   "commercial-grade retouched finish, sharp surface fidelity held through the full rotation, no compression artifacts, no AI-generation artifacts (no logo warping, no melted geometry)",
  nature:    "photographic-grade natural detail, no compression artifacts, no AI-generation artifacts (no impossible terrain, no duplicated/tiled foliage or water)",
  action:    "detail retained through fast motion without frying into noise, no compression artifacts, no AI-generation artifacts (no fused/extra limbs, no impossible joint bends)",
  abstract:  "clean high-fidelity gradients with no banding or blocky compression, no AI-generation artifacts (no flicker, no texture popping between frames)",
}

// AUDIO (section 10) — sound-design intent. Named explicitly so a platform
// that supports native audio generation (rather than silent video) has a
// clear, deliberate instruction instead of an unconstrained default.

export const AUDIO_BY_CATEGORY: Record<VideoCategory, string> = {
  narrative: "ambient environmental sound matched to the setting; dialogue only if explicitly requested, otherwise no dialogue; no anachronistic or mismatched sound cues",
  product:   "clean near-silent studio ambience with subtle mechanical/material foley on contact moments only; no music unless explicitly requested",
  nature:    "natural ambient soundscape matched to the environment (wind, water, wildlife) at a level that never overpowers the visual; no artificial music sting unless requested",
  action:    "high-impact foley synced precisely to each hit/impact frame, ambient environmental bed underneath; no audio drift or delay relative to the visual action",
  abstract:  "ambient/tonal soundscape or silence, abstractly matched to the transformation's rhythm; no literal diegetic sound since the subject is non-representational",
}

// ASPECT RATIO (section 11) — category-appropriate default framing shape.

export const ASPECT_RATIO_BY_CATEGORY: Record<VideoCategory, string> = {
  narrative: "16:9 widescreen cinematic",
  product:   "1:1 square or 4:5 vertical, sized for commerce/social placements",
  nature:    "16:9 widescreen cinematic",
  action:    "16:9 widescreen cinematic",
  abstract:  "16:9 or 1:1 — the motion composition stays centered and reads cleanly in either",
}

// RENDER ENGINE (folds into section 13, COLOR GRADE & RENDER ENGINE) — the
// rendering-fidelity companion to the color grade itself.

export const RENDER_ENGINE_BY_CATEGORY: Record<VideoCategory, string> = {
  narrative: "photoreal cinema-camera rendering, physically based lighting response, no render-engine artifacts",
  product:   "physically based rendering with accurate specular/reflection response, commercial-grade render fidelity",
  nature:    "photoreal natural-light rendering, no render-engine artifacts on foliage/water surfaces",
  action:    "photoreal cinema-camera rendering that holds up under fast motion, no render-engine artifacts",
  abstract:  "high-fidelity physically based rendering with clean gradients, no banding or dithering artifacts",
}

// Default CINEMATOGRAPHY reference style per category, used when the caller
// doesn't supply an explicit `mood` — a product reveal calls for clean
// commercial camera work, not the same film-director references (Deakins,
// Lubezki) that suit a narrative scene.
export const CINEMATOGRAPHY_MOOD_DEFAULT: Record<VideoCategory, string> = {
  narrative: "cinematic",
  product:   "commercial",
  nature:    "cinematic",
  action:    "cinematic",
  abstract:  "dreamlike",
}

// MOOD & EMOTIONAL ATMOSPHERE (section 14) — distinct from the `mood` request
// field, which instead selects the CINEMATOGRAPHY reference style below.

export const MOOD_ATMOSPHERE_BY_CATEGORY: Record<VideoCategory, string> = {
  narrative: "intimate, emotionally grounded, quietly confident",
  product:   "aspirational, premium, desirable",
  nature:    "serene, awe-inspiring, vast",
  action:    "adrenaline-charged, urgent, kinetic",
  abstract:  "hypnotic, meditative, mesmerizing",
}

// VISUAL DETAIL (Advanced Enhancement #1) — fine surface/material/texture
// fidelity expectations, called out explicitly rather than left implicit.

export const VISUAL_DETAIL_BY_CATEGORY: Record<VideoCategory, string> = {
  narrative: "skin texture and pores, fabric weave and drape, and environmental micro-detail (dust motes, condensation) all render with photographic fidelity",
  product:   "micro-surface detail — brushed-metal grain, glass clarity and refraction, stitching/seam precision — renders without plasticky over-smoothing",
  nature:    "individual leaf, water, fur or feather detail stays resolved at full clip resolution, with no texture smearing during motion",
  action:    "motion-appropriate detail retention — sweat, dust kickup, fabric strain — stays visible without frying into noise at speed",
  abstract:  "fine gradient and particle-level detail in the transforming form, with no banding or blocky compression through the color transitions",
}

// STORY TELLING (Advanced Enhancement #6) — the clip reads as one complete
// beat with an implied before/after, not an arbitrary slice of time.

export const STORY_TELLING_BY_CATEGORY: Record<VideoCategory, string> = {
  narrative: "the clip reads as one complete emotional beat — an implied state before the action, the action itself as the turning point, and an implied resolved state after, not an arbitrary slice of time",
  product:   "a reveal arc: anticipation in the opening framing, the hero reveal at the rotation's key-light beat, and a resolved desirability beat in the final framing",
  nature:    "a single observed moment of a natural process (light shifting, water moving, wind through canopy) that reads as a complete, self-contained vignette",
  action:    "one complete beat of momentum — wind-up, peak effort or impact, and follow-through — fully resolved within the clip rather than cut off mid-motion",
  abstract:  "a complete transformation arc — initial form, the transformation itself, and the resolved final form — read as one continuous idea rather than a random loop",
}

// ─── Negative locks (anti-artifact) per category ─────────────────────────────
// Video diffusion models fail differently than image models: morphing across
// frames, identity drift, unnatural physics, and frame-rate stutter — none of
// which apply to a single still frame.

export const NEGATIVE_LOCKS: Record<string, string[]> = {
  narrative: [
    "No facial identity drift or morphing between frames",
    "No sudden unexplained changes in wardrobe or hairstyle mid-clip",
    "No unnatural motion speed changes or teleporting limbs",
    "No extra or merged limbs during movement",
    "No frame-rate stutter or motion judder",
  ],
  product: [
    "No warping or morphing of product geometry during rotation",
    "No inconsistent surface reflections between frames",
    "No product label or logo distortion",
    "No camera drift off the fixed orbit radius",
  ],
  nature: [
    "No unnatural time-of-day lighting shifts within the clip",
    "No repeating or looping background elements",
    "No physically impossible weather transitions",
    "No flickering foliage or water texture",
  ],
  action: [
    "No unnatural physics or floating during fast motion",
    "No motion blur inconsistent with the stated speed",
    "No limb merging during rapid movement",
    "No environment warping during camera motion",
  ],
  abstract: [
    "No abrupt discontinuities in the motion path",
    "No flickering or strobing artifacts",
    "No loss of form consistency across the transformation",
  ],
}
