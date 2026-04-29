import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutGrid, List, Star, Copy, CheckCircle2, X,
  Search, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { platforms, familyMeta, type Family } from "../theme";
import { libraryApi, type LibraryPrompt } from "../../lib/api";
import { promptImageMap } from "../../lib/prompt-images";
import { imageLibraryPrompts } from "../../lib/library-data";
import { PromptCard } from "../PromptCard";

const PAGE_SIZE = 20;

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryRow { category: string; count: number }

// Map API prompt → PromptCard-compatible shape
function toCardItem(p: LibraryPrompt) {
  return {
    id:       String(p.id),
    slug:     p.slug,
    title:    p.title,
    description: p.base_prompt.slice(0, 120) + (p.base_prompt.length > 120 ? "…" : ""),
    category: p.category,
    family:   "image" as const,
    tags:     p.tags,
    tested:   p.tested,
    rating:   p.quality_score,
    reviews:  0,
    image:    (p as any).image_url ?? promptImageMap[p.slug] ?? "",
    platforms: {} as Record<string, string>,
    variables: [],
    author: "PromptVault",
    subCategory: (p as any).sub_category ?? "",
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function Library({ go, family }: { go: (p: string) => void; family?: Family | null }) {
  const [view, setView]         = useState<"grid" | "list">("grid");
  const [cat, setCat]           = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [sortBy, setSortBy]     = useState<"latest" | "score">("latest");
  const [page, setPage]         = useState(1);
  const [query, setQuery]       = useState("");
  const [inputVal, setInputVal] = useState("");

  const [prompts, setPrompts]     = useState<LibraryPrompt[]>([]);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [useFallback, setUseFallback] = useState(false);
  const [searchMode, setSearchMode]   = useState<string | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load categories once ──────────────────────────────────────────────────
  useEffect(() => {
    libraryApi.categories()
      .then(setCategories)
      .catch(() => setUseFallback(true));
  }, []);

  // ── Reset filters when family changes ────────────────────────────────────
  useEffect(() => { setCat(null); setPlatform(null); setPage(1); setQuery(""); setInputVal(""); }, [family]);

  // ── Debounce search input ────────────────────────────────────────────────
  const handleInput = (val: string) => {
    setInputVal(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setQuery(val.trim());
      setPage(1);
    }, 350);
  };

  // ── Fetch prompts when deps change ───────────────────────────────────────
  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    setSearchMode(null);
    try {
      const params = {
        category: cat ?? undefined,
        page,
        limit: PAGE_SIZE,
      };

      if (query.length >= 2) {
        const res = await libraryApi.search({ q: query, ...params });
        setPrompts(res.data);
        setTotal(res.total);
        setPages(res.pages);
        setSearchMode(res.mode);
      } else {
        const res = await libraryApi.list(params);
        setPrompts(res.data);
        setTotal(res.total);
        setPages(res.pages);
      }
      setUseFallback(false);
    } catch {
      setUseFallback(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [query, cat, page]);

  useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

  // ── Reset page when filter changes ──────────────────────────────────────
  const handleCatChange = (c: string | null) => { setCat(c); setPage(1); };

  const meta = family ? familyMeta[family] : null;

  // imageLibraryPrompts only has image-generation data.
  // Other families have no static data yet — show "coming soon" instead.
  const isImageFamily = !family || family === "image";

  // ── Fallback: filter imageLibraryPrompts locally ─────────────────────────
  // All 350 image prompts support all 6 platforms, so platform filter
  // doesn't reduce the count — it only sets the preferred view in Detail.
  const fallbackFiltered = isImageFamily
    ? imageLibraryPrompts.filter(p =>
        (!cat || p.category === cat) &&
        (!query || p.title.toLowerCase().includes(query.toLowerCase()) ||
                   p.description.toLowerCase().includes(query.toLowerCase()))
      )
    : [];
  const fallbackPage   = fallbackFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const fallbackPages  = Math.ceil(fallbackFiltered.length / PAGE_SIZE);

  // ── Determine items to render ────────────────────────────────────────────
  const displayItems  = useFallback ? fallbackPage : prompts.map(toCardItem);
  const displayTotal  = useFallback ? fallbackFiltered.length : total;
  const displayPages  = useFallback ? fallbackPages : pages;

  // ── Sort client-side for both sources ────────────────────────────────────
  const sorted = [...displayItems].sort((a, b) => {
    if (sortBy === "score") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  // ── Category list — only meaningful for image family ─────────────────────
  const staticCats = Array.from(
    imageLibraryPrompts.reduce((m, p) => {
      m.set(p.category, (m.get(p.category) ?? 0) + 1);
      return m;
    }, new Map<string, number>())
  ).map(([category, count]) => ({ category, count }));

  const catList = isImageFamily
    ? (categories.length > 0 ? categories : staticCats)
    : [];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 text-[#094067]">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[#094067] text-3xl">{meta ? meta.title : "Prompt Library"}</h1>
            {meta && (
              <button
                onClick={() => go("library")}
                className="inline-flex items-center gap-1 h-8 px-3 rounded-full border-2 border-[#094067] bg-white text-[#094067] text-[13px]"
                style={{ fontWeight: 600 }}
              >
                <X className="w-3.5 h-3.5" /> All prompts
              </button>
            )}
          </div>
          <p className="text-[#5f6c7b] mt-0.5">
            {loading
              ? "Loading…"
              : `${displayTotal.toLocaleString()} prompt${displayTotal !== 1 ? "s" : ""}${cat ? ` in ${cat}` : ""}${platform ? ` · ${platforms.find(p => p.key === platform)?.name ?? platform}` : ""}`}
            {searchMode === "fuzzy" && (
              <span className="ml-2 text-[11px] px-2 py-0.5 bg-[#ffd803]/40 text-[#094067] rounded-full">fuzzy match</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "latest" | "score")}
            className="h-9 px-3 rounded-lg bg-[#094067]/5 border border-[#094067]/20 text-[#094067]"
          >
            <option value="latest">Latest</option>
            <option value="score">Highest score</option>
          </select>
          <div className="flex rounded-lg border border-[#094067]/20 overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-2 ${view==="grid"?"bg-[#094067]/10":"bg-transparent"}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-2 ${view==="list"?"bg-[#094067]/10":"bg-transparent"}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* ── Search bar ─────────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6c7b]" />
        <input
          type="text"
          placeholder="Search prompts…"
          value={inputVal}
          onChange={(e) => handleInput(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#094067]/20 bg-white text-[#094067] placeholder:text-[#5f6c7b]/60 focus:outline-none focus:border-[#094067]/50"
        />
        {inputVal && (
          <button
            onClick={() => { setInputVal(""); setQuery(""); setPage(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6c7b] hover:text-[#094067]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* ── Sidebar filters ──────────────────────────────────────────── */}
        <aside className="space-y-6">
          <FilterGroup title="Category">
            <FilterPill active={cat===null} onClick={() => handleCatChange(null)}>All</FilterPill>
            {catList.map(c => (
              <FilterPill key={c.category} active={cat===c.category} onClick={() => handleCatChange(c.category)}>
                {c.category}
                <span className="ml-1 text-[11px] opacity-60">({c.count})</span>
              </FilterPill>
            ))}
          </FilterGroup>
          <FilterGroup title="Platform">
            <FilterPill active={platform === null} onClick={() => { setPlatform(null); setPage(1); }}>All</FilterPill>
            {platforms.map(pl => (
              <FilterPill key={pl.key} active={platform === pl.key} onClick={() => { setPlatform(pl.key); setPage(1); }}>
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: pl.color }} />
                {pl.name}
              </FilterPill>
            ))}
          </FilterGroup>
        </aside>

        {/* ── Prompt grid / list ───────────────────────────────────────── */}
        <main>
          {/* Coming-soon placeholder for families with no data yet */}
          {!loading && !isImageFamily && sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ffd803]/30 to-[#094067]/10 flex items-center justify-center text-4xl">
                ✦
              </div>
              <h3 className="text-[#094067] text-xl" style={{ fontWeight: 700 }}>
                {meta?.title ?? "Prompts"} coming soon
              </h3>
              <p className="text-[#5f6c7b] text-center max-w-sm">
                We're curating a hand-picked collection of {meta?.title?.toLowerCase() ?? "prompts"}.
                Check back soon — or{" "}
                <button onClick={() => go("submit")} className="text-[#ef4565] underline">
                  submit your own
                </button>
                .
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-24 text-[#5f6c7b]">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading prompts…
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#5f6c7b] gap-3">
              <Search className="w-10 h-10 opacity-30" />
              <p>No prompts found{query ? ` for "${query}"` : ""}.</p>
              {query && (
                <button
                  onClick={() => { setInputVal(""); setQuery(""); }}
                  className="text-[#ef4565] underline text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map(p => (
                <PromptCard key={p.id} p={p as any} onClick={() => go("detail:" + p.id + (platform ? ":" + platform : ""))} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#094067]/15 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#094067]/5 text-[#5f6c7b]">
                  <tr>
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Score</th>
                    <th className="text-left p-3">Status</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(p => (
                    <tr key={p.id} className="border-t border-[#094067]/15 hover:bg-[#094067]/5 cursor-pointer" onClick={() => go("detail:" + p.id + (platform ? ":" + platform : ""))}>
                      <td className="p-3 text-[#094067]" style={{ fontWeight: 600 }}>{p.title}</td>
                      <td className="p-3 text-[#5f6c7b]">{p.category}</td>
                      <td className="p-3"><span className="inline-flex items-center gap-1 text-[#094067]"><Star className="w-4 h-4 fill-[#ffd803] text-[#ef4565]" />{p.rating}</span></td>
                      <td className="p-3">{(p as any).tested && <span className="inline-flex items-center gap-1 text-[#ef4565]"><CheckCircle2 className="w-4 h-4" />tested</span>}</td>
                      <td className="p-3 text-right"><Copy className="w-4 h-4 text-[#ef4565] inline" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ─────────────────────────────────────────────── */}
          {displayPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-[#094067]/20 disabled:opacity-30 hover:bg-[#094067]/5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.min(displayPages, 7) }, (_, i) => {
                const n = page <= 4 ? i + 1 : page - 3 + i;
                if (n < 1 || n > displayPages) return null;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg border text-sm ${n === page ? "bg-[#094067] text-white border-[#094067]" : "border-[#094067]/20 text-[#094067] hover:bg-[#094067]/5"}`}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                disabled={page >= displayPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-[#094067]/20 disabled:opacity-30 hover:bg-[#094067]/5"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: any) {
  return (
    <div>
      <div className="text-[#094067] mb-3" style={{ fontWeight: 600 }}>{title}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-[13px] ${active ? "bg-[#ffd803] text-[#094067] border-[#ffd803]" : "border-[#094067]/20 text-[#5f6c7b] hover:text-[#094067] hover:border-[#094067]/30"}`}
    >
      {children}
    </button>
  );
}
