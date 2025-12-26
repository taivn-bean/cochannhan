"use client";

import { MessageSquare, X, Loader2, ChevronDown } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { useComments } from "@/hooks/queries/comments";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Comment, CommentWithReplies } from "@/types/comment";

interface CommentBottomSheetProps {
  bookSlug: string;
  chapterSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentBottomSheet({
  bookSlug,
  chapterSlug,
  open,
  onOpenChange,
}: CommentBottomSheetProps) {
  const { user } = useAuthStore();
  const { data, isLoading, isFetched } = useComments(bookSlug, chapterSlug, {
    enabled: open,
  });

  const comments = data?.tree || [];
  const rootComments = comments.filter((c: CommentWithReplies) => !c.parent_id);
  const totalComments = comments.reduce(
    (acc, c) => acc + c.replies.length + 1,
    0
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <DrawerHeader className="border-b pb-3 px-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-semibold">
              Bình luận {totalComments > 0 && `(${totalComments})`}
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Comments List */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {isLoading && !isFetched ? (
                <div className="space-y-4">
                  {[1].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : rootComments.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    Chưa có bình luận nào. Hãy là người đầu tiên!
                  </p>
                </div>
              ) : (
                rootComments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <CommentItem comment={comment} currentUserId={user?.id} />
                    {/* Render Replies */}
                    {comment.replies.length > 0 && (
                      <div className="pl-4 space-y-3 border-l-2 border-muted ml-2">
                        {comment.replies.map((reply) => (
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUserId={user?.id}
                            isReply
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Comment Input at Bottom */}
          <div className="border-t bg-background px-4 py-3">
            {user ? (
              <CommentForm
                bookSlug={bookSlug}
                chapterSlug={chapterSlug}
                onSuccess={() => {
                  // Scroll to bottom after adding comment
                  setTimeout(() => {
                    const scrollArea = document.querySelector(
                      "[data-radix-scroll-area-viewport]"
                    );
                    if (scrollArea) {
                      scrollArea.scrollTop = scrollArea.scrollHeight;
                    }
                  }, 100);
                }}
              />
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Đăng nhập để tham gia bình luận
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/login">Đăng nhập</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
