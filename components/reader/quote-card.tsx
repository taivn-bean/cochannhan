"use client";

import { cn } from "@/lib/utils";
import type { ReaderSettings } from "@/types/type";
import type { Book, Chapter } from "@/types/type";

interface QuoteCardProps {
  quote: string;
  book: Book;
  chapter: Chapter;
  settings: ReaderSettings;
  className?: string;
}

export function QuoteCard({
  quote,
  book,
  chapter,
  settings,
  className,
}: QuoteCardProps) {
  const isDark = settings.theme === "dark";

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl mx-auto p-4 rounded-2xl",
        isDark ? "bg-gray-900" : "bg-white",
        className
      )}
      style={{
        fontFamily: settings.fontFamily,
      }}
    >
      {/* Decorative quote mark */}
      <div
        className={cn(
          "absolute top-4 left-4 sm:top-6 sm:left-6 text-6xl sm:text-8xl font-serif leading-none opacity-20",
          isDark ? "text-gray-400" : "text-gray-300"
        )}
      >
        "
      </div>

      {/* Quote text */}
      <div className="relative z-10">
        <p
          className={cn(
            "text-lg sm:text-xl md:text-2xl font-medium leading-relaxed mb-4 whitespace-pre-line",
            isDark ? "text-gray-100" : "text-gray-900"
          )}
          style={{
            lineHeight: settings.lineHeight,
            fontSize: "17px",
          }}
        >
          {quote}
        </p>

        {/* Attribution */}
        <div className="border-t pt-4 sm:pt-6">
          <p
            className={cn(
              "text-sm sm:text-base font-semibold mb-1",
              isDark ? "text-gray-200" : "text-gray-800"
            )}
          >
            {book.title}
            {" - "}
            <span
              className={cn(
                "text-xs sm:text-sm",
                isDark ? "text-gray-400" : "text-gray-600"
              )}
            >
              {chapter.title}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
