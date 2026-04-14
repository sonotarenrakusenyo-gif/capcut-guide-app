import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllArticles,
  getArticleById,
  getArticlesByCategory,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  isFavorited,
  getUserProgress,
  updateUserProgress,
} from "./db";
import { invokeLLM } from "./_core/llm";

function normalizeSearchText(input: string) {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0x60)
    )
    .trim();
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  articles: router({
    getAll: publicProcedure.query(async () => {
      return getAllArticles();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return getArticleById(input.id);
      }),

    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.string() }))
      .query(async ({ input }) => {
        return getArticlesByCategory(input.categoryId);
      }),

    search: publicProcedure
      .input(z.object({ keyword: z.string() }))
      .query(async ({ input }) => {
        const allArticles = (await getAllArticles()) || [];
        const keyword = normalizeSearchText(input.keyword);
        return allArticles.filter(
          article =>
            normalizeSearchText(
              `${article.title ?? ""} ${article.description ?? ""} ${article.content ?? ""}`
            ).includes(keyword)
        );
      }),
  }),

  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserFavorites(ctx.user.id);
    }),

    add: protectedProcedure
      .input(z.object({ articleId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await addFavorite(ctx.user.id, input.articleId);
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ articleId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await removeFavorite(ctx.user.id, input.articleId);
        return { success: true };
      }),

    isFavorited: protectedProcedure
      .input(z.object({ articleId: z.string() }))
      .query(async ({ ctx, input }) => {
        return isFavorited(ctx.user.id, input.articleId);
      }),
  }),

  progress: router({
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      return getUserProgress(ctx.user.id);
    }),

    updateProgress: protectedProcedure
      .input(z.object({ roadmapStepId: z.string(), completed: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProgress(ctx.user.id, input.roadmapStepId, input.completed);
        return { success: true };
      }),
  }),

  youtube: router({
    generateManual: protectedProcedure
      .input(z.object({ youtubeUrl: z.string().url(), timestamp: z.string() }))
      .mutation(async ({ input }) => {
        // Extract video ID from YouTube URL
        const videoIdMatch = input.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        const videoId = videoIdMatch?.[1];

        if (!videoId) {
          throw new Error('Invalid YouTube URL');
        }

        // Generate manual using LLM
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `You are a CapCut video editing expert. Generate a practical manual based on a YouTube video.
Format the response as Markdown with the following structure:
# [Title]

## 概要
[Brief description]

## よくある失敗例
[Common mistakes]

## 解決方法
[Step-by-step solution]

## 応用テクニック
[Advanced tips]`
            },
            {
              role: 'user',
              content: `YouTube video URL: ${input.youtubeUrl}\nTimestamp: ${input.timestamp}\n\nPlease generate a CapCut editing manual based on this video. Assume this is a tutorial video showing CapCut editing techniques.`
            }
          ]
        });

        const messageContent = response.choices[0]?.message.content;
        const content = typeof messageContent === 'string' ? messageContent : '';
        const titleMatch = content.match(/^# (.+)$/m);
        const title = titleMatch?.[1] || `YouTube実践マニュアル (${videoId})`;

        return {
          title,
          content,
          videoId,
          timestamp: input.timestamp
        };
      }),

    saveManual: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        category: z.string(),
        youtubeUrl: z.string(),
        timestamp: z.string()
      }))
      .mutation(async ({ ctx, input }) => {
        // Save manual implementation with unique ID
        const { nanoid } = await import('nanoid');
        const uniqueId = `youtube-manual-${nanoid(8)}`;
        return { id: uniqueId, title: input.title };
      })
  }),
});

export type AppRouter = typeof appRouter;
