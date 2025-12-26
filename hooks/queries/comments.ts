import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { commentService } from "@/services/comment.service";
import { CACHE_TIME } from "./cache.const";
import type { Comment, CommentWithReplies } from "@/types/comment";

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
    queryKey: ["comments", bookSlug, chapterSlug],
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
        queryKey: ["comments", v.book_slug, v.chapter_slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentCount", v.book_slug, v.chapter_slug],
      });
    },
  });
};

export const useCommentCount = (bookSlug: string, chapterSlug: string) => {
  return useQuery({
    queryKey: ["commentCount", bookSlug, chapterSlug],
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
        queryKey: ["comments", variables.bookSlug, variables.chapterSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentCount", variables.bookSlug, variables.chapterSlug],
      });
    },
  });
};
