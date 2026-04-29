/**
 * seed-text-prompts.ts
 * --------------------
 * Seeds pl_prompts with Website, Text, and Content Generation prompts.
 * Image Generation is already covered by import-prompts.ts (Excel).
 *
 * Usage:
 *   cd backend
 *   npx tsx scripts/seed-text-prompts.ts
 *
 * Safe to re-run — ON CONFLICT (slug) DO NOTHING.
 */

import postgres from "postgres";
import { config } from "dotenv";

config({ path: new URL("../.env", import.meta.url).pathname });

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeedPrompt {
  slug:          string;
  title:         string;
  base_prompt:   string;
  category:      string;
  sub_category:  string;
  prompt_type:   string;
  tags:          string[];
  source:        string;
  quality_score: number;
  tested:        boolean;
  platforms: {
    chatgpt:    string;
    gemini:     string;
    grok:       string;
    midjourney: string;
    firefly:    string;
    flux:       string;
  };
}

const NA = "(not applicable)";

// =============================================================================
// WEBSITE GENERATION PROMPTS
// =============================================================================

const websitePrompts: SeedPrompt[] = [
  // ── Landing Pages ──────────────────────────────────────────────────────────
  {
    slug: "WEB-LAND-001", title: "SaaS Hero Section",
    base_prompt: "Build a high-converting SaaS hero section with headline, subheading, CTA, and product screenshot",
    category: "Website Generation", sub_category: "Landing Pages", prompt_type: "SaaS Landing Page",
    tags: ["saas", "hero", "landing page", "react", "tailwind", "cta"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "You are a senior React developer. Build a production-ready SaaS hero section component using React + Tailwind CSS.\n\nRequirements:\n- Headline: [headline]\n- Subheading: [subheading]\n- Primary CTA button: [cta_text] (links to [cta_url])\n- Secondary link: [secondary_text]\n- Product screenshot placeholder (16:9 aspect ratio)\n- Mobile-first responsive layout\n- Clean, modern typography\n- Use TypeScript and proper props interface\n- No external libraries beyond React and Tailwind",
      gemini: "Build a SaaS hero section in React + Tailwind CSS.\nHeadline: [headline]\nSubheading: [subheading]\nPrimary CTA: [cta_text]\nInclude: responsive layout, product screenshot area, clean design. TypeScript.",
      grok: "React + Tailwind SaaS hero: headline=[headline], subheading=[subheading], CTA=[cta_text]. Mobile-first, TypeScript.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "WEB-LAND-002", title: "Pricing Section with 3 Tiers",
    base_prompt: "Create a clean 3-tier pricing section with feature comparison, toggle for monthly/yearly, and highlighted plan",
    category: "Website Generation", sub_category: "Landing Pages", prompt_type: "Pricing Section",
    tags: ["pricing", "saas", "react", "tailwind", "toggle", "landing page"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "You are a senior React developer. Build a 3-tier pricing section using React + Tailwind CSS.\n\nRequirements:\n- Monthly/Yearly toggle (yearly shows 20% discount)\n- Three plans: Free ([free_price]), Pro ([pro_price]), Enterprise (Custom)\n- Highlighted middle plan (\"Most popular\" badge)\n- Feature list per plan with checkmarks\n- CTA button per plan\n- TypeScript, clean props interface\n- Fully responsive (stacks on mobile)",
      gemini: "React + Tailwind 3-tier pricing section with monthly/yearly toggle, highlighted Pro plan, feature lists, CTA buttons. TypeScript, responsive.",
      grok: "Pricing section: 3 tiers (Free/Pro/Enterprise), monthly-yearly toggle, Pro highlighted. React + Tailwind + TypeScript.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "WEB-LAND-003", title: "Feature Grid Section",
    base_prompt: "Build a responsive 3-column feature grid with icons, titles, and descriptions for a SaaS landing page",
    category: "Website Generation", sub_category: "Landing Pages", prompt_type: "Features Section",
    tags: ["features", "grid", "icons", "saas", "react", "tailwind"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a responsive features section in React + Tailwind CSS.\n\nSpecs:\n- 3-column grid on desktop, 1 column on mobile\n- 6 feature cards each with: Lucide icon, title, 2-line description\n- Features: [feature_list] (comma-separated)\n- Subtle card borders or background tint\n- Section heading: [section_title]\n- TypeScript, clean component structure",
      gemini: "React + Tailwind feature grid: 6 cards, 3-column desktop layout, each with icon + title + description. Section title: [section_title]. Responsive, TypeScript.",
      grok: "Feature grid: 6 items with icons, 3-col desktop. React + Tailwind. Section: [section_title].",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "WEB-LAND-004", title: "Portfolio Hero with Animated Name",
    base_prompt: "Create a personal portfolio hero with animated name reveal, role typewriter effect, and social links",
    category: "Website Generation", sub_category: "Landing Pages", prompt_type: "Portfolio Hero",
    tags: ["portfolio", "animation", "typewriter", "hero", "react", "framer-motion"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a personal portfolio hero section in React + Tailwind CSS.\n\nRequirements:\n- Large animated name reveal: [name] (slide-in or fade-up on load)\n- Role typewriter effect cycling through: [roles] (comma-separated)\n- One-line bio: [bio]\n- Social icon links: GitHub, LinkedIn, Twitter (URLs provided as props)\n- Primary CTA: [cta] (e.g. 'View my work')\n- Clean minimal design, dark or light theme\n- Use Framer Motion for animations\n- TypeScript",
      gemini: "Portfolio hero: animated name [name], typewriter roles [roles], bio [bio], social links. React + Tailwind + Framer Motion. TypeScript.",
      grok: "Portfolio hero with animated name=[name], typewriter roles=[roles], social links. React + Framer Motion.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "WEB-LAND-005", title: "Testimonials Carousel",
    base_prompt: "Build an auto-scrolling testimonials carousel with avatars, names, roles, and star ratings",
    category: "Website Generation", sub_category: "Landing Pages", prompt_type: "Social Proof",
    tags: ["testimonials", "carousel", "social proof", "react", "tailwind", "animation"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a testimonials carousel in React + Tailwind CSS.\n\nRequirements:\n- Auto-scroll every 4 seconds with pause on hover\n- Each card: avatar (initials fallback), name, role/company, star rating (1-5), quote text\n- Navigation dots at bottom\n- Smooth CSS transition between slides\n- Accept testimonials array as prop\n- TypeScript with Testimonial interface\n- Responsive (single card mobile, 3-up desktop optional)",
      gemini: "Testimonials carousel: auto-scroll, avatar + name + role + stars + quote. Navigation dots. React + Tailwind. TypeScript.",
      grok: "Testimonials carousel with auto-scroll, avatars, stars, quotes. React + Tailwind + TypeScript.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },

  // ── Web Apps ────────────────────────────────────────────────────────────────
  {
    slug: "WEB-APP-001", title: "Analytics Dashboard Layout",
    base_prompt: "Create a responsive analytics dashboard with sidebar nav, stat cards, and chart placeholders",
    category: "Website Generation", sub_category: "Web Apps", prompt_type: "Dashboard",
    tags: ["dashboard", "analytics", "sidebar", "charts", "react", "tailwind"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a responsive analytics dashboard layout in React + Tailwind CSS.\n\nLayout:\n- Collapsible sidebar with nav links: [nav_items] (icons + labels)\n- Top header with page title, user avatar, notifications bell\n- 4 stat cards (metric name, value, percentage change, trend icon)\n- 2 chart placeholder areas (large line chart, smaller bar chart)\n- Recent activity table (5 rows)\n- TypeScript, clean component split (Sidebar, Header, StatCard, etc.)",
      gemini: "Analytics dashboard: collapsible sidebar, 4 stat cards, chart areas, activity table. React + Tailwind. TypeScript components.",
      grok: "Dashboard layout: sidebar nav, 4 stat cards, 2 chart placeholders, activity table. React + Tailwind.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "WEB-APP-002", title: "Data Table with Filters",
    base_prompt: "Build a sortable, filterable data table with pagination and row selection",
    category: "Website Generation", sub_category: "Web Apps", prompt_type: "Data Table",
    tags: ["table", "sort", "filter", "pagination", "react", "tailwind", "data"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a production-ready data table in React + Tailwind CSS.\n\nFeatures:\n- Columns: [columns] (comma-separated, first column is sortable by default)\n- Click column header to sort (asc/desc toggle)\n- Search input filters across all columns\n- Row checkbox selection (select all + individual)\n- Pagination: [rows_per_page] rows per page, Previous/Next buttons, page count\n- Empty state illustration/text when no results\n- TypeScript generics so table accepts any data shape",
      gemini: "Sortable filterable data table: columns=[columns], row selection, pagination, search. React + Tailwind. TypeScript generics.",
      grok: "Data table: sortable columns, search filter, row selection, pagination. React + Tailwind. TypeScript.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "WEB-APP-003", title: "Multi-Step Form Wizard",
    base_prompt: "Build a 4-step form wizard with progress indicator, validation, and step navigation",
    category: "Website Generation", sub_category: "Web Apps", prompt_type: "Form Wizard",
    tags: ["form", "wizard", "multi-step", "validation", "react", "tailwind"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a multi-step form wizard in React + Tailwind CSS.\n\nSteps: [steps] (comma-separated step names)\nEach step has its own fields (defined via props).\n\nFeatures:\n- Top progress bar or numbered step indicator\n- Previous / Next navigation (Next disabled until required fields filled)\n- Final Review step shows all entered data\n- Submit handler fires on last step\n- React Hook Form + Zod validation\n- TypeScript",
      gemini: "Multi-step form: steps=[steps], progress indicator, validation with React Hook Form + Zod, review step, submit handler. React + Tailwind.",
      grok: "Form wizard: [steps] steps, progress bar, validation, review + submit. React + React Hook Form.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "WEB-APP-004", title: "Kanban Board",
    base_prompt: "Build a drag-and-drop Kanban board with columns, cards, and card creation",
    category: "Website Generation", sub_category: "Web Apps", prompt_type: "Kanban",
    tags: ["kanban", "drag drop", "project management", "react", "tailwind", "dnd"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a Kanban board in React + Tailwind CSS.\n\nColumns: [columns] (e.g. To Do, In Progress, Review, Done)\n\nFeatures:\n- Drag cards between columns (@hello-pangea/dnd or react-dnd)\n- Add card button per column opens inline form\n- Card shows: title, optional description, colour tag\n- Column shows card count badge\n- Delete card on hover\n- Persist state in localStorage\n- TypeScript",
      gemini: "Kanban board: columns=[columns], drag-and-drop cards, add card per column, count badges, localStorage persist. React + Tailwind.",
      grok: "Kanban: [columns] columns, drag-drop cards, add card forms, card counts. React + dnd library.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "WEB-APP-005", title: "Authentication Pages Set",
    base_prompt: "Build Login, Register, and Forgot Password pages with form validation",
    category: "Website Generation", sub_category: "Web Apps", prompt_type: "Auth Pages",
    tags: ["auth", "login", "register", "password", "react", "form", "validation"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a set of authentication pages in React + Tailwind CSS.\n\nPages:\n1. Login — email, password, 'Remember me', forgot password link, submit\n2. Register — name, email, password, confirm password, terms checkbox\n3. Forgot Password — email input, success message state\n\nAll pages:\n- Centred card layout\n- Logo placeholder at top\n- React Hook Form + Zod validation\n- Inline field error messages\n- Loading state on submit button\n- TypeScript",
      gemini: "Auth pages (Login, Register, Forgot Password) with React Hook Form + Zod validation, loading states, error messages. React + Tailwind. TypeScript.",
      grok: "3 auth pages: login, register, forgot-password. RHF + Zod validation, loading states. React + Tailwind.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },

  // ── UI Components ───────────────────────────────────────────────────────────
  {
    slug: "WEB-UI-001", title: "Sticky Navigation Bar",
    base_prompt: "Build a sticky responsive navigation bar with logo, links, mobile hamburger menu",
    category: "Website Generation", sub_category: "UI Components", prompt_type: "Navigation",
    tags: ["navbar", "navigation", "responsive", "hamburger", "react", "tailwind"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a sticky responsive navigation bar in React + Tailwind CSS.\n\nSpec:\n- Left: Logo (text or image prop)\n- Centre: Nav links [nav_links] (hide on mobile)\n- Right: CTA button + mobile hamburger\n- Mobile: slide-down full-width menu on hamburger click\n- Active link highlight\n- Subtle shadow on scroll (IntersectionObserver)\n- TypeScript",
      gemini: "Sticky navbar: logo, nav links [nav_links], CTA, mobile hamburger with slide-down menu. Scroll shadow. React + Tailwind. TypeScript.",
      grok: "Sticky nav: logo, links=[nav_links], CTA, mobile menu. React + Tailwind.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "WEB-UI-002", title: "Footer with Newsletter Signup",
    base_prompt: "Build a 4-column footer with links, social icons, and newsletter email signup",
    category: "Website Generation", sub_category: "UI Components", prompt_type: "Footer",
    tags: ["footer", "newsletter", "social", "links", "react", "tailwind"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Build a footer component in React + Tailwind CSS.\n\nLayout:\n- 4-column grid (Product links, Company links, Resources links, Newsletter)\n- Brand column (left): logo, tagline, social icons (GitHub, Twitter, LinkedIn)\n- Newsletter column: heading, email input + Subscribe button, privacy note\n- Bottom strip: copyright, legal links\n- Responsive (2-col tablet, 1-col mobile)\n- TypeScript with FooterConfig prop",
      gemini: "Footer: 4 columns (links + newsletter), social icons, brand tagline, copyright strip. Responsive. React + Tailwind. TypeScript.",
      grok: "Footer: 4-col layout, social icons, newsletter signup, copyright. React + Tailwind.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
];

// =============================================================================
// TEXT GENERATION PROMPTS
// =============================================================================

const textPrompts: SeedPrompt[] = [
  // ── Developers ─────────────────────────────────────────────────────────────
  {
    slug: "TXT-DEV-001", title: "Code Review Assistant",
    base_prompt: "Review code for bugs, security issues, performance problems and best practice violations",
    category: "Text Generation", sub_category: "Developers", prompt_type: "Code Review",
    tags: ["code review", "developer", "security", "performance", "best practices"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a senior [language] engineer performing a thorough code review.\n\nReview the following code for:\n1. Bugs and logic errors\n2. Security vulnerabilities (injection, auth issues, data exposure)\n3. Performance bottlenecks\n4. Violations of [language] best practices\n5. Readability and maintainability issues\n\nFor each issue: state the line/section, explain the problem, and provide a corrected version.\n\n```[language]\n[code]\n```",
      gemini: "Senior [language] code review. Check for: bugs, security issues, performance, best practices. Explain each issue with the corrected code.\n\n[code]",
      grok: "Review this [language] code for bugs, security, performance: [code]",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-DEV-002", title: "API Endpoint Designer",
    base_prompt: "Design a RESTful API endpoint with route, request/response schema, error codes, and example",
    category: "Text Generation", sub_category: "Developers", prompt_type: "API Design",
    tags: ["api", "rest", "endpoint", "schema", "developer", "backend"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a senior backend architect. Design a production-ready REST API endpoint.\n\nFeature: [feature_description]\nFramework: [framework] (e.g. Express, FastAPI, Hono)\n\nProvide:\n1. HTTP method + route path\n2. Request body JSON schema with types and validation rules\n3. Success response (200/201) with example JSON\n4. Error responses (400, 401, 403, 404, 500) with messages\n5. Middleware required (auth, rate-limit, validation)\n6. Full implementation code",
      gemini: "Design REST endpoint for [feature_description] using [framework]. Include: route, request schema, success/error responses, middleware, implementation.",
      grok: "REST endpoint for [feature_description] in [framework]. Route, schema, error codes, code.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-DEV-003", title: "Database Schema Designer",
    base_prompt: "Design a normalised relational database schema for a given feature with SQL and relationships",
    category: "Text Generation", sub_category: "Developers", prompt_type: "Database Design",
    tags: ["database", "schema", "sql", "postgresql", "developer", "backend"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a senior database architect. Design a normalised PostgreSQL schema for: [feature]\n\nProvide:\n1. Table definitions with column names, types, constraints (NOT NULL, UNIQUE, CHECK)\n2. Primary and foreign keys with ON DELETE behaviour\n3. Indexes for expected query patterns\n4. Entity-relationship description\n5. Example INSERT and SELECT queries\n6. Notes on scaling considerations\n\nOutput clean, commented SQL.",
      gemini: "PostgreSQL schema design for [feature]. Tables, relationships, indexes, constraints. Sample queries. Normalised, commented SQL.",
      grok: "Design PostgreSQL schema for [feature]: tables, FKs, indexes, sample queries.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-DEV-004", title: "TypeScript Type Definitions",
    base_prompt: "Generate TypeScript interfaces, types, and Zod schemas from a feature description",
    category: "Text Generation", sub_category: "Developers", prompt_type: "Type Generation",
    tags: ["typescript", "types", "interfaces", "zod", "developer", "frontend"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a TypeScript expert. Generate complete type definitions for: [feature]\n\nProvide:\n1. TypeScript interfaces for all entities\n2. Union types and enums where appropriate\n3. Zod validation schemas matching the interfaces\n4. Utility types (Partial, Pick, Omit variants as needed)\n5. JSDoc comments on non-obvious fields\n\nFollow strict TypeScript — no any, no type assertions.",
      gemini: "TypeScript types for [feature]: interfaces, enums, Zod schemas, utility types. Strict mode, JSDoc comments.",
      grok: "TypeScript interfaces + Zod schemas for [feature]. Strict, no any.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-DEV-005", title: "Git Commit Message Generator",
    base_prompt: "Generate a conventional commit message from a description of code changes",
    category: "Text Generation", sub_category: "Developers", prompt_type: "Git",
    tags: ["git", "commit", "conventional commits", "developer", "workflow"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Generate a conventional commit message for the following code change.\n\nChange description: [change_description]\nFiles changed: [files]\n\nFollow the Conventional Commits spec:\n- Format: <type>(<scope>): <subject>\n- Types: feat, fix, docs, style, refactor, test, chore, perf, ci\n- Subject: imperative mood, max 72 chars, no period\n- Include a body if the change needs explanation\n- Include BREAKING CHANGE footer if applicable\n\nOutput 3 options ranked by appropriateness.",
      gemini: "Conventional commit for: [change_description]. Files: [files]. 3 options (feat/fix/refactor) with body if needed.",
      grok: "Conventional commit for [change_description]. 3 options.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-DEV-006", title: "README Generator",
    base_prompt: "Write a professional README.md for a code project with installation, usage, and API docs",
    category: "Text Generation", sub_category: "Developers", prompt_type: "Documentation",
    tags: ["readme", "documentation", "markdown", "developer", "open source"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Write a professional README.md for the following project.\n\nProject: [project_name]\nDescription: [description]\nTech stack: [stack]\nMain features: [features]\n\nSections to include:\n1. Project title + badges (build, license, version)\n2. One-paragraph description\n3. Quick demo (placeholder for GIF/screenshot)\n4. Installation steps\n5. Usage with code examples\n6. Configuration / environment variables table\n7. API reference (if applicable)\n8. Contributing guide\n9. License\n\nUse proper Markdown formatting.",
      gemini: "README.md for [project_name]: description, install, usage examples, config table, contributing. Markdown.",
      grok: "README for [project_name]: install, usage, config, API docs. Clean Markdown.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-DEV-007", title: "Regex Pattern Builder",
    base_prompt: "Generate and explain a regex pattern for a validation or parsing requirement",
    category: "Text Generation", sub_category: "Developers", prompt_type: "Regex",
    tags: ["regex", "validation", "pattern", "developer", "parsing"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a regex expert. Generate a regex pattern for the following requirement.\n\nRequirement: [requirement]\nLanguage/engine: [language] (e.g. JavaScript, Python, PostgreSQL)\n\nProvide:\n1. The regex pattern\n2. Step-by-step explanation of each part\n3. 5 test cases that should match\n4. 3 edge cases that should NOT match\n5. Usage example in [language] code",
      gemini: "Regex for [requirement] in [language]. Pattern, explanation, 5 match examples, 3 non-match cases, code example.",
      grok: "Regex pattern for [requirement] in [language]: pattern, explanation, test cases.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-DEV-008", title: "Performance Optimisation Advisor",
    base_prompt: "Analyse code or architecture for performance bottlenecks and provide specific optimisations",
    category: "Text Generation", sub_category: "Developers", prompt_type: "Performance",
    tags: ["performance", "optimisation", "developer", "backend", "profiling"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Act as a performance engineering expert. Analyse the following [type] for performance issues.\n\nContext: [context]\nCurrent metrics / problem: [problem]\nCode / Architecture: [code_or_arch]\n\nProvide:\n1. Identified bottlenecks (ranked by impact)\n2. Root cause for each\n3. Specific optimisation with before/after code\n4. Expected improvement estimate\n5. Monitoring recommendations",
      gemini: "Performance analysis for [type]: bottlenecks in [code_or_arch], root causes, optimisations with code, expected gains.",
      grok: "Optimise [type]: [problem]. Find bottlenecks, fix with code examples.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },

  // ── Data & Analytics ────────────────────────────────────────────────────────
  {
    slug: "TXT-DATA-001", title: "Complex SQL Query Builder",
    base_prompt: "Write an optimised SQL query for a business reporting requirement",
    category: "Text Generation", sub_category: "Data & Analytics", prompt_type: "SQL",
    tags: ["sql", "query", "analytics", "reporting", "database", "data"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a senior data engineer. Write an optimised [database] SQL query for:\n\nRequirement: [requirement]\nRelevant tables and columns: [schema]\nFilters: [filters]\nGrouping: [grouping]\n\nRequirements:\n- Use CTEs for readability over nested subqueries\n- Add indexes recommendation if the query will be slow\n- Handle NULL values explicitly\n- Add inline comments explaining complex logic\n- Provide execution plan note if relevant",
      gemini: "SQL query for [database]: [requirement]. Tables: [schema]. Use CTEs, handle NULLs, add comments, index recommendations.",
      grok: "[database] SQL for [requirement] using tables [schema]. Optimised with CTEs.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-DATA-002", title: "Executive Data Report",
    base_prompt: "Transform raw data or metrics into a clear executive summary report",
    category: "Text Generation", sub_category: "Data & Analytics", prompt_type: "Report",
    tags: ["report", "executive", "data", "analytics", "summary", "insights"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Act as a senior data analyst. Transform the following data into a clear executive report.\n\nData / Metrics: [data]\nAudience: [audience]\nTime period: [period]\n\nReport structure:\n1. Executive Summary (3 sentences max)\n2. Key Metrics (table format)\n3. Top 3 Insights with business impact\n4. Anomalies or concerns\n5. Recommended actions (2-3 bullets)\n\nTone: [tone]. Length: concise, scannable.",
      gemini: "Executive data report from [data] for [audience], period [period]. Summary, key metrics table, 3 insights, anomalies, recommendations.",
      grok: "Executive report from [data]: summary, metrics, insights, recommendations. Audience: [audience].",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },

  // ── Product Management ──────────────────────────────────────────────────────
  {
    slug: "TXT-PM-001", title: "Product Requirements Document",
    base_prompt: "Write a structured PRD for a product feature with problem, goals, user stories, and acceptance criteria",
    category: "Text Generation", sub_category: "Product", prompt_type: "PRD",
    tags: ["prd", "product", "requirements", "user stories", "pm", "feature"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a senior product manager. Write a complete PRD for the following feature.\n\nFeature: [feature]\nProduct: [product]\nTarget users: [users]\n\nPRD sections:\n1. Problem statement (what pain does this solve?)\n2. Goals & success metrics (measurable KPIs)\n3. Non-goals (explicit out-of-scope)\n4. User personas affected\n5. User stories (Given/When/Then format)\n6. Functional requirements\n7. Non-functional requirements (performance, security, accessibility)\n8. Acceptance criteria (testable)\n9. Dependencies and risks\n10. Open questions",
      gemini: "PRD for [feature] in [product]: problem, goals/KPIs, non-goals, user stories, requirements, acceptance criteria, risks.",
      grok: "PRD for [feature]: problem, goals, user stories, requirements, acceptance criteria.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-PM-002", title: "User Story Writer",
    base_prompt: "Write structured user stories with acceptance criteria for a product feature",
    category: "Text Generation", sub_category: "Product", prompt_type: "User Story",
    tags: ["user story", "product", "agile", "acceptance criteria", "pm", "scrum"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a senior product manager. Write user stories for: [feature]\n\nFor each story:\n- Title\n- Format: As a [user type], I want to [action] so that [benefit]\n- Acceptance criteria (3-5 bullet points, testable)\n- Story points estimate (Fibonacci: 1,2,3,5,8)\n- Priority (P1/P2/P3)\n- Dependencies\n\nWrite stories for: [user_types] (comma-separated user roles).\nCover happy path, error states, and edge cases.",
      gemini: "User stories for [feature]: As a/I want/So that format, acceptance criteria, story points, priority. For users: [user_types].",
      grok: "User stories for [feature], roles [user_types]: story format, acceptance criteria, points.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "TXT-PM-003", title: "Feature Prioritisation Framework",
    base_prompt: "Evaluate and prioritise a list of features using RICE or ICE scoring",
    category: "Text Generation", sub_category: "Product", prompt_type: "Prioritisation",
    tags: ["prioritisation", "rice", "product", "roadmap", "pm", "scoring"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Act as a senior product strategist. Evaluate and prioritise the following features using RICE scoring.\n\nFeatures: [features] (comma-separated)\nProduct context: [context]\nTeam size/capacity: [capacity]\n\nFor each feature provide:\n- Reach (users impacted per quarter)\n- Impact (0.25/0.5/1/2/3 scale)\n- Confidence (% based on evidence)\n- Effort (person-weeks)\n- RICE Score = (Reach × Impact × Confidence) / Effort\n\nOutput as a ranked table then provide strategic recommendation.",
      gemini: "RICE scoring for features [features] in [context]: Reach, Impact, Confidence, Effort, Score. Ranked table + recommendation.",
      grok: "Prioritise [features] with RICE scoring. Ranked table, top recommendation.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
];

// =============================================================================
// CONTENT GENERATION PROMPTS
// =============================================================================

const contentPrompts: SeedPrompt[] = [
  // ── Marketing ───────────────────────────────────────────────────────────────
  {
    slug: "CON-MKT-001", title: "Product Launch Email",
    base_prompt: "Write a conversion-optimised product launch email with subject line, hook, benefits, and CTA",
    category: "Content Generation", sub_category: "Marketing", prompt_type: "Email",
    tags: ["email", "launch", "marketing", "copywriting", "cta", "conversion"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "You are a direct-response copywriter. Write a product launch email for [product] targeting [audience].\n\nInclude:\n1. 3 subject line options (curiosity, benefit, urgency styles)\n2. Preview text (90 chars max)\n3. Opening hook (bold statement or question, 2 sentences)\n4. Problem statement (empathy paragraph)\n5. Product introduction (1 paragraph)\n6. 3 key benefits (bold headline + 1 sentence each)\n7. Social proof (testimonial or stat placeholder)\n8. Urgency element ([urgency])\n9. Primary CTA button: [cta]\n10. P.S. line\n\nTone: [tone]. Word count: ~250 words.",
      gemini: "Product launch email for [product], audience [audience]: 3 subject lines, hook, benefits, social proof, CTA=[cta], urgency=[urgency]. Tone: [tone].",
      grok: "Launch email for [product] to [audience]: subject, hook, 3 benefits, CTA=[cta]. Tone: [tone].",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "CON-MKT-002", title: "LinkedIn Thought Leadership Post",
    base_prompt: "Write a hook-driven LinkedIn post that positions the author as a thought leader",
    category: "Content Generation", sub_category: "Marketing", prompt_type: "Social Media",
    tags: ["linkedin", "thought leadership", "social media", "content", "personal brand"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "You are a top LinkedIn creator. Write a thought leadership post for [author] about [topic].\n\nAudience: [audience]\nTone: [tone]\nPersonal angle: [personal_angle]\n\nStructure:\n1. Hook (first line — bold, curious, or contrarian — no more than 12 words)\n2. Context or story (3-4 short sentences)\n3. Key insight or lesson (1-2 sentences, the 'aha')\n4. Supporting point or data\n5. Actionable takeaway\n6. Engagement question\n7. Relevant hashtags (3-5)\n\nMax 180 words. Short sentences. No buzzwords.",
      gemini: "LinkedIn post for [author] on [topic], audience [audience], tone [tone]: hook, story, insight, takeaway, question, hashtags. 180 words max.",
      grok: "LinkedIn post on [topic] by [author]: hook, insight, lesson, engagement question. [tone] tone. 180 words.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "CON-MKT-003", title: "Google/Meta Ad Copy Set",
    base_prompt: "Write headlines, descriptions, and CTAs for a paid ad campaign",
    category: "Content Generation", sub_category: "Marketing", prompt_type: "Ad Copy",
    tags: ["ads", "google ads", "meta ads", "copywriting", "ppc", "marketing"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "You are a performance marketing copywriter. Write ad copy for a [platform] campaign.\n\nProduct/Service: [product]\nTarget audience: [audience]\nUnique value proposition: [uvp]\nOffer/Incentive: [offer]\n\nDeliver:\n- 5 headlines (max 30 chars each for Google, 40 for Meta)\n- 3 descriptions (max 90 chars each)\n- 3 CTA variations\n- 1 primary hook for Meta carousel/banner\n\nFocus on: [focus] (e.g. pain, gain, fear, social proof).",
      gemini: "Ad copy for [platform], product [product], audience [audience], UVP [uvp]: 5 headlines, 3 descriptions, 3 CTAs. Focus: [focus].",
      grok: "[platform] ads for [product]: 5 headlines, descriptions, CTAs. UVP: [uvp].",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "CON-MKT-004", title: "SEO Blog Post Outline",
    base_prompt: "Create a keyword-optimised blog post outline with H2/H3 structure and meta description",
    category: "Content Generation", sub_category: "Marketing", prompt_type: "SEO",
    tags: ["seo", "blog", "content marketing", "outline", "keywords", "marketing"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as an SEO content strategist. Create a detailed blog post outline.\n\nTarget keyword: [keyword]\nSecondary keywords: [secondary_keywords]\nAudience: [audience]\nSearch intent: [intent] (informational / commercial / transactional)\n\nProvide:\n1. Title tag (50-60 chars, keyword-first)\n2. Meta description (150-160 chars)\n3. Introduction hook + problem statement\n4. H2 sections (5-7) with brief descriptions\n5. H3 sub-sections under each H2\n6. Key statistics or data points to include\n7. CTA placement recommendation\n8. Internal linking opportunities",
      gemini: "SEO blog outline for [keyword]: title tag, meta description, H2/H3 structure, key stats, CTA. Intent: [intent].",
      grok: "Blog outline for [keyword]: title, meta, H2 sections with H3s, stats. SEO-focused.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "CON-MKT-005", title: "Brand Voice Style Guide",
    base_prompt: "Create a brand voice and tone guide with do/don't examples for a company",
    category: "Content Generation", sub_category: "Marketing", prompt_type: "Brand",
    tags: ["brand voice", "tone", "style guide", "marketing", "copywriting", "brand"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Act as a brand strategist. Create a brand voice and tone guide for [brand].\n\nBrand context: [brand_context]\nTarget audience: [audience]\nCompetitors (to differentiate from): [competitors]\n\nDeliverables:\n1. Brand personality (5 adjectives with 1-line explanation)\n2. Voice pillars (3-4 core characteristics)\n3. Tone variations (formal, informal, crisis, social)\n4. Vocabulary: preferred words and phrases to use\n5. Words and phrases to avoid\n6. Do/Don't examples (3 pairs for each section)\n7. Sample tagline options (3)",
      gemini: "Brand voice guide for [brand], audience [audience]: personality, voice pillars, tone variations, vocabulary do/don't, taglines.",
      grok: "Brand voice for [brand]: personality, pillars, tone, vocabulary, do/don't examples.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },

  // ── HR & Recruiting ─────────────────────────────────────────────────────────
  {
    slug: "CON-HR-001", title: "Job Description Writer",
    base_prompt: "Write an inclusive, role-specific job description with responsibilities, requirements, and benefits",
    category: "Content Generation", sub_category: "HR & Recruiting", prompt_type: "Job Description",
    tags: ["hr", "job description", "recruiting", "hiring", "inclusive", "jd"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "You are an experienced HR professional and DEI-conscious copywriter. Write a job description.\n\nRole: [role]\nCompany: [company]\nDepartment: [department]\nLevel: [level] (e.g. Junior, Senior, Lead)\nTone: [tone]\n\nStructure:\n1. About [company] (2 sentences)\n2. Role overview (2-3 sentences, impact-first)\n3. What you'll do (5-7 responsibilities, action verbs)\n4. What you'll bring (5 must-haves, 3 nice-to-haves)\n5. Why join us (3-4 compelling benefits)\n6. Compensation range: [comp_range]\n7. Inclusive closing statement\n\nAvoid: gendered language, ageist terms, excessive requirements.",
      gemini: "Job description for [role] at [company], level [level], tone [tone]: overview, responsibilities, requirements, benefits, comp range. Inclusive language.",
      grok: "JD for [role] at [company]: overview, 5-7 responsibilities, requirements, benefits. Inclusive tone.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "CON-HR-002", title: "Interview Question Set",
    base_prompt: "Generate structured behavioural and technical interview questions with evaluation criteria",
    category: "Content Generation", sub_category: "HR & Recruiting", prompt_type: "Interview",
    tags: ["interview", "hr", "recruiting", "behavioural", "star method", "evaluation"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a senior talent acquisition specialist. Generate an interview question set.\n\nRole: [role]\nLevel: [level]\nKey competencies to assess: [competencies]\n\nFor each competency provide:\n1. Behavioural question (STAR method)\n2. Follow-up probe question\n3. What a strong answer looks like (scoring rubric)\n\nAlso provide:\n- 3 role-specific technical questions\n- 2 culture-fit questions\n- 1 closing question to give candidate space\n\nNote which questions reveal [specific_quality].",
      gemini: "Interview questions for [role] at [level]: behavioural (STAR) + technical for competencies [competencies]. Scoring rubrics, follow-ups.",
      grok: "Interview Qs for [role]: behavioural for [competencies], 3 technical, culture-fit. With rubrics.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },

  // ── Education ───────────────────────────────────────────────────────────────
  {
    slug: "CON-EDU-001", title: "Lesson Plan Creator",
    base_prompt: "Create a structured lesson plan with learning objectives, activities, and assessment",
    category: "Content Generation", sub_category: "Education", prompt_type: "Lesson Plan",
    tags: ["lesson plan", "education", "teaching", "learning objectives", "curriculum"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Act as an experienced educator. Create a detailed lesson plan.\n\nSubject: [subject]\nTopic: [topic]\nGrade/Level: [level]\nDuration: [duration] minutes\nLearning style focus: [learning_style]\n\nLesson plan:\n1. Learning objectives (3-5, measurable, use Bloom's taxonomy verbs)\n2. Materials and resources needed\n3. Introduction / Hook (5 mins) — how to capture attention\n4. Direct instruction (explain core concept)\n5. Guided practice activity\n6. Independent practice\n7. Assessment method (formative)\n8. Closure and recap\n9. Differentiation notes (for advanced and struggling students)\n10. Homework (optional)",
      gemini: "Lesson plan for [subject] - [topic], level [level], [duration] mins: objectives (Bloom's), activities, assessment, differentiation.",
      grok: "Lesson plan: [topic], level [level], [duration] mins. Objectives, activities, assessment.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "CON-EDU-002", title: "Quiz & Assessment Generator",
    base_prompt: "Generate a multiple-choice quiz with answer key and explanations for a topic",
    category: "Content Generation", sub_category: "Education", prompt_type: "Quiz",
    tags: ["quiz", "assessment", "education", "multiple choice", "testing", "teacher"],
    source: "curated", quality_score: 5, tested: true,
    platforms: {
      chatgpt: "Act as a curriculum designer. Generate a [question_count]-question quiz.\n\nSubject: [subject]\nTopic: [topic]\nLevel: [level]\nDifficulty distribution: 40% easy, 40% medium, 20% hard\n\nFor each question:\n- The question (clear, unambiguous)\n- 4 answer options (A-D) — one clearly correct, others plausible\n- Correct answer\n- 1-sentence explanation of why it's correct\n- Difficulty label\n\nEnd with a 5-question bonus short-answer section on the hardest concepts.",
      gemini: "[question_count]-question quiz on [topic], level [level]: MCQ with 4 options, correct answer, explanation. 40/40/20 difficulty split.",
      grok: "Quiz: [question_count] MCQs on [topic], level [level]. Options, answers, explanations.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },

  // ── Legal & Finance ─────────────────────────────────────────────────────────
  {
    slug: "CON-LEG-001", title: "Privacy Policy Generator",
    base_prompt: "Draft a GDPR-compliant privacy policy for a web application",
    category: "Content Generation", sub_category: "Legal", prompt_type: "Policy",
    tags: ["privacy policy", "gdpr", "legal", "compliance", "web app", "data"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Act as a legal compliance specialist. Draft a GDPR-compliant privacy policy.\n\nCompany: [company]\nProduct: [product]\nData collected: [data_types]\nJurisdiction: [jurisdiction]\nDPO contact: [dpo_email]\n\nSections required:\n1. Introduction and controller identity\n2. Data we collect (and how)\n3. Legal basis for processing\n4. How we use your data\n5. Data sharing and third parties\n6. Data retention periods\n7. Your rights (access, deletion, portability, objection)\n8. Cookies policy\n9. Security measures\n10. Contact and complaints\n\nNote: This is a template. Have a qualified lawyer review before publishing.",
      gemini: "GDPR privacy policy for [company] - [product]: data collected=[data_types], legal basis, user rights, retention, cookies. Compliance-focused.",
      grok: "Privacy policy for [product]: GDPR sections — data collected, legal basis, user rights, contact.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
  {
    slug: "CON-FIN-001", title: "Financial Report Narrative",
    base_prompt: "Write a clear, executive-friendly narrative explaining financial data and key variances",
    category: "Content Generation", sub_category: "Finance", prompt_type: "Report",
    tags: ["finance", "report", "variance analysis", "executive", "narrative", "business"],
    source: "curated", quality_score: 5, tested: false,
    platforms: {
      chatgpt: "Act as a senior financial analyst. Write a clear narrative for the following financial results.\n\nPeriod: [period]\nRevenue: [revenue] (vs target: [revenue_target])\nCosts: [costs]\nEBITDA: [ebitda]\nKey variances: [variances]\n\nNarrative structure:\n1. Performance headline (1 sentence, numbers-first)\n2. Revenue analysis (drivers, mix, notable wins/losses)\n3. Cost analysis (opex vs capex, major movements)\n4. EBITDA bridge explanation\n5. Outlook for next period\n6. 3 management actions recommended\n\nTone: factual, confident, no jargon. For [audience] audience.",
      gemini: "Financial narrative for [period]: revenue vs target, cost analysis, EBITDA bridge, outlook, recommendations. For [audience].",
      grok: "Finance narrative: [period] revenue [revenue] vs [revenue_target], costs [costs], EBITDA [ebitda]. Analysis, outlook.",
      midjourney: NA, firefly: NA, flux: NA,
    },
  },
];

// =============================================================================
// INSERT FUNCTION
// =============================================================================

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is not set in .env");

  const sql = postgres(dbUrl, { max: 5 });
  const allPrompts = [...websitePrompts, ...textPrompts, ...contentPrompts];

  console.log(`\n🌱 Seeding ${allPrompts.length} prompts (Website: ${websitePrompts.length}, Text: ${textPrompts.length}, Content: ${contentPrompts.length})`);

  let inserted = 0;
  let skipped  = 0;

  try {
    for (const p of allPrompts) {
      const [row] = await sql`
        INSERT INTO pl_prompts
          (slug, title, base_prompt, category, sub_category, prompt_type,
           tags, source, quality_score, tested)
        VALUES (
          ${p.slug}, ${p.title}, ${p.base_prompt}, ${p.category},
          ${p.sub_category}, ${p.prompt_type},
          ${sql.array(p.tags)}, ${p.source}, ${p.quality_score}, ${p.tested}
        )
        ON CONFLICT (slug) DO NOTHING
        RETURNING id
      `;

      if (!row) { skipped++; continue; }

      const platformRows = Object.entries(p.platforms)
        .filter(([, text]) => text !== "(not applicable)" && text.length > 0)
        .map(([platform, prompt_text]) => ({ prompt_id: row.id, platform, prompt_text }));

      if (platformRows.length > 0) {
        await sql`
          INSERT INTO pl_prompt_platforms ${sql(platformRows, "prompt_id", "platform", "prompt_text")}
          ON CONFLICT (prompt_id, platform) DO NOTHING
        `;
      }

      inserted++;
    }

    console.log(`✅ Done — inserted: ${inserted}, skipped (already exist): ${skipped}`);

    const [{ total }] = await sql`SELECT count(*)::int AS total FROM pl_prompts`;
    const cats = await sql`SELECT category, count(*)::int AS n FROM pl_prompts GROUP BY category ORDER BY n DESC`;
    console.log(`\n📊 Total in database: ${total}`);
    console.log("Categories:");
    cats.forEach(c => console.log(`   ${c.category}: ${c.n}`));

  } finally {
    await sql.end();
  }
}

main().catch(err => { console.error("❌", err.message); process.exit(1); });
