import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Zap, Play, AlertCircle, Sparkles, UserCircle2, ArrowUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { normalizeSearchText } from "@/lib/searchNormalize";

const categories = [
  {
    id: "basic",
    name: "基本操作",
    description: "CapCutの基本的な使い方から初めてのプロジェクト作成まで",
    icon: Zap,
    gradient: "gradient-blue-cyan",
  },
  {
    id: "youtube",
    name: "YouTube実践",
    description: "YouTubeの動画制作に特化したテクニックと視聴者を惹きつけるエフェクト",
    icon: Play,
    gradient: "gradient-red-pink",
  },
  {
    id: "troubleshoot",
    name: "トラブル解決",
    description: "CapCut使用時によくある問題と解決方法をまとめています",
    icon: AlertCircle,
    gradient: "gradient-yellow-orange",
  },
  {
    id: "advanced",
    name: "高度な応用",
    description: "プロレベルの動画編集テクニックと高度なエフェクト",
    icon: Sparkles,
    gradient: "gradient-purple-pink",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { data: articles = [] } = trpc.articles.getAll.useQuery();
  const RECENT_KEY = "capcut_recent_searches";
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    (articles || []).forEach((a) => {
      map[a.categoryId] = (map[a.categoryId] || 0) + 1;
    });
    return map;
  }, [articles]);

  const suggestions = useMemo(() => {
    const normalized = normalizeSearchText(searchQuery);
    if (!normalized || normalized.length < 2) return [];
    return (articles || [])
      .filter((article) =>
        normalizeSearchText(
          `${article.title ?? ""} ${article.description ?? ""} ${article.content ?? ""}`
        ).includes(normalized)
      )
      .slice(0, 8);
  }, [articles, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
      setLocation(`/article/${suggestions[activeSuggestionIndex].id}`);
      return;
    }

    saveRecentQuery(q);
    setLocation(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSelectSuggestion = (articleId: string) => {
    if (searchQuery.trim()) {
      saveRecentQuery(searchQuery.trim());
    }
    setLocation(`/article/${articleId}`);
  };

  const saveRecentQuery = (query: string) => {
    const next = [query, ...recentQueries.filter((item) => item !== query)].slice(0, 8);
    setRecentQueries(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const clearRecentQueries = () => {
    setRecentQueries([]);
    localStorage.removeItem(RECENT_KEY);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecentQueries(parsed.filter((v): v is string => typeof v === "string").slice(0, 8));
      }
    } catch {
      // ignore malformed localStorage data
    }
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev >= suggestions.length - 1 ? 0 : prev + 1
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
      return;
    }

    if (e.key === "Escape") {
      setActiveSuggestionIndex(-1);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ナビゲーションヘッダー */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <h1 className="text-xl font-bold">CapCut完全攻略</h1>
          </div>
          <nav className="flex items-center gap-2">
            <a
              href="/mypage"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(37,99,235,0.15)",
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid #3b82f6",
                fontSize: 13,
                fontWeight: 600,
                color: "#93c5fd",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
            >
              <UserCircle2 size={14} />
              マイページ
            </a>
            <a
              href="/favorites"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(236,72,153,0.12)",
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid #ec4899",
                fontSize: 13,
                fontWeight: 600,
                color: "#f9a8d4",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
            >
              ♡ お気に入り
            </a>
            <a
              href="/roadmap"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(139,92,246,0.15)",
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid #8b5cf6",
                fontSize: 13,
                fontWeight: 600,
                color: "#c4b5fd",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
            >
              🗺 ロードマップ
            </a>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container py-12 md:py-20">
        {/* ヒーロー セクション */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-pink-500 bg-clip-text text-transparent">
            CapCutを完全にマスターしよう
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            基本操作から高度なテクニックまで、CapCutのすべてを学べるナレッジベース。
            初心者から上級者まで、あなたのレベルに合わせた学習が可能です。
          </p>

          {/* 検索バー */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative text-left">
              <Input
                type="text"
                placeholder="キーワードで検索（例：文字、ズレる、トランジション）"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveSuggestionIndex(-1);
                }}
                onKeyDown={handleInputKeyDown}
                className="pl-12 pr-4 py-3 text-base rounded-full border-2 border-accent/30 focus:border-accent bg-card hover-glow"
                autoComplete="off"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                検索
              </Button>
            </div>
            {searchQuery.trim() && normalizeSearchText(searchQuery).length < 2 && (
              <p className="mt-2 text-xs text-muted-foreground">候補表示は2文字以上で有効になります。</p>
            )}
            {searchQuery.trim() && suggestions.length > 0 && (
              <div className="mt-2 rounded-xl border border-border bg-card/95 backdrop-blur shadow-lg overflow-hidden">
                {suggestions.map((article, index) => (
                  <button
                    key={article.id}
                    type="button"
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      index === activeSuggestionIndex
                        ? "bg-accent/15"
                        : "hover:bg-accent/10"
                    }`}
                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                    onClick={() => handleSelectSuggestion(article.id)}
                  >
                    <p className="text-sm font-medium line-clamp-1">{article.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {article.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
            {!searchQuery.trim() && recentQueries.length > 0 && (
              <div className="mt-3 text-left">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">最近の検索</p>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={clearRecentQueries}
                  >
                    履歴をクリア
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentQueries.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="px-3 py-1.5 rounded-full bg-accent/10 hover:bg-accent/20 text-xs"
                      onClick={() => {
                        setSearchQuery(item);
                        setActiveSuggestionIndex(-1);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          <p className="text-sm text-muted-foreground">
            {(articles || []).length}個の記事から検索
          </p>
        </section>

        {/* カテゴリーセクション */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-8">カテゴリーから探す</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="overflow-hidden hover-lift cursor-pointer border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300"
                  style={{
                    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                    border: "1px solid #334155",
                    cursor: "pointer",
                  }}
                  onClick={() => setLocation(`/category/${category.id}`)}
                >
                  <div
                    style={{
                      height: 92,
                      background:
                        category.id === "basic"
                          ? "linear-gradient(90deg,#2563eb,#06b6d4)"
                          : category.id === "youtube"
                          ? "linear-gradient(90deg,#ef4444,#ec4899)"
                          : category.id === "troubleshoot"
                          ? "linear-gradient(90deg,#f59e0b,#f97316)"
                          : "linear-gradient(90deg,#8b5cf6,#ec4899)",
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-accent" />
                      <h4 className="font-bold text-lg">{category.name}</h4>
                      <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.85 }}>
                        {categoryCounts[category.id] ?? 0}記事
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setLocation(`/category/${category.id}`)}
                    >
                      詳しく見る
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 人気記事セクション */}
        <section>
          <h3 className="text-2xl font-bold mb-8">人気の記事</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(articles || []).slice(0, 6).map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover-lift cursor-pointer border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300"
                onClick={() => setLocation(`/article/${article.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                      {article.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {article.readingTime}分
                    </span>
                  </div>
                  <h4 className="font-bold text-base mb-2 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>👁 {(article.views ?? 0).toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setLocation(`/article/${article.id}`)}
                    >
                      読む →
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* ページトップに戻るボタン */}
      <div className="flex justify-center py-10 border-t border-border/30">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-full max-w-sm h-14 text-base font-semibold rounded-2xl gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white transition-all shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
          ページの一番上に戻る
        </Button>
      </div>

      {/* フッター */}
      <footer className="border-t border-border mt-0 py-6 bg-card/30">
        <div className="container text-center text-sm text-muted-foreground space-y-1">
          <p className="font-medium">CapCut完全攻略アプリ</p>
          <p>© 2024 CapCut完全攻略. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
