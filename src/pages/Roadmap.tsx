import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Circle, Lightbulb, ArrowUp, Trophy } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import articlesData from "@/data/articles-data.json";
import {
  getCompletedArticleIds,
  toggleCompletedArticle,
} from "@/lib/localEngagement";

const TOTAL = 66;

type Article = (typeof articlesData.articles)[number] & { image?: string };

const CATEGORIES = [
  { id: "basic",       label: "基本操作",     count: 15, color: "from-blue-500 to-cyan-500",     border: "border-blue-500/40" },
  { id: "youtube",     label: "YouTube実践",  count: 18, color: "from-red-500 to-pink-500",      border: "border-red-500/40" },
  { id: "troubleshoot",label: "トラブル解決", count: 18, color: "from-yellow-500 to-orange-500", border: "border-yellow-500/40" },
  { id: "advanced",    label: "高度な応用",   count: 15, color: "from-purple-500 to-pink-500",   border: "border-purple-500/40" },
];

// カテゴリー内の記事を並び替え
// advanced のみ：画像なし記事を先に、画像付き記事を最後に
// それ以外：画像付き記事を先に
function sortArticles(articles: Article[], categoryId: string): Article[] {
  const withImg    = articles.filter((a) => (a as any).image);
  const withoutImg = articles.filter((a) => !(a as any).image);
  if (categoryId === "advanced") return [...withoutImg, ...withImg];
  return [...withImg, ...withoutImg];
}

export default function Roadmap() {
  const [, setLocation] = useLocation();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  const loadProgress = useCallback(() => {
    setCompletedIds(getCompletedArticleIds());
  }, []);

  useEffect(() => {
    loadProgress();
    window.addEventListener("capcut_progress_changed", loadProgress);
    return () => window.removeEventListener("capcut_progress_changed", loadProgress);
  }, [loadProgress]);

  const completedCount = completedIds.length;
  const progressPct = Math.round((completedCount / TOTAL) * 100);

  const handleToggle = (articleId: string) => {
    const next = toggleCompletedArticle(articleId);
    setCompletedIds(next);
  };

  const allDone = completedCount === TOTAL && !celebrationDismissed;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ===== 全記事完了 祝福オーバーレイ ===== */}
      {allDone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          {/* 紙吹雪（CSS アニメーション） */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-3 opacity-80 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${10 + Math.random() * 10}%`,
                  background: ["#3b82f6","#ec4899","#f59e0b","#10b981","#8b5cf6","#06b6d4"][i % 6],
                  animation: `fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear infinite`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>

          {/* カード */}
          <Card className="relative z-10 mx-4 max-w-sm w-full p-8 text-center border-0 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              完全制覇！
            </h2>
            <p className="text-lg font-semibold text-white mb-1">🎉 おめでとうございます！</p>
            <p className="text-sm text-slate-400 mb-6">
              全 <span className="text-white font-bold">66記事</span> を読破しました。<br />
              あなたはCapCutマスターです！
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setLocation("/")}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold border-0 shadow"
              >
                ホームに戻る
              </Button>
              <button
                onClick={() => setCelebrationDismissed(true)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                閉じる
              </button>
            </div>
          </Card>
        </div>
      )}

      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <h1 className="text-xl font-bold">CapCut完全攻略</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/favorites" className="hover:text-accent transition-colors">お気に入り</a>
            <a href="/roadmap" className="hover:text-accent transition-colors font-semibold">学習ロードマップ</a>
          </nav>
        </div>
      </header>

      <main className="container py-12">
        {/* 戻るボタン */}
        <Button variant="ghost" onClick={() => setLocation("/")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>

        {/* ページタイトル */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">学習ロードマップ</h1>
          <p className="text-lg text-muted-foreground mb-6">
            全66記事を順番に攻略して、CapCutをマスターしよう。
            <span className="inline-flex items-center gap-1 ml-2 text-yellow-400 text-sm font-semibold">
              <Lightbulb className="w-4 h-4" />解説画像あり
            </span>
            は特に重要なメインステップです。
          </p>

          {/* 進捗バー */}
          <Card className="p-6 border-0 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">学習進捗</span>
              <span className="text-sm text-muted-foreground font-mono">
                {completedCount} / {TOTAL} 完了
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{progressPct}% 完了</div>
          </Card>
        </div>

        {/* カテゴリー別記事リスト */}
        <div className="space-y-10">
          {CATEGORIES.map((cat) => {
            const catArticles = sortArticles(
              (articlesData.articles as Article[]).filter((a) => a.categoryId === cat.id),
              cat.id
            );
            const catCompleted = catArticles.filter((a) => completedIds.includes(a.id)).length;

            return (
              <section key={cat.id}>
                {/* カテゴリーヘッダー */}
                <div className={`flex items-center gap-3 mb-4 pb-3 border-b ${cat.border}`}>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${cat.color}`} />
                  <h2 className="text-xl font-bold">{cat.label}</h2>
                  <span className="text-sm text-muted-foreground ml-1">
                    {catCompleted} / {cat.count} 完了
                  </span>
                  <div className="flex-1 ml-2">
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${cat.color} h-full transition-all duration-500`}
                        style={{ width: `${Math.round((catCompleted / cat.count) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 記事リスト */}
                <div className="space-y-2">
                  {catArticles.map((article, idx) => {
                    const hasImage = !!(article as any).image;
                    const isDone = completedIds.includes(article.id);

                    return (
                      <div
                        key={article.id}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                          isDone
                            ? "bg-accent/10 border border-accent/30"
                            : hasImage
                            ? "bg-card/70 border border-yellow-500/20 hover:border-yellow-500/40"
                            : "bg-card/40 border border-border/30 hover:bg-card/60"
                        }`}
                      >
                        {/* 完了アイコン */}
                        <button
                          onClick={() => handleToggle(article.id)}
                          className="flex-shrink-0 focus:outline-none"
                          aria-label={isDone ? "未完了に戻す" : "完了にする"}
                        >
                          {isDone ? (
                            <CheckCircle className="w-5 h-5 text-accent" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>

                        {/* 記事タイトル */}
                        <button
                          className="flex-1 text-left min-w-0"
                          onClick={() => setLocation(`/article/${article.id}`)}
                        >
                          <span className={`text-sm font-medium line-clamp-1 ${isDone ? "line-through text-muted-foreground" : ""}`}>
                            {article.title}
                          </span>
                        </button>

                        {/* 解説画像バッジ */}
                        {hasImage && (
                          <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                            <Lightbulb className="w-3 h-3" />
                            解説画像あり
                          </span>
                        )}

                        {/* 完了トグルボタン */}
                        <Button
                          size="sm"
                          variant={isDone ? "default" : "outline"}
                          onClick={() => handleToggle(article.id)}
                          className={`flex-shrink-0 text-xs whitespace-nowrap h-7 px-3 ${
                            isDone
                              ? "bg-accent/80 hover:bg-accent/60"
                              : "border-border/50 hover:border-accent/50"
                          }`}
                        >
                          {isDone ? "✓ 完了済み" : "完了にする"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>


        {/* 下部ナビゲーション */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-full max-w-sm h-14 text-base font-semibold rounded-2xl gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white transition-all shadow-lg"
          >
            <ArrowUp className="w-5 h-5" />
            ロードマップの一番上に戻る
          </Button>
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-muted-foreground hover:text-foreground text-sm gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ホームに戻る
          </Button>
        </div>
      </main>
    </div>
  );
}
