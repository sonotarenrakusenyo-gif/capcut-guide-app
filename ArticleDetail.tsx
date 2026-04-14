import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Bookmark } from "lucide-react";
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
              <span className="text-xs text-muted-foreground">
                👁 {(article?.views ?? 0).toLocaleString()}
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
        </div>

        {/* 記事コンテンツ */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 border-0 bg-card/50 backdrop-blur">
            <div className="prose prose-invert max-w-none">
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
                      <Button variant="ghost" size="sm" className="text-xs">
                        読む →
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
