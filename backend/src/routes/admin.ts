import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db/client.js";
import { bulkImports, prompts, promptPlatforms } from "../db/schema.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = new Hono();

router.use("*", requireAuth, requireAdmin);

// ─── Bulk Import ──────────────────────────────────────────────────────────────

const columnMapSchema = z.object({
  title: z.string(),
  family: z.string(),
  basePrompt: z.string(),
  categoryId: z.string().optional(),
  qualityScore: z.string().optional(),
  testedOn: z.string().optional(),
});

const bulkRowSchema = z.object({
  title: z.string().min(1),
  family: z.enum(["image", "video", "text", "content"]),
  basePrompt: z.string().min(1),
  categoryId: z.string().optional(),
  qualityScore: z.coerce.number().int().min(0).max(100).optional(),
  platforms: z.record(z.string()).optional(),
});

router.post("/import/start", zValidator("json", z.object({
  filename: z.string(),
  columnMap: columnMapSchema,
  rows: z.array(z.record(z.string())),
})), async (c) => {
  const { filename, columnMap, rows } = c.req.valid("json");
  const adminId = c.get("user").sub;
  const importId = nanoid();

  await db.insert(bulkImports).values({
    id: importId,
    adminId,
    filename,
    rowCount: rows.length,
    columnMap,
    status: "processing",
  });

  // Process rows
  let imported = 0;
  const errors: { row: number; error: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const mapped = {
      title: raw[columnMap.title],
      family: raw[columnMap.family],
      basePrompt: raw[columnMap.basePrompt],
      categoryId: columnMap.categoryId ? raw[columnMap.categoryId] : undefined,
      qualityScore: columnMap.qualityScore ? Number(raw[columnMap.qualityScore]) : undefined,
    };

    const parsed = bulkRowSchema.safeParse(mapped);
    if (!parsed.success) {
      errors.push({ row: i + 1, error: parsed.error.issues[0].message });
      continue;
    }

    try {
      const promptId = nanoid();
      await db.insert(prompts).values({
        id: promptId,
        authorId: adminId,
        ...parsed.data,
        status: "approved",
      });
      imported++;
    } catch (e) {
      errors.push({ row: i + 1, error: String(e) });
    }
  }

  await db
    .update(bulkImports)
    .set({
      importedCount: imported,
      errorCount: errors.length,
      errors,
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(bulkImports.id, importId));

  return c.json({ importId, imported, errors });
});

router.get("/import/:id", async (c) => {
  const id = c.req.param("id");
  const [row] = await db.select().from(bulkImports).where(eq(bulkImports.id, id)).limit(1);
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

export default router;
