import { useState } from "react";
import DOMPurify from "dompurify";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { CommentForm } from "./comment-form";
import type { Comment } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";
import { useDeleteComment } from "@/hooks/queries/comments";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  currentUserId,
  isReply = false,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuthStore();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  const isOwner = currentUserId === comment.user_id;

  const handleDelete = () => {
    deleteComment(
      {
        commentId: comment.id,
        bookSlug: comment.book_slug,
        chapterSlug: comment.chapter_slug,
      },
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
        },
      }
    );
  };

  const getInitials = (name?: string) => {
    return name ? name.substring(0, 2).toUpperCase() : "U";
  };

  const sanitizedContent = DOMPurify.sanitize(comment.content);

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <div className={`flex gap-2 ${isReply ? "" : ""}`}>
      <Avatar className={cn("h-8 w-8 flex-shrink-0", isReply && "h-6 w-6")}>
        <AvatarImage src={comment.avatar_url} />
        <AvatarFallback className="text-xs">
          {getInitials(comment.username)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-2 py-2 inline-block max-w-full">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">
              {comment.username || "Ẩn danh"}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo}
            </span>
          </div>
          <div
            className="text-sm text-foreground break-words leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

        {!isReply && user && (
          <div className="flex items-center gap-2 mt-1 ml-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              {isReplying ? "Hủy" : "Trả lời"}
            </Button>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </Button>
            )}
          </div>
        )}

        {isReplying && user && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2">
            <CommentForm
              bookSlug={comment.book_slug}
              chapterSlug={comment.chapter_slug}
              parentId={comment.id}
              onSuccess={() => setIsReplying(false)}
              onCancel={() => setIsReplying(false)}
              placeholder={`Trả lời ${comment.username || "người dùng"}...`}
            />
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xóa bình luận"
        description="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
