import { FeedbackStatus, type Feedback } from "@/types/feedback";
import { supabase } from "@/lib/supabase";

const SCHEMA_NAME = "feedbacks";
class FeedbackService {
  getFeedbacks = (page: number = 0, pageSize: number = 10) => {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    return supabase
      .from(SCHEMA_NAME)
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);
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

  submitFeedback = async (data: Omit<Feedback, "id" | "created_at">) => {
    return await supabase.from(SCHEMA_NAME).insert(data);
  };

  getUserFeedbacks = async (userId: string, page: number = 0, pageSize: number = 10) => {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    return await supabase
      .from(SCHEMA_NAME)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);
  };

  getUnreadFeedbackCount = async (userId: string) => {
    const { count, error } = await supabase
      .from(SCHEMA_NAME)
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("response", "is", null)
      .or("is_acknowledged.is.null,is_acknowledged.eq.false");

    if (error) throw error;
    return count || 0;
  };

  markAsAcknowledged = async (id: string, userId: string) => {
    return await supabase
      .from(SCHEMA_NAME)
      .update({ is_acknowledged: true })
      .eq("id", id)
      .eq("user_id", userId);
  };
}

export const feedbackService = new FeedbackService();
