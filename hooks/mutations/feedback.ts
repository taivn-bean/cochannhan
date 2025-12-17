// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import type { ChapterFeedback, GeneralFeedback } from "@/types/feedback";
// import { feedbackService } from "@/services/feedback.service";

// export const useReportChapterError = () => {
//   return useMutation({
//     mutationFn: async (data: Omit<ChapterFeedback, "id" | "createdAt">) => {
//       return await feedbackService.reportChapterError(data);
//     },
//     onSuccess: () => {
//       toast.success("Đã gửi báo lỗi thành công! Cảm ơn bạn đã báo cáo.");
//     },
//     onError: (error) => {
//       toast.error("Không thể gửi báo lỗi. Vui lòng thử lại sau.");
//       console.error("Report error failed:", error);
//     },
//   });
// };

// export const useSubmitFeedback = () => {
//   return useMutation({
//     mutationFn: async (data: Omit<GeneralFeedback, "id" | "createdAt">) => {
//       return await feedbackService.submitGeneralFeedback(data);
//     },
//     onSuccess: () => {
//       toast.success(
//         "Cảm ơn bạn đã gửi feedback! Chúng tôi sẽ xem xét sớm nhất.",
//       );
//     },
//     onError: (error) => {
//       toast.error("Không thể gửi feedback. Vui lòng thử lại sau.");
//       console.error("Submit feedback failed:", error);
//     },
//   });
// };
