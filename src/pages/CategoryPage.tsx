import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap, Play, AlertCircle, Sparkles, UserCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const categoryInfo = {
  basic: {
    name: "基本操作",
    description: "CapCutの基本的な使い方から初めてのプロジェクト作成まで、初心者向けのコンテンツです。",
    icon: Zap,
    gradient: "gradient-blue-cyan",
  },
  youtube: {
    name: "YouTube実践",
    description: "YouTubeの動画制作に特化したテクニックと、視聴者を惹きつけるエフェクト活用法。",
    icon: Play,
    gradient: "gradient-red-pink",
  },
  troubleshoot: {
    name: "トラブル解決",
    description: "CapCut使用時によくある問題と、その解決方法をまとめています。",
    icon: AlertCircle,
    gradient: "gradient-yellow-orange",
  },
  advanced: {
    name: "高度な応用",
    description: "プロレベルの動画編集テクニックと、高度なエフェクト・カラーグレーディング。",
    icon: Sparkles,
    gradient: "gradient-purple-pink",
  },
};

export default function CategoryPage() {
  const [location, setLocation] = useLocation();
  const categoryId = location.split("/")[2] as keyof typeof categoryInfo;
  const category = categoryInfo[categoryId];

  const { data: articles = [] } = trpc.articles.getByCategory.useQuery(
    { categoryId },
    { enabled: !!categoryId }
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">カテゴリーが見つかりません</h1>
          <Button onClick={() => setLocation("/")} variant="default">
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

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
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/mypage"
              className="hover:text-accent transition-colors"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(37,99,235,0.15)",
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #3b82f6",
              }}
            >
              <UserCircle2 size={16} />
              マイページ
            </a>
            <a href="/favorites" className="hover:text-accent transition-colors">
              お気に入り
            </a>
            <a href="/roadmap" className="hover:text-accent transition-colors">
              学習ロードマップ
            </a>
          </nav>
        </div>
      </header>

      <main className="container py-12">
        {/* 戻るボタン */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>

        {/* カテゴリーヘッダー */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-3 rounded-lg ${category.gradient}`}
              style={{
                background:
                  categoryId === "basic"
                    ? "linear-gradient(90deg,#2563eb,#06b6d4)"
                    : categoryId === "youtube"
                    ? "linear-gradient(90deg,#ef4444,#ec4899)"
                    : categoryId === "troubleshoot"
                    ? "linear-gradient(90deg,#f59e0b,#f97316)"
                    : "linear-gradient(90deg,#8b5cf6,#ec4899)",
              }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{category.name}</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {category.description}
          </p>
        </div>

        {/* 記事一覧 */}
        <div>
          <h2 className="text-2xl font-bold mb-8">
            {articles.length}個の記事
          </h2>

          {articles.length === 0 ? (
            <Card className="p-12 text-center border-0 bg-card/50">
              <p className="text-muted-foreground">
                このカテゴリーにはまだ記事がありません。
              </p>
            </Card>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="overflow-hidden hover-lift cursor-pointer border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300"
                  style={{ border: "1px solid #334155", cursor: "pointer" }}
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
                    <h3 className="font-bold text-base mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>👁 {(article.views ?? 0).toLocaleString()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                      >
                        読む →
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 一覧最下部：ホームへ戻るボタン */}
        <div className="mt-16 flex justify-center">
          <Button
            onClick={() => setLocation("/")}
            className="w-full max-w-sm h-14 text-base font-semibold rounded-2xl gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            カテゴリー選択（ホーム）に戻る
          </Button>
        </div>
      </main>
    </div>
  );
}
