import { useEffect, useMemo, useState } from "react";
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { normalizeSearchText } from "@/lib/searchNormalize";

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const RECENT_KEY = "capcut_recent_searches";

  // 全記事を取得
  const { data: articles = [] } = trpc.articles.getAll.useQuery();

  useEffect(() => {
    // URLからクエリパラメータを取得
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

  const filteredArticles = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return [];

    return (articles || []).filter((article) => {
      const searchable = normalizeSearchText(
        `${article.title ?? ""} ${article.description ?? ""} ${article.content ?? ""}`
      );
      return searchable.includes(normalizedQuery);
    });
  }, [articles, query]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">検索結果</h1>
          <div className="max-w-xl mb-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="タイトル・本文からリアルタイム検索"
            />
          </div>
          {recentQueries.length > 0 && (
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
          <p className="text-lg text-muted-foreground">
            「{query}」の検索結果：{filteredArticles.length}件
          </p>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <Link key={article.id} href={`/article/${article.id}`}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow h-full"
              >
                <CardHeader>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              検索結果が見つかりません
            </p>
            <Button onClick={() => setLocation('/')}>
              ホームに戻る
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
