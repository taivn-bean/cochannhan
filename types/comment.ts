export interface Comment {
  id: string;
  userId: string;
  userEmail?: string;
  content: string;
  bookSlug: string;
  chapterSlug: string;
  parentId: string | null; // null for root comments
  createdAt: number;
  updatedAt?: number;
}
