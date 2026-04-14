const LIKES_KEY = "capcut_likes";
const BOOKMARKS_KEY = "capcut_bookmarks";

function readIds(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  localStorage.setItem(key, JSON.stringify(ids));
}

function toggleInList(ids: string[], articleId: string): string[] {
  return ids.includes(articleId)
    ? ids.filter((id) => id !== articleId)
    : [articleId, ...ids];
}

export function getLikedArticleIds(): string[] {
  return readIds(LIKES_KEY);
}

export function getBookmarkedArticleIds(): string[] {
  return readIds(BOOKMARKS_KEY);
}

export function toggleLikedArticle(articleId: string): string[] {
  const next = toggleInList(getLikedArticleIds(), articleId);
  writeIds(LIKES_KEY, next);
  return next;
}

export function toggleBookmarkedArticle(articleId: string): string[] {
  const next = toggleInList(getBookmarkedArticleIds(), articleId);
  writeIds(BOOKMARKS_KEY, next);
  return next;
}
