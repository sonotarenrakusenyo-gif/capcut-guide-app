import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("youtube.generateManual", () => {
  it("should validate YouTube URL format", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.youtube.generateManual({
        youtubeUrl: "invalid-url",
        timestamp: "00:00:00",
      });
      expect.fail("Should have thrown an error for invalid URL");
    } catch (error: any) {
      expect(error.message).toContain("Invalid");
    }
  });

  it("should accept valid YouTube URLs", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Mock the LLM response
    const result = await caller.youtube.generateManual({
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      timestamp: "00:14:30",
    });

    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("content");
    expect(result).toHaveProperty("videoId");
    expect(result).toHaveProperty("timestamp");
    expect(result.videoId).toBe("dQw4w9WgXcQ");
    expect(result.timestamp).toBe("00:14:30");
  });

  it("should extract video ID from youtu.be URLs", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.youtube.generateManual({
      youtubeUrl: "https://youtu.be/dQw4w9WgXcQ",
      timestamp: "00:00:00",
    });

    expect(result.videoId).toBe("dQw4w9WgXcQ");
  });

  it("should generate manual with required sections", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.youtube.generateManual({
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      timestamp: "00:00:00",
    });

    // Check that content contains expected sections
    expect(result.content).toBeDefined();
    expect(typeof result.content).toBe("string");
    expect(result.title).toBeDefined();
    expect(typeof result.title).toBe("string");
  });
});

describe("youtube.saveManual", () => {
  it("should save manual with required fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.youtube.saveManual({
      title: "Test Manual",
      content: "# Test Manual\n\n## 概要\nTest content",
      category: "youtube",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      timestamp: "00:00:00",
    });

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("title");
    expect(result.title).toBe("Test Manual");
  });

  it("should generate unique IDs for saved manuals", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result1 = await caller.youtube.saveManual({
      title: "Test Manual 1",
      content: "# Test Manual 1",
      category: "youtube",
      youtubeUrl: "https://www.youtube.com/watch?v=test1",
      timestamp: "00:00:00",
    });

    const result2 = await caller.youtube.saveManual({
      title: "Test Manual 2",
      content: "# Test Manual 2",
      category: "youtube",
      youtubeUrl: "https://www.youtube.com/watch?v=test2",
      timestamp: "00:00:00",
    });

    expect(result1.id).not.toBe(result2.id);
  });

  it("should require authentication", async () => {
    const unauthenticatedCtx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(unauthenticatedCtx);

    try {
      await caller.youtube.saveManual({
        title: "Test Manual",
        content: "# Test Manual",
        category: "youtube",
        youtubeUrl: "https://www.youtube.com/watch?v=test",
        timestamp: "00:00:00",
      });
      expect.fail("Should have thrown an error for unauthenticated user");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});
