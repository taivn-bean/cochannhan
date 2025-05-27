"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Book, Heart } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Book className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="font-bold text-base sm:text-lg">Cổ Chân Nhân</span>
        </Link>

        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Link href="/support">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sm:inline">Ủng Hộ Tôi</span>
            </Button>
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
