"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { commentService } from "@/services/comment.service";
import { CACHE_TIME } from "./cache.const";
import type { Comment, CommentWithReplies } from "@/types/comment";

// Query keys constants
const COMMENT_QUERY_KEYS = {
  all: ["comments"] as const,
  lists: () => [...COMMENT_QUERY_KEYS.all, "list"] as const,
  list: (bookSlug: string, chapterSlug: string) =>
    [...COMMENT_QUERY_KEYS.lists(), bookSlug, chapterSlug] as const,
  count: (bookSlug: string, chapterSlug: string) =>
    ["commentCount", bookSlug, chapterSlug] as const,
} as const;

export const buildCommentTree = (comments: Comment[]): CommentWithReplies[] => {
  const map = new Map<string, CommentWithReplies>();
  const roots: CommentWithReplies[] = [];

  comments.forEach((c) => map.set(c.id, { ...c, replies: [] }));

  comments.forEach((c) => {
    if (c.parent_id) {
      map.get(c.parent_id)?.replies.push(map.get(c.id)!);
    } else {
      roots.push(map.get(c.id)!);
    }
  });

  return roots;
};

export const useComments = (
  bookSlug: string,
  chapterSlug: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.list(bookSlug, chapterSlug),
    queryFn: async () => {
      const res = await commentService.getCommentsWithReplies(
        bookSlug,
        chapterSlug
      );

      return {
        ...res,
        tree: buildCommentTree(res.comments),
      };
    },
    enabled: options?.enabled !== false,
    staleTime: CACHE_TIME.FIVE_MINUTES,
    gcTime: CACHE_TIME.THIRTY_MINUTES,
    refetchOnMount: false, // Không refetch nếu data đã có trong cache
    refetchOnWindowFocus: false, // Không refetch khi focus window
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Omit<Comment, "id" | "createdAt">) =>
      commentService.addComment(comment),

    onSuccess: (_, v) => {
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.list(v.book_slug, v.chapter_slug),
      });
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.count(v.book_slug, v.chapter_slug),
      });
    },
  });
};

export const useCommentCount = (bookSlug: string, chapterSlug: string) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.count(bookSlug, chapterSlug),
    queryFn: () => commentService.countAllComments(bookSlug, chapterSlug),
    staleTime: CACHE_TIME.FIVE_MINUTES,
    gcTime: CACHE_TIME.THIRTY_MINUTES,
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { commentId: string; bookSlug: string; chapterSlug: string }) =>
      commentService.deleteComment(data.commentId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.list(variables.bookSlug, variables.chapterSlug),
      });
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.count(variables.bookSlug, variables.chapterSlug),
      });
    },
  });
};
