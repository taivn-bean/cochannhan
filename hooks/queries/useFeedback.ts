// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import type { FeedbackStatus } from "@/types/feedback";
// import { feedbackService } from "@/services/feedback.service";

// export const useFeedbacks = () => {
//   return useQuery({
//     queryKey: ["feedbacks"],
//     queryFn: feedbackService.getFeedbacks,
//   });
// };

// export const useReviewStats = () => {
//   return useQuery({
//     queryKey: ["feedback-stats"],
//     queryFn: feedbackService.getFeedbackStats,
//   });
// };

// export const useUpdateFeedbackStatus = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, status }: { id: string; status: FeedbackStatus }) =>
//       feedbackService.updateFeedbackStatus(id, status),
//     onSuccess: () => {
//       toast.success("Feedback status updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
//       queryClient.invalidateQueries({ queryKey: ["feedback-stats"] });
//     },
//     onError: () => {
//       toast.error("Failed to update feedback status");
//     },
//   });
// };
