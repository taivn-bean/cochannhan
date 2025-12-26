import { supabase } from "@/lib/supabase";
import type { Comment } from "@/types/comment";

const COMMENT_SCHEMA = "comments";
class CommentService {
  async addComment(
    comment: Omit<Comment, "id" | "createdAt">
  ): Promise<string> {
    const { data, error } = await supabase
      .from(COMMENT_SCHEMA)
      .insert({
        book_slug: comment.book_slug,
        chapter_slug: comment.chapter_slug,
        content: comment.content,

        user_id: comment.user_id,
        username: comment.username,
        avatar_url: comment.avatar_url,

        parent_id: comment.parent_id ?? null,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  }

  async getCommentsWithReplies(
    bookSlug: string,
    chapterSlug: string,
    cursor?: string
  ): Promise<{ comments: Comment[]; nextCursor: string | null }> {
    const { data, error } = await supabase.rpc(
      "get_root_comments_with_replies",
      {
        p_book_slug: bookSlug,
        p_chapter_slug: chapterSlug,
        p_cursor: cursor ?? null,
      }
    );

    if (error) {
      console.error(error);
      return { comments: [], nextCursor: null };
    }

    const comments = data.map(this.mapComment);
    const roots = data.filter((c: Comment) => c.parent_id === null);

    return {
      comments,
      nextCursor: roots.length > 0 ? roots[roots.length - 1].createdAt : null,
    };
  }

  private mapComment(row: any): Comment {
    return {
      id: row.id,
      book_slug: row.book_slug,
      chapter_slug: row.chapter_slug,
      content: row.content,

      user_id: row.user_id,
      username: row.username,
      avatar_url: row.avatar_url,

      parent_id: row.parent_id,
      createdAt: row.created_at,
    };
  }
  async countAllComments(
    bookSlug: string,
    chapterSlug: string
  ): Promise<number> {
    const { count, error } = await supabase
      .from(COMMENT_SCHEMA)
      .select("id", { count: "exact", head: true })
      .eq("book_slug", bookSlug)
      .eq("chapter_slug", chapterSlug);

    if (error) {
      console.error("Count all comments error:", error);
      return 0;
    }

    return count ?? 0;
  }

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from(COMMENT_SCHEMA)
      .delete()
      .eq("id", commentId);

    if (error) throw error;
  }
}

export const commentService = new CommentService();
