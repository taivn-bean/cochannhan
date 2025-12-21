"use client";

import { Book, LogIn } from "lucide-react";
import { UserAvatar } from "../auth/user-avatar";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { NAV_ITEMS } from "@/constants/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";

export function Header() {
  const { user } = useAuthStore();

  const NavItems = () => (
    <>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
        >
          {/* Show icon for Support item specifically or generally if improved design needed */}
          {item.href === "/support" && (
            <item.icon className={`h-4 w-4 ${item.className || ""}`} />
          )}
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Mobile Menu */}
          <MobileNav />

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Book className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-bold text-base sm:text-lg hidden sm:inline-block">
              Cổ Chân Nhân
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavItems />
          </nav>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ModeToggle />

          {user ? (
            <UserAvatar />
          ) : (
            <Link href="/login">
              <Button size="sm" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng Nhập</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
