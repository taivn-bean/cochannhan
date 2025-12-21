"use client";
import { LogOut, MessageSquare, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/queries/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserAvatar({ className }: { className?: string }) {
  const { user } = useAuthStore();
  const displayName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    "Chưa cập nhật";
  const { mutate: logout } = useLogout();

  const router = useRouter();

  // Get user initials from display name or email
  const getInitials = () => {
    if (displayName) {
      const names = displayName.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return displayName.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-5 w-5 rounded-full"
        >
          <Avatar className={cn(className)}>
            <AvatarImage
              src={user?.user_metadata?.avatar_url || undefined}
              alt={displayName || user?.email || "User avatar"}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {displayName ? getInitials() : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <Link href="/bookmarks" className="cursor-pointer">
            <BookMarked className="mr-2 h-4 w-4" />
            <span>Bookmarks</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài Đặt</span>
          </Link>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài Đặt</span>
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem asChild>
          <Link href="/feedback" className="cursor-pointer">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Góp ý & Báo lỗi</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
