// import {
//   useInfiniteQuery,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import { CACHE_TIME } from "./cache.const";
// import type { Comment } from "@/types/comment";
// import { commentService } from "@/services/comment.service";

// export const useComments = (
//   bookSlug: string,
//   chapterSlug: string,
//   options?: { enabled?: boolean },
// ) => {
//   return useInfiniteQuery({
//     queryKey: ["nested-comments", bookSlug, chapterSlug],
//     queryFn: ({ pageParam }) =>
//       commentService.getComments(bookSlug, chapterSlug, pageParam),
//     initialPageParam: undefined as any,
//     getNextPageParam: (lastPage) => lastPage.lastDoc || undefined,
//     enabled: options?.enabled,
//     staleTime: CACHE_TIME.FIVE_MINUTES, // 5 minutes
//     gcTime: CACHE_TIME.THIRTY_MINUTES, // 30 minutes
//   });
// };

// export const useAddComment = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (comment: Omit<Comment, "id" | "createdAt">) =>
//       commentService.addComment(comment),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: [
//           "nested-comments",
//           variables.bookSlug,
//           variables.chapterSlug,
//         ],
//       });
//     },
//   });
// };
