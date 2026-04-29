import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { config } from "dotenv";

config();

import authRouter from "./routes/auth.js";
import promptsRouter from "./routes/prompts.js";
import submissionsRouter from "./routes/submissions.js";
import profileRouter from "./routes/profile.js";
import adminRouter from "./routes/admin.js";
import promptLibraryRouter from "./routes/prompt-library.js";

const app = new Hono();

// ─── Global Middleware ─────────────────────────────────────────────────────────

app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ─── Routes ────────────────────────────────────────────────────────────────────

app.route("/api/auth", authRouter);
app.route("/api/prompts", promptsRouter);
app.route("/api/submissions", submissionsRouter);
app.route("/api/profile", profileRouter);
app.route("/api/admin", adminRouter);
app.route("/api/library", promptLibraryRouter);

app.get("/health", (c) => c.json({ status: "ok", ts: new Date().toISOString() }));

// ─── Start ─────────────────────────────────────────────────────────────────────

const port = Number(process.env.PORT ?? 3000);
console.log(`PromptVault API running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export default app;
