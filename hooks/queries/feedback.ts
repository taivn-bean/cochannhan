"use client";

import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FeedbackCategory,
  FeedbackStatus,
  type ChapterFeedback,
  type Feedback,
} from "@/types/feedback";
import { supabase } from "@/lib/supabase";
import { feedbackService } from "@/services/feedback.service";
import { CACHE_TIME } from "./cache.const";

const SCHEMA_NAME = "feedbacks";

// Query keys constants
const FEEDBACK_QUERY_KEYS = {
  all: ["feedbacks"] as const,
  lists: () => [...FEEDBACK_QUERY_KEYS.all, "list"] as const,
  infinite: () => [...FEEDBACK_QUERY_KEYS.all, "infinite"] as const,
  stats: ["feedback-stats"] as const,
  user: (userId: string) => [...FEEDBACK_QUERY_KEYS.all, "user", userId] as const,
  userInfinite: (userId: string) =>
    [...FEEDBACK_QUERY_KEYS.all, "user-infinite", userId] as const,
  unreadCount: (userId: string) =>
    [...FEEDBACK_QUERY_KEYS.all, "unread-count", userId] as const,
} as const;

const PAGE_SIZE = 10;

export const useFeedbacks = (enabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: FEEDBACK_QUERY_KEYS.infinite(),
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await feedbackService.getFeedbacks(
        pageParam,
        PAGE_SIZE
      );
      if (error) throw error;
      return {
        data: data as Feedback[],
        nextPage: (data?.length || 0) === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
    staleTime: CACHE_TIME.FIVE_MINUTES,
    gcTime: CACHE_TIME.THIRTY_MINUTES,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useReviewStats = () => {
  return useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.stats,
    queryFn: () => feedbackService.getReviewStats(),
    staleTime: CACHE_TIME.FIVE_MINUTES,
    gcTime: CACHE_TIME.THIRTY_MINUTES,
  });
};

export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: FeedbackStatus;
    }) => {
      return await feedbackService.updateFeedbackStatus(id, status);
    },
    onSuccess: () => {
      toast.success("Trạng thái feedback đã được cập nhật thành công");
      queryClient.invalidateQueries({
        queryKey: FEEDBACK_QUERY_KEYS.infinite(),
      });
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.stats });
    },
    onError: () => {
      toast.error(
        "Không thể cập nhật trạng thái feedback. Vui lòng thử lại sau."
      );
    },
  });
};

export const useReportChapterError = () => {
  return useMutation({
    mutationFn: async (data: ChapterFeedback) => {
      try {
        const feedback: Feedback = {
          id: crypto.randomUUID(),
          category: FeedbackCategory.Error,
          title: data.errorMessage,
          description: data.userMessage || "",
          status: FeedbackStatus.Pending,
          created_at: Date.now(),
          metadata: JSON.stringify(data),
        };
        return await feedbackService.reportChapterError(feedback);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Đã gửi báo lỗi thành công! Cảm ơn bạn đã báo cáo.");
    },
    onError: (error) => {
      toast.error("Không thể gửi báo lỗi. Vui lòng thử lại sau.");
      console.error("Report error failed:", error);
    },
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Feedback, "id" | "created_at">) => {
      return await feedbackService.submitFeedback(data);
    },
    onSuccess: (_, variables) => {
      toast.success(
        "Cảm ơn bạn đã gửi feedback! Chúng tôi sẽ xem xét sớm nhất."
      );
      queryClient.invalidateQueries({
        queryKey: FEEDBACK_QUERY_KEYS.infinite(),
      });
      if (variables.user_id) {
        queryClient.invalidateQueries({
          queryKey: FEEDBACK_QUERY_KEYS.userInfinite(variables.user_id),
        });
      }
    },
    onError: (error) => {
      toast.error("Không thể gửi feedback. Vui lòng thử lại sau.");
      console.error("Submit feedback failed:", error);
    },
  });
};

export const useUserFeedbacks = (userId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: FEEDBACK_QUERY_KEYS.userInfinite(userId || ""),
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) throw new Error("User ID is required");
      const { data, error } = await feedbackService.getUserFeedbacks(
        userId,
        pageParam,
        PAGE_SIZE
      );
      if (error) throw error;
      return {
        data: data as Feedback[],
        nextPage: (data?.length || 0) === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId,
    staleTime: CACHE_TIME.FIVE_MINUTES,
    gcTime: CACHE_TIME.THIRTY_MINUTES,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useUnreadFeedbackCount = (userId: string | undefined) => {
  return useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.unreadCount(userId || ""),
    queryFn: async () => {
      if (!userId) return 0;
      return await feedbackService.getUnreadFeedbackCount(userId);
    },
    enabled: !!userId,
    staleTime: CACHE_TIME.ONE_MINUTE,
    gcTime: CACHE_TIME.FIVE_MINUTES,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useMarkAsAcknowledged = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      userId,
    }: {
      id: string;
      userId: string;
    }) => {
      return await feedbackService.markAsAcknowledged(id, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: FEEDBACK_QUERY_KEYS.infinite(),
      });
      queryClient.invalidateQueries({
        queryKey: FEEDBACK_QUERY_KEYS.userInfinite(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: FEEDBACK_QUERY_KEYS.unreadCount(variables.userId),
      });
      toast.success("Đã đánh dấu OK");
    },
    onError: () => {
      toast.error("Không thể đánh dấu OK. Vui lòng thử lại sau.");
    },
  });
};
