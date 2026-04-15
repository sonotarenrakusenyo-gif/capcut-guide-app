import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Heart, Bookmark, ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getBookmarkedArticleIds,
  getLikedArticleIds,
  toggleBookmarkedArticle,
  toggleLikedArticle,
} from "@/lib/localEngagement";

export default function MyPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("bookmarks");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const { data: articles = [], isLoading: articlesLoading } = trpc.articles.getAll.useQuery();

  useEffect(() => {
    setBookmarkedIds(getBookmarkedArticleIds());
    setLikedIds(getLikedArticleIds());
  }, []);

  const bookmarkedArticles = useMemo(
    () => articles.filter((article) => bookmarkedIds.includes(article.id)),
    [articles, bookmarkedIds]
  );
  const likedArticles = useMemo(
    () => articles.filter((article) => likedIds.includes(article.id)),
    [articles, likedIds]
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

        {/* タブ */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
            <TabsTrigger
              value="bookmarks"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 text-white"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              ブックマーク ({bookmarkedArticles.length})
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              いいね ({likedArticles.length})
            </TabsTrigger>
          </TabsList>

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
