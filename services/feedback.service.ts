import { FeedbackStatus, type Feedback } from "@/types/feedback";
import { supabase } from "@/lib/supabase";

const SCHEMA_NAME = "feedbacks";
class FeedbackService {
  getFeedbacks = () => {
    return supabase.from(SCHEMA_NAME).select("*");
  };

  getReviewStats = () => {
    return supabase.from(SCHEMA_NAME).select("*").eq("status", "pending");
  };

  updateFeedbackStatus = async (id: string, status: FeedbackStatus) => {
    return await supabase.from(SCHEMA_NAME).update({ status }).eq("id", id);
  };

  reportChapterError = (feedback: Feedback) => {
    return supabase.from(SCHEMA_NAME).insert(feedback);
  };

  submitFeedback = async (data: Omit<Feedback, "id" | "createdAt">) => {
    return await supabase.from(SCHEMA_NAME).insert(data);
  };
}

export const feedbackService = new FeedbackService();
