/**
 * prompt-library.ts
 * -----------------
 * REST API for the imported prompt library.
 *
 * Endpoints:
 *   GET  /api/library/prompts          – paginated list with filters
 *   GET  /api/library/prompts/search   – full-text + fuzzy search
 *   GET  /api/library/prompts/:id      – single prompt + all platform versions
 *   GET  /api/library/categories       – distinct category list
 *   GET  /api/library/tags             – top N tags by frequency
 */

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db/client.js";
import { sql } from "drizzle-orm";

const router = new Hono();

// ─── Shared query helpers ─────────────────────────────────────────────────────

/**
 * Runs a raw SQL query directly via the underlying postgres.js client.
 * Drizzle doesn't have the pl_* tables in its schema, so we use raw SQL
 * for the prompt-library routes.
 */
async function rawSql<T = Record<string, unknown>>(query: string): Promise<T[]> {
  const result = await db.execute(sql.raw(query));
  return result as unknown as T[];
}

// ─── GET /api/library/categories ─────────────────────────────────────────────

router.get("/categories", async (c) => {
  const rows = await rawSql<{ category: string; count: number }>(`
    SELECT category, count(*)::int AS count
    FROM   pl_prompts
    GROUP  BY category
    ORDER  BY count DESC
  `);
  return c.json(rows);
});

// ─── GET /api/library/tags?limit=30 ──────────────────────────────────────────

router.get("/tags", zValidator("query", z.object({ limit: z.coerce.number().default(30) })), async (c) => {
  const { limit } = c.req.valid("query");
  const rows = await rawSql<{ tag: string; count: number }>(`
    SELECT tag, count(*)::int AS count
    FROM   pl_prompts, unnest(tags) AS tag
    GROUP  BY tag
    ORDER  BY count DESC
    LIMIT  ${limit}
  `);
  return c.json(rows);
});

// ─── Query params schema (shared by list + search) ───────────────────────────

const listSchema = z.object({
  category: z.string().optional(),
  tags:     z.string().optional(),  // comma-separated
  page:     z.coerce.number().int().min(1).default(1),
  limit:    z.coerce.number().int().min(1).max(100).default(20),
});

const searchSchema = listSchema.extend({
  q:    z.string().min(1),
  mode: z.enum(["fulltext", "fuzzy", "both"]).default("both"),
});

// ─── GET /api/library/prompts ─────────────────────────────────────────────────

router.get("/prompts", zValidator("query", listSchema), async (c) => {
  const { category, tags, page, limit } = c.req.valid("query");
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  if (category) conditions.push(`category = '${category.replace(/'/g, "''")}'`);
  if (tags) {
    const tagArr = tags.split(",").map(t => `'${t.trim().replace(/'/g, "''")}'`).join(",");
    conditions.push(`tags && ARRAY[${tagArr}]::text[]`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows, [{ total }]] = await Promise.all([
    rawSql<Record<string, unknown>>(`
      SELECT id, slug, title, base_prompt, category, sub_category,
             prompt_type, tags, quality_score, tested, image_url, created_at
      FROM   pl_prompts
      ${where}
      ORDER  BY id
      LIMIT  ${limit} OFFSET ${offset}
    `),
    rawSql<{ total: number }>(`SELECT count(*)::int AS total FROM pl_prompts ${where}`),
  ]);

  return c.json({ data: rows, total, page, limit, pages: Math.ceil(total / limit) });
});

// ─── GET /api/library/prompts/search ─────────────────────────────────────────
// Strategy:
//   1. Full-text search  → uses GIN index on search_vec, very fast
//   2. Fuzzy fallback    → uses pg_trgm similarity on title, catches typos
//   3. Tag filter        → array overlap  &&  operator

router.get("/prompts/search", zValidator("query", searchSchema), async (c) => {
  const { q, mode, category, tags, page, limit } = c.req.valid("query");
  const offset = (page - 1) * limit;

  const safeQ    = q.replace(/'/g, "''");
  const catWhere = category ? `AND category = '${category.replace(/'/g, "''")}'` : "";
  const tagWhere = tags
    ? `AND tags && ARRAY[${tags.split(",").map(t => `'${t.trim().replace(/'/g, "''")}'`).join(",")}]::text[]`
    : "";

  let rows: Record<string, unknown>[] = [];
  let total = 0;

  // ── Full-text search (primary) ──────────────────────────────────────────────
  if (mode === "fulltext" || mode === "both") {
    const ftRows = await rawSql<Record<string, unknown>>(`
      SELECT id, slug, title, base_prompt, category, sub_category,
             prompt_type, tags, quality_score, tested, image_url,
             ts_rank(search_vec, plainto_tsquery('english', '${safeQ}')) AS rank
      FROM   pl_prompts
      WHERE  search_vec @@ plainto_tsquery('english', '${safeQ}')
             ${catWhere} ${tagWhere}
      ORDER  BY rank DESC
      LIMIT  ${limit} OFFSET ${offset}
    `);

    const [{ count }] = await rawSql<{ count: number }>(`
      SELECT count(*)::int AS count FROM pl_prompts
      WHERE  search_vec @@ plainto_tsquery('english', '${safeQ}')
             ${catWhere} ${tagWhere}
    `);

    rows  = ftRows;
    total = count;
  }

  // ── Fuzzy fallback (trigram similarity on title) ────────────────────────────
  // Fires when full-text returns 0 results (typos, partial words, etc.)
  if ((mode === "fuzzy" || mode === "both") && rows.length === 0) {
    const fuzzyRows = await rawSql<Record<string, unknown>>(`
      SELECT id, slug, title, base_prompt, category, sub_category,
             prompt_type, tags, quality_score, tested, image_url,
             similarity(title, '${safeQ}') AS rank
      FROM   pl_prompts
      WHERE  similarity(title, '${safeQ}') > 0.15
             ${catWhere} ${tagWhere}
      ORDER  BY rank DESC
      LIMIT  ${limit} OFFSET ${offset}
    `);

    const [{ count }] = await rawSql<{ count: number }>(`
      SELECT count(*)::int AS count FROM pl_prompts
      WHERE  similarity(title, '${safeQ}') > 0.15
             ${catWhere} ${tagWhere}
    `);

    rows  = fuzzyRows;
    total = count;
  }

  return c.json({
    data:   rows,
    total,
    page,
    limit,
    pages:  Math.ceil(total / limit),
    query:  q,
    mode:   rows.length > 0 ? (mode === "both" && rows[0]?.rank ? "fulltext" : "fuzzy") : "none",
  });
});

// ─── GET /api/library/prompts/:id ────────────────────────────────────────────

router.get("/prompts/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid id" }, 400);

  const [[prompt], platforms] = await Promise.all([
    rawSql<Record<string, unknown>>(`
      SELECT id, slug, title, base_prompt, category, sub_category,
             prompt_type, tags, quality_score, tested, image_url, created_at
      FROM   pl_prompts WHERE id = ${id}
    `),
    rawSql<{ platform: string; prompt_text: string }>(`
      SELECT platform, prompt_text
      FROM   pl_prompt_platforms
      WHERE  prompt_id = ${id}
      ORDER  BY platform
    `),
  ]);

  if (!prompt) return c.json({ error: "Not found" }, 404);

  // Reshape platforms into a map: { chatgpt: "...", midjourney: "..." }
  const platformMap = Object.fromEntries(platforms.map(p => [p.platform, p.prompt_text]));

  return c.json({ ...prompt, platforms: platformMap });
});

export default router;
