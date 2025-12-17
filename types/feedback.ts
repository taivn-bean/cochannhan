export type FeedbackStatus =
  | "pending"
  | "resolved"
  | "ignored"
  | "in-progress"
  | "completed"
  | "rejected";

export type FeedbackCategory =
  | "feature"
  | "improvement"
  | "bug"
  | "suggestion"
  | "other";

export interface ChapterFeedback {
  id: string;
  bookSlug: string;
  bookTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  errorMessage: string;
  userMessage?: string;
  userEmail?: string;
  userId?: string;
  status: FeedbackStatus;
  createdAt: number;
  resolvedAt?: number;
}

export interface GeneralFeedback {
  id: string;
  category: FeedbackCategory;
  title: string;
  description: string;
  userEmail?: string;
  userId?: string;
  status: FeedbackStatus;
  createdAt: number;
  updatedAt?: number;
}
