import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect } from "react";
import articlesData from "@/../../shared/articles-data.json";
import { toast } from "sonner";

export default function Roadmap() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const utils = trpc.useUtils();

  const { data: userProgress = [] } = trpc.progress.getProgress.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const updateProgressMutation = trpc.progress.updateProgress.useMutation({
    onSuccess: () => {
      utils.progress.getProgress.invalidate();
      toast.success("進捗を保存しました");
    },
    onError: () => {
      toast.error("進捗保存に失敗しました");
    },
  });

  useEffect(() => {
    const progressMap: Record<string, boolean> = {};
    userProgress.forEach((p) => {
      progressMap[p.roadmapStepId] = p.completed === 1;
    });
    setProgress(progressMap);
  }, [userProgress]);

  const roadmap = articlesData.roadmap;
  const completedSteps = Object.values(progress).filter(Boolean).length;
  const totalSteps = roadmap.steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  const handleToggleStep = (stepId: string) => {
    if (!isAuthenticated) {
      toast.info("ログインして進捗を追跡してください");
      setLocation("/login");
      return;
    }

    const currentStatus = progress[stepId] || false;
    updateProgressMutation.mutate({
      roadmapStepId: stepId,
      completed: !currentStatus,
    });
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
          <nav className="hidden md:flex items-center gap-6">
            <a href="/favorites" className="hover:text-accent transition-colors">
              お気に入り
            </a>
            <a href="/roadmap" className="hover:text-accent transition-colors font-semibold">
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
          <h1 className="text-4xl font-bold mb-4">初心者向け学習ロードマップ</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {roadmap.description}
          </p>

          {/* 進捗バー */}
          <div className="bg-card/50 rounded-lg p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">学習進捗</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps} / {totalSteps}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {progressPercentage}% 完了
            </div>
          </div>
        </div>

        {/* ロードマップステップ */}
        <div className="space-y-6">
          {roadmap.steps.map((step, index) => {
            const isCompleted = progress[step.id] || false;
            const stepArticles = step.articles.map((articleId) =>
              articlesData.articles.find((a) => a.id === articleId)
            );

            return (
              <Card
                key={step.id}
                className={`overflow-hidden border-0 backdrop-blur transition-all duration-300 cursor-pointer ${
                  isCompleted
                    ? "bg-accent/10 border-l-4 border-accent"
                    : "bg-card/50 hover:bg-card/80"
                }`}
                onClick={() => handleToggleStep(step.id)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* チェックボックス */}
                    <div className="flex-shrink-0 pt-1">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-accent" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>

                    {/* コンテンツ */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">
                          ステップ {index + 1}: {step.title}
                        </h3>
                        <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {step.difficulty}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>

                      {/* 関連記事 */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">
                          関連記事 ({step.articles.length}件)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {stepArticles.map((article) =>
                            article ? (
                              <button
                                key={article.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocation(`/article/${article.id}`);
                                }}
                                className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-3 py-1 rounded-full transition-colors"
                              >
                                {article.title}
                              </button>
                            ) : null
                          )}
                        </div>
                      </div>

                      {/* 推定時間 */}
                      <div className="text-xs text-muted-foreground">
                        ⏱ 推定学習時間: {step.estimatedTime}
                      </div>
                    </div>

                    {/* 完了ボタン */}
                    <div className="flex-shrink-0">
                      <Button
                        variant={isCompleted ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStep(step.id);
                        }}
                        disabled={updateProgressMutation.isPending}
                        className="whitespace-nowrap"
                      >
                        {isCompleted ? "✓ 完了" : "完了にする"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 完了メッセージ */}
        {completedSteps === totalSteps && (
          <Card className="mt-12 p-8 text-center border-0 bg-gradient-to-r from-blue-500/10 to-pink-500/10 backdrop-blur">
            <h2 className="text-3xl font-bold mb-4">
              🎉 ロードマップ完了おめでとうございます！
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              あなたはCapCutの基本をマスターしました。
              次は、より高度なテクニックに挑戦してみましょう！
            </p>
            <Button onClick={() => setLocation("/category/advanced")} size="lg">
              高度な応用を学ぶ
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
