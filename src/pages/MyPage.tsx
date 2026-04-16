import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Heart, Bookmark, ArrowLeft, Map, Clock } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getBookmarkedArticleIds,
  getLikedArticleIds,
  toggleBookmarkedArticle,
  toggleLikedArticle,
  getCompletedArticleIds,
  getRecentArticleIds,
} from "@/lib/localEngagement";

const TOTAL_ARTICLES = 66;

export default function MyPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("bookmarks");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const { data: articles = [], isLoading: articlesLoading } = trpc.articles.getAll.useQuery();

  const loadProgress = useCallback(() => {
    setCompletedIds(getCompletedArticleIds());
  }, []);

  useEffect(() => {
    setBookmarkedIds(getBookmarkedArticleIds());
    setLikedIds(getLikedArticleIds());
    setRecentIds(getRecentArticleIds());
    loadProgress();
    window.addEventListener("capcut_progress_changed", loadProgress);
    return () => window.removeEventListener("capcut_progress_changed", loadProgress);
  }, [loadProgress]);

  const completedCount = completedIds.length;
  const progressPct = Math.round((completedCount / TOTAL_ARTICLES) * 100);

  const bookmarkedArticles = useMemo(
    () => articles.filter((article) => bookmarkedIds.includes(article.id)),
    [articles, bookmarkedIds]
  );
  const likedArticles = useMemo(
    () => articles.filter((article) => likedIds.includes(article.id)),
    [articles, likedIds]
  );
  const recentArticles = useMemo(
    () => recentIds
      .map((id) => articles.find((a) => a.id === id))
      .filter(Boolean) as typeof articles,
    [articles, recentIds]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-full px-4 py-2 h-auto text-sm gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            ホームに戻る
          </Button>
        </div>

        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            マイページ
          </h1>
          <p className="text-slate-400">
            ブックマークと「いいね」を管理できます
          </p>
        </div>

        {/* 学習進捗カード */}
        <Card
          className="mb-8 bg-slate-800 border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
          onClick={() => setLocation("/roadmap")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white text-lg">学習進捗</CardTitle>
              </div>
              <span className="text-sm font-mono text-blue-400 font-semibold">
                {completedCount} / {TOTAL_ARTICLES} 完了
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{progressPct}% 達成</span>
              <span className="text-blue-400 hover:underline">ロードマップを開く →</span>
            </div>
          </CardContent>
        </Card>

        {/* タブ */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger
              value="recent"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-slate-500 text-white text-xs"
            >
              <Clock className="w-3 h-3 mr-1" />
              最近 ({recentArticles.length})
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 text-white text-xs"
            >
              <Bookmark className="w-3 h-3 mr-1" />
              保存 ({bookmarkedArticles.length})
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 text-white text-xs"
            >
              <Heart className="w-3 h-3 mr-1" />
              いいね ({likedArticles.length})
            </TabsTrigger>
          </TabsList>

          {/* 最近読んだ記事タブ */}
          <TabsContent value="recent" className="space-y-4 mt-6">
            {recentArticles.length > 0 ? (
              <div className="grid gap-4">
                {recentArticles.map((article, i) => (
                  <Card
                    key={article.id}
                    className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-colors cursor-pointer group"
                    onClick={() => setLocation(`/article/${article.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-500">#{i + 1}</span>
                            <span className="text-xs text-slate-400">{article.difficulty}</span>
                          </div>
                          <CardTitle className="text-white group-hover:text-slate-300 transition-colors text-sm line-clamp-2">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="text-slate-400 text-xs mt-1 line-clamp-1">
                            {article.description}
                          </CardDescription>
                        </div>
                        <Clock className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">まだ記事を読んでいません</p>
                  <p className="text-slate-500 text-sm mt-1">記事を開くと自動的に記録されます</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ブックマークタブ */}
          <TabsContent value="bookmarks" className="space-y-4 mt-6">
            {articlesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : bookmarkedArticles.length > 0 ? (
              <div className="grid gap-4">
                {bookmarkedArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group"
                    onClick={() => setLocation(`/article/${article.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            {article.description}
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            const next = toggleBookmarkedArticle(article.id);
                            setBookmarkedIds(next);
                          }}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    ブックマークした記事はまだありません
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* いいねタブ */}
          <TabsContent value="likes" className="space-y-4 mt-6">
            {articlesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
              </div>
            ) : likedArticles.length > 0 ? (
              <div className="grid gap-4">
                {likedArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-slate-800 border-slate-700 hover:border-pink-500 transition-colors cursor-pointer group"
                    onClick={() => setLocation(`/article/${article.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white group-hover:text-pink-400 transition-colors">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            {article.description}
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            const next = toggleLikedArticle(article.id);
                            setLikedIds(next);
                          }}
                          className="text-slate-400 hover:text-pink-400"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    いいねした記事はまだありません
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
