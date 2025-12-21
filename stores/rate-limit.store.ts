import { Store } from "@tanstack/store";

interface RateLimitState {
  lastCommentAt: number; // Timestamp of the last successful comment
  isRateLimited: boolean; // Whether the user is currently limited (derived/UI state)
}

// 30 second cooldown
export const COMMENT_COOLDOWN = 30 * 1000;

export const rateLimitStore = new Store<RateLimitState>({
  lastCommentAt: 0,
  isRateLimited: false,
});

export const checkRateLimit = () => {
  const state = rateLimitStore.state;
  const now = Date.now();
  const timeSinceLastComment = now - state.lastCommentAt;

  if (timeSinceLastComment < COMMENT_COOLDOWN) {
    rateLimitStore.setState((prev) => ({ ...prev, isRateLimited: true }));
    return false; // Rate limited
  }

  rateLimitStore.setState((prev) => ({ ...prev, isRateLimited: false }));
  return true; // Safe to comment
};

export const updateLastCommentTimestamp = () => {
  rateLimitStore.setState((prev) => ({
    ...prev,
    lastCommentAt: Date.now(),
    isRateLimited: true, // Optimistically limit immediately after comment
  }));

  // Auto-clear rate limit flag after cooldown (UI convenience)
  setTimeout(() => {
    rateLimitStore.setState((prev) => ({ ...prev, isRateLimited: false }));
  }, COMMENT_COOLDOWN);
};

export const dismissRateLimitAlert = () => {
  rateLimitStore.setState((prev) => ({ ...prev, isRateLimited: false }));
};
