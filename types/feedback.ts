export enum FeedbackStatus {
  Pending = "pending",
  Resolved = "resolved",
  Ignored = "ignored",
  InProgress = "in-progress",
  Completed = "completed",
  Rejected = "rejected",
}

export enum FeedbackCategory {
  Feature = "feature",
  Improvement = "improvement",
  Bug = "bug",
  Suggestion = "suggestion",
  Error = "error",
  Other = "other",
}

export interface Feedback {
  id: string;
  category: FeedbackCategory;
  title: string;
  description: string;
  user_id?: string;
  status: FeedbackStatus;
  created_at: number;
  metadata?: any;
  response?: string | null;
  response_at?: number | null;
  is_acknowledged?: boolean;
}

export interface ChapterFeedback {
  bookSlug: string;
  bookTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  errorMessage: string;
  userMessage?: string;
}
