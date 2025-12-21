import { Book, Heart, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  className?: string; // Optional className
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Đọc Truyện",
    href: "/",
    icon: Book,
  },
  {
    label: "Góp ý - Báo lỗi",
    href: "/feedback",
    icon: MessageSquare,
  },
  {
    label: "Ủng Hộ",
    href: "/support",
    icon: Heart,
    className: "text-red-500 fill-red-500",
  },
];
