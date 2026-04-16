import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Bookmark, Map } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import {
  getBookmarkedArticleIds,
  getLikedArticleIds,
  toggleBookmarkedArticle,
  toggleLikedArticle,
} from "@/lib/localEngagement";

export default function ArticleDetail() {
  const [location, setLocation] = useLocation();
  const articleId = location.split("/")[2];
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: article } = trpc.articles.getById.useQuery(
    { id: articleId },
    { enabled: !!articleId }
  );

  const { data: relatedArticles = [] } = trpc.articles.getByCategory.useQuery(
    { categoryId: article?.categoryId || "" },
    { enabled: !!article?.categoryId }
  );

  useEffect(() => {
    setIsLiked(getLikedArticleIds().includes(articleId));
    setIsBookmarked(getBookmarkedArticleIds().includes(articleId));
  }, [articleId]);

  const handleToggleLike = () => {
    const next = toggleLikedArticle(articleId);
    const liked = next.includes(articleId);
    setIsLiked(liked);
    toast.success(liked ? "いいねしました" : "いいねを解除しました");
  };

  const handleToggleBookmark = () => {
    const next = toggleBookmarkedArticle(articleId);
    const bookmarked = next.includes(articleId);
    setIsBookmarked(bookmarked);
    toast.success(bookmarked ? "ブックマークに追加しました" : "ブックマークを解除しました");
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">記事を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
            <a href="/mypage" className="hover:text-accent transition-colors">
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

      <main className="container py-12 overflow-x-hidden">
        {/* 上部：カテゴリー一覧に戻るボタン */}
        <Button
          variant="ghost"
          onClick={() => setLocation(article?.categoryId ? `/category/${article.categoryId}` : "/")}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          記事一覧に戻る
        </Button>

        {/* 記事ヘッダー */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                {article?.difficulty}
              </span>
              <span className="text-xs text-muted-foreground">
                {article?.readingTime}分で読める
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleToggleLike}
                className="gap-2"
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "いいね済み" : "いいね！"}
              </Button>
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={handleToggleBookmark}
                className="gap-2"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                {isBookmarked ? "保存済み" : "ブックマーク"}
              </Button>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{article?.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {article?.description}
          </p>

          {/* 解説画像 */}
          {article?.image && (
            <div className="mb-8 w-full overflow-hidden">
              <img
                src={article.image}
                alt={article?.title}
                style={{ maxWidth: "100%", width: "100%", height: "auto", display: "block" }}
                className="rounded-2xl border border-border/40 shadow-lg"
              />
            </div>
          )}
        </div>

        {/* 記事コンテンツ */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 border-0 bg-card/50 backdrop-blur">
            <div className="prose prose-invert max-w-none prose-img:rounded-xl prose-img:border prose-img:border-border/40 prose-img:shadow-sm [&_img]:max-w-full [&_img]:w-full [&_img]:h-auto [&_img]:block">
              <Streamdown>{article?.content || ''}</Streamdown>
            </div>
          </Card>
        </div>

        {/* 関連記事 */}
        {relatedArticles.length > 0 && (
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-8">同じカテゴリーの記事</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles
                .filter((a) => a.id !== articleId)
                .slice(0, 2)
                .map((relatedArticle) => (
                  <Card
                    key={relatedArticle.id}
                    className="overflow-hidden hover-lift cursor-pointer border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300"
                    onClick={() => setLocation(`/article/${relatedArticle.id}`)}
                  >
                    <div className="p-6">
                      <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                        {relatedArticle.difficulty}
                      </span>
                      <h3 className="font-bold text-base mt-3 mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {relatedArticle.description}
                      </p>
                      <Button
                        size="sm"
                        className="text-xs font-semibold rounded-full px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white border-0 shadow-sm"
                      >
                        読む →
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* 記事最下部：ナビゲーション */}
        <div className="max-w-3xl mx-auto mt-12 pb-8">
          <div className="border-t border-border/40 pt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">この記事を読み終えました</p>

            {/* 横並びの2ボタン */}
            <div className="flex gap-3 w-full max-w-sm">
              <Button
                onClick={() => setLocation(article?.categoryId ? `/category/${article.categoryId}` : "/")}
                variant="outline"
                className="flex-1 h-12 text-sm font-semibold rounded-2xl gap-1.5 border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                記事一覧
              </Button>
              <Button
                onClick={() => setLocation("/roadmap")}
                className="flex-1 h-12 text-sm font-semibold rounded-2xl gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 shadow-md"
              >
                <Map className="w-4 h-4" />
                ロードマップ
              </Button>
            </div>

            {/* ホームはテキストリンク */}
            <button
              onClick={() => setLocation("/")}
              className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
