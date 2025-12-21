import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FeedbackCategory,
  FeedbackStatus,
  type ChapterFeedback,
  type Feedback,
} from "@/types/feedback";
import { supabase } from "@/lib/supabase";
import { feedbackService } from "@/services/feedback.service";

const SCHEMA_NAME = "feedbacks";

export const useFeedbacks = () => {
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: () => feedbackService.getFeedbacks(),
  });
};

export const useReviewStats = () => {
  return useQuery({
    queryKey: ["feedback-stats"],
    queryFn: () => feedbackService.getReviewStats(),
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
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-stats"] });
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
          createdAt: Date.now(),
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
  return useMutation({
    mutationFn: async (data: Omit<Feedback, "id" | "createdAt">) => {
      return await feedbackService.submitFeedback(data);
    },
    onSuccess: () => {
      toast.success(
        "Cảm ơn bạn đã gửi feedback! Chúng tôi sẽ xem xét sớm nhất."
      );
    },
    onError: (error) => {
      toast.error("Không thể gửi feedback. Vui lòng thử lại sau.");
      console.error("Submit feedback failed:", error);
    },
  });
};
