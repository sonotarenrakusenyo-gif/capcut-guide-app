import { useEffect, useState, useMemo } from "react";
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Lightbulb, ArrowLeft } from "lucide-react";
import { normalizeSearchText } from "@/lib/searchNormalize";

const CATEGORY_LABELS: Record<string, string> = {
  basic: "基本操作",
  youtube: "YouTube実践",
  troubleshoot: "トラブル解決",
  advanced: "高度な応用",
};

const CATEGORY_COLORS: Record<string, string> = {
  basic: "bg-blue-500/10 text-blue-400",
  youtube: "bg-red-500/10 text-red-400",
  troubleshoot: "bg-yellow-500/10 text-yellow-400",
  advanced: "bg-purple-500/10 text-purple-400",
};

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const RECENT_KEY = "capcut_recent_searches";

  // trpc.search 内で normalizeSearchText を使った正規化済みフィルタリングが完結しているため、
  // ここでは二重フィルタリングは行わず、そのまま results を使う
  const normalizedQuery = normalizeSearchText(query);
  const { data: results = [] } = trpc.articles.search.useQuery(
    { keyword: query },
    { enabled: normalizedQuery.length >= 1 }
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    setQuery(q);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecentQueries(parsed.filter((v): v is string => typeof v === "string").slice(0, 8));
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  const saveRecentQuery = (value: string) => {
    const v = value.trim();
    if (!v) return;
    const next = [v, ...recentQueries.filter((item) => item !== v)].slice(0, 8);
    setRecentQueries(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    saveRecentQuery(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    window.history.replaceState({}, "", `/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const { data: allArticles = [] } = trpc.articles.getAll.useQuery();

  // ゼロ件時サジェスト：カテゴリーごとに2記事ずつ最大8記事
  const suggestedArticles = useMemo(() => {
    const cats = ["basic", "youtube", "troubleshoot", "advanced"];
    return cats.flatMap((cat) =>
      allArticles.filter((a) => a.categoryId === cat).slice(0, 2)
    );
  }, [allArticles]);

  const showResults = normalizedQuery.length >= 1;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg, #0b1220)", color: "var(--color-fg, #e5e7eb)" }}>
      <div className="container py-8">

        {/* ===== 上部：戻るボタン ===== */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            style={{ color: "var(--color-muted, #94a3b8)", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <ArrowLeft size={16} />
            ホームに戻る
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-fg, #e5e7eb)" }}>検索結果</h1>
          <div className="max-w-xl mb-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="タイトル・本文からリアルタイム検索（カタカナ・ひらがな両対応）"
              autoFocus
            />
          </div>
          {recentQueries.length > 0 && !query && (
            <div className="flex flex-wrap gap-2 mb-3">
              {recentQueries.slice(0, 6).map((item) => (
                <button
                  key={item}
                  type="button"
                  className="px-3 py-1.5 rounded-full bg-accent/10 hover:bg-accent/20 text-xs"
                  onClick={() => handleQueryChange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          {showResults && (
            <p className="text-lg" style={{ color: "var(--color-muted, #94a3b8)" }}>
              「{query}」の検索結果：<span className="font-semibold" style={{ color: "var(--color-fg, #e5e7eb)" }}>{results.length}件</span>
              {results.length > 0 && (
                <span className="text-sm ml-2">
                  （全{["basic","youtube","troubleshoot","advanced"].map(c => {
                    const n = results.filter(a => a.categoryId === c).length;
                    return n > 0 ? `${CATEGORY_LABELS[c]}${n}件` : null;
                  }).filter(Boolean).join(" / ")}）
                </span>
              )}
            </p>
          )}
        </div>

        {showResults && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(article => (
              <Link key={article.id} href={`/article/${article.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.categoryId] ?? "bg-accent/10 text-accent"}`}>
                        {CATEGORY_LABELS[article.categoryId] ?? article.categoryId}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription>{article.difficulty} • {article.readingTime}分</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.description || '詳細を読む'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : showResults ? (
          <div className="py-8">
            {/* ゼロ件メッセージ */}
            <div className="text-center mb-10">
              <p className="text-lg text-muted-foreground mb-1">
                「{query}」に一致する記事が見つかりません
              </p>
              <p className="text-sm text-muted-foreground">
                別のキーワードや、カタカナ・ひらがな表記を変えてお試しください
              </p>
            </div>

            {/* サジェスト */}
            {suggestedArticles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-base font-semibold">こちらの記事はいかがですか？</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {suggestedArticles.map((article) => (
                    <Link key={article.id} href={`/article/${article.id}`}>
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full border-border/50 hover:border-accent/40">
                        <CardHeader className="pb-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${CATEGORY_COLORS[article.categoryId] ?? "bg-accent/10 text-accent"}`}>
                            {CATEGORY_LABELS[article.categoryId] ?? article.categoryId}
                          </span>
                          <CardTitle className="text-sm line-clamp-2 mt-1">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-muted-foreground line-clamp-2">{article.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                <div className="text-center">
                  <Button variant="outline" onClick={() => setLocation('/')}>
                    ホームに戻る
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: "var(--color-muted, #94a3b8)" }}>
            キーワードを入力して検索してください
          </div>
        )}

        {/* ===== 下部：戻るボタン ===== */}
        <div className="mt-12 pt-6 flex justify-center" style={{ borderTop: "1px solid var(--color-border, #334155)" }}>
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--color-fg, #e5e7eb)",
              borderColor: "var(--color-border, #334155)",
            }}
          >
            <ArrowLeft size={16} />
            ホームに戻る
          </Button>
        </div>

      </div>
    </div>
  );
}
