import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: favorites = [] } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      // Invalidate the list query to refetch
      utils.favorites.list.invalidate();
      toast.success("お気に入りから削除しました");
    },
    onError: () => {
      toast.error("削除に失敗しました");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <h1 className="text-xl font-bold">CapCut完全攻略</h1>
            </div>
          </div>
        </header>

        <main className="container py-12 flex items-center justify-center min-h-[60vh]">
          <Card className="p-12 text-center border-0 bg-card/50 max-w-md">
            <h2 className="text-2xl font-bold mb-4">ログインが必要です</h2>
            <p className="text-muted-foreground mb-8">
              お気に入り機能を使用するには、ログインしてください。
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setLocation("/login")}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                ログインする
              </Button>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="w-full"
              >
                ホームに戻る
              </Button>
            </div>
          </Card>
        </main>
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
            <a href="/favorites" className="hover:text-accent transition-colors font-semibold">
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

        {/* ページタイトル */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">お気に入り</h1>
          <p className="text-lg text-muted-foreground">
            保存した記事一覧（{favorites.length}件）
          </p>
        </div>

        {/* お気に入り一覧 */}
        {favorites.length === 0 ? (
          <Card className="p-12 text-center border-0 bg-card/50">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">お気に入りはまだありません</h2>
            <p className="text-muted-foreground mb-8">
              記事を読んで、気に入った記事をお気に入りに追加してください。
            </p>
            <Button onClick={() => setLocation("/")} variant="default">
              記事を探す
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300"
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
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => setLocation(`/article/${article.id}`)}
                    >
                      読む
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        removeFavoriteMutation.mutate({ articleId: article.id });
                      }}
                      disabled={removeFavoriteMutation.isPending}
                      title="お気に入りから削除"
                      className="hover:text-red-500"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
