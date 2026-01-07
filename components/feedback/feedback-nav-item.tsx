"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useUnreadFeedbackCount } from "@/hooks/queries/feedback";
import { useAuthStore } from "@/stores/auth.store";

interface FeedbackNavItemProps {
  href: string;
  label: string;
  className?: string;
  showBadge?: boolean;
}

export function FeedbackNavItem({
  href,
  label,
  className,
  showBadge = true,
}: FeedbackNavItemProps) {
  const { user } = useAuthStore();
  const { data: unreadCount = 0 } = useUnreadFeedbackCount(
    showBadge ? user?.id : undefined
  );

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 relative",
        className
      )}
    >
      <MessageSquare className={cn("h-4 w-4", className)} />
      <span>{label}</span>
      {showBadge && unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold rounded-full min-w-[20px]"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Link>
  );
}
