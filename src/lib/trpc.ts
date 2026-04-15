import { useMemo, useState } from "react";
import articlesData from "@/data/articles-data.json";
import { normalizeSearchText } from "@/lib/searchNormalize";

type Article = (typeof articlesData.articles)[number];

function useSimpleQuery<T>(getter: () => T, enabled = true) {
  return { data: enabled ? getter() : undefined, isLoading: false };
}

function useSimpleMutation<TInput, TOutput>(
  fn: (input: TInput) => TOutput,
  callbacks?: {
    onSuccess?: (data: TOutput) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
  }
) {
  const [isPending, setIsPending] = useState(false);
  return {
    isPending,
    mutate: (input: TInput) => {
      setIsPending(true);
      try {
        const result = fn(input);
        callbacks?.onSuccess?.(result);
      } catch (error) {
        callbacks?.onError?.(error as Error);
      } finally {
        setIsPending(false);
        callbacks?.onSettled?.();
      }
    },
  };
}

function getIdList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setIdList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

const FAVORITES_KEY = "capcut_bookmarks";
const PROGRESS_KEY = "capcut_progress";

export const trpc = {
  useUtils: () => ({
    favorites: { list: { invalidate: () => undefined } },
    progress: { getProgress: { invalidate: () => undefined } },
  }),
  articles: {
    getAll: {
      useQuery: () => useSimpleQuery(() => articlesData.articles as Article[]),
    },
    getById: {
      useQuery: ({ id }: { id: string }, opts?: { enabled?: boolean }) =>
        useSimpleQuery(
          () => (articlesData.articles as Article[]).find((a) => a.id === id || a.slug === id),
          opts?.enabled ?? true
        ),
    },
    getByCategory: {
      useQuery: ({ categoryId }: { categoryId: string }, opts?: { enabled?: boolean }) =>
        useSimpleQuery(
          () => (articlesData.articles as Article[]).filter((a) => a.categoryId === categoryId),
          opts?.enabled ?? true
        ),
    },
    search: {
      useQuery: ({ keyword }: { keyword: string }, opts?: { enabled?: boolean }) =>
        useSimpleQuery(
          () => {
            const q = normalizeSearchText(keyword);
            if (!q || q.length < 1) return [];
            return (articlesData.articles as Article[]).filter((a) =>
              normalizeSearchText(
                `${a.title ?? ""} ${a.description ?? ""} ${a.content ?? ""}`
              ).includes(q)
            );
          },
          opts?.enabled ?? true
        ),
    },
  },
  favorites: {
    list: {
      useQuery: (_v?: undefined, opts?: { enabled?: boolean }) =>
        useSimpleQuery(
          () => {
            const ids = getIdList(FAVORITES_KEY);
            return (articlesData.articles as Article[]).filter((a) => ids.includes(a.id));
          },
          opts?.enabled ?? true
        ),
    },
    add: {
      useMutation: (callbacks?: any) =>
        useSimpleMutation<{ articleId: string }, { success: boolean }>(
          ({ articleId }) => {
            const prev = getIdList(FAVORITES_KEY);
            const next = prev.includes(articleId) ? prev : [articleId, ...prev];
            setIdList(FAVORITES_KEY, next);
            return { success: true };
          },
          callbacks
        ),
    },
    remove: {
      useMutation: (callbacks?: any) =>
        useSimpleMutation<{ articleId: string }, { success: boolean }>(
          ({ articleId }) => {
            const prev = getIdList(FAVORITES_KEY);
            setIdList(
              FAVORITES_KEY,
              prev.filter((id) => id !== articleId)
            );
            return { success: true };
          },
          callbacks
        ),
    },
    isFavorited: {
      useQuery: ({ articleId }: { articleId: string }, opts?: { enabled?: boolean }) =>
        useSimpleQuery(() => getIdList(FAVORITES_KEY).includes(articleId), opts?.enabled ?? true),
    },
  },
  progress: {
    getProgress: {
      useQuery: (_v?: undefined, opts?: { enabled?: boolean }) =>
        useSimpleQuery(
          () => {
            const saved = getIdList(PROGRESS_KEY);
            return saved.map((id) => ({ roadmapStepId: id, completed: 1 }));
          },
          opts?.enabled ?? true
        ),
    },
    updateProgress: {
      useMutation: (callbacks?: any) =>
        useSimpleMutation<{ roadmapStepId: string; completed: boolean }, { success: boolean }>(
          ({ roadmapStepId, completed }) => {
            const prev = getIdList(PROGRESS_KEY);
            const next = completed
              ? Array.from(new Set([...prev, roadmapStepId]))
              : prev.filter((id) => id !== roadmapStepId);
            setIdList(PROGRESS_KEY, next);
            return { success: true };
          },
          callbacks
        ),
    },
  },
  youtube: {
    generateManual: {
      useMutation: (callbacks?: any) =>
        useSimpleMutation<{ youtubeUrl: string; timestamp: string }, any>(
          ({ youtubeUrl, timestamp }) => ({
            title: "YouTube連携マニュアル（サンプル）",
            content: `# YouTube連携マニュアル\n\nURL: ${youtubeUrl}\n開始: ${timestamp}\n\n## ステップ1\n動画を確認します。\n## ステップ2\nCapCutで再現します。`,
          }),
          callbacks
        ),
    },
    saveManual: {
      useMutation: (callbacks?: any) =>
        useSimpleMutation<any, { id: string; title: string }>(
          ({ title }) => ({ id: (articlesData.articles as Article[])[0].id, title }),
          callbacks
        ),
    },
  },
};
