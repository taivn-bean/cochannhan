"use client";

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { CheckCircle2, MessageSquare, Clock } from "lucide-react";
import type { Feedback } from "@/types/feedback";
import { FeedbackCategory, FeedbackStatus } from "@/types/feedback";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMarkAsAcknowledged } from "@/hooks/queries/feedback";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { Loader2 } from "lucide-react";

interface FeedbackListProps {
  feedbacks: Feedback[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

const categoryLabels: Record<FeedbackCategory, string> = {
  [FeedbackCategory.Feature]: "Đề xuất tính năng",
  [FeedbackCategory.Improvement]: "Cải thiện",
  [FeedbackCategory.Bug]: "Báo lỗi",
  [FeedbackCategory.Suggestion]: "Đề xuất truyện",
  [FeedbackCategory.Error]: "Lỗi",
  [FeedbackCategory.Other]: "Khác",
};

const statusLabels: Record<FeedbackStatus, string> = {
  [FeedbackStatus.Pending]: "Đang chờ",
  [FeedbackStatus.InProgress]: "Đang xử lý",
  [FeedbackStatus.Resolved]: "Đã xử lý",
  [FeedbackStatus.Completed]: "Hoàn thành",
  [FeedbackStatus.Ignored]: "Bỏ qua",
  [FeedbackStatus.Rejected]: "Từ chối",
};

const statusVariants: Record<FeedbackStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [FeedbackStatus.Pending]: "secondary",
  [FeedbackStatus.InProgress]: "default",
  [FeedbackStatus.Resolved]: "default",
  [FeedbackStatus.Completed]: "default",
  [FeedbackStatus.Ignored]: "outline",
  [FeedbackStatus.Rejected]: "destructive",
};

const statusColors: Record<FeedbackStatus, string> = {
  [FeedbackStatus.Pending]:
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
  [FeedbackStatus.InProgress]:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  [FeedbackStatus.Resolved]:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  [FeedbackStatus.Completed]:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  [FeedbackStatus.Ignored]:
    "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600",
  [FeedbackStatus.Rejected]:
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
};

export function FeedbackList({
  feedbacks,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: FeedbackListProps) {
  const { user } = useAuthStore();
  const { mutate: markAsAcknowledged, isPending } = useMarkAsAcknowledged();

  const handleMarkAsAcknowledged = (feedbackId: string) => {
    if (!user?.id) return;
    markAsAcknowledged({ id: feedbackId, userId: user.id });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border rounded-lg px-4 py-4 animate-pulse space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-5 bg-muted rounded w-20"></div>
              <div className="h-5 bg-muted rounded w-16"></div>
            </div>
            <div className="h-5 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có feedback nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {feedbacks.map((feedback) => {
        const hasResponse = !!feedback.response;
        const isOwner = user?.id === feedback.user_id;
        const isUnread = hasResponse && !feedback.is_acknowledged && isOwner;
        const sanitizedResponse = feedback.response
          ? DOMPurify.sanitize(feedback.response)
          : null;

        return (
          <AccordionItem
            key={feedback.id}
            value={feedback.id}
            className={cn(
              "border rounded-lg px-4 transition-all",
              isUnread && "border-primary shadow-md"
            )}
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start gap-2 w-full pr-4">
                <div className="flex items-center gap-2 flex-wrap w-full">
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[feedback.category]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      statusColors[feedback.status]
                    )}
                  >
                    {statusLabels[feedback.status]}
                  </Badge>
                  {isUnread && (
                    <Badge variant="default" className="text-xs">
                      Mới
                    </Badge>
                  )}
                  {hasResponse && (
                    <Badge variant="secondary" className="text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Đã phản hồi
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-base font-semibold text-left leading-tight">
                    {feedback.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(feedback.created_at), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2 pb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mô tả:</p>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {feedback.description}
                  </p>
                </div>

                {hasResponse && (
                  <>
                    <Separator />
                    <div
                      className={cn(
                        "rounded-lg p-4 space-y-3",
                        isUnread
                          ? "bg-primary/5 border border-primary/20"
                          : "bg-muted/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <p className="text-sm font-semibold">
                            Phản hồi từ admin
                          </p>
                        </div>
                        {feedback.response_at && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(feedback.response_at),
                              {
                                addSuffix: true,
                                locale: vi,
                              }
                            )}
                          </span>
                        )}
                      </div>
                      <div
                        className="text-sm whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{
                          __html: sanitizedResponse || "",
                        }}
                      />
                      {isUnread && isOwner && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsAcknowledged(feedback.id);
                          }}
                          disabled={isPending}
                          className="w-full sm:w-auto"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {isPending ? "Đang xử lý..." : "Đánh dấu OK"}
                        </Button>
                      )}
                      {!isUnread &&
                        feedback.is_acknowledged &&
                        isOwner && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>Đã đánh dấu OK</span>
                          </div>
                        )}
                    </div>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              "Tải thêm"
            )}
          </Button>
        </div>
      )}
      {isFetchingNextPage && (
        <div className="space-y-2 pt-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border rounded-lg px-4 py-4 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="h-5 bg-muted rounded w-20"></div>
                <div className="h-5 bg-muted rounded w-16"></div>
              </div>
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          ))}
        </div>
      )}
    </Accordion>
  );
}
