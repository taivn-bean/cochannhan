"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSwipe } from "@/hooks/use-swipe";
import { Book, Chapter, ChapterListItem, ReaderSettings } from "@/types/type";
import { calculateProgress } from "@/lib/books";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface ReaderContentProps {
  book: Book;
  chapterList: ChapterListItem[];
  settings: ReaderSettings;
  currentChapter: Chapter;
  nextChapter: Chapter | null;
  prevChapter: Chapter | null;
  showControl: boolean;
  setShowControl: Dispatch<SetStateAction<boolean>>;
}

export function ReaderContent({
  book,
  currentChapter,
  chapterList,
  settings,
  nextChapter,
  prevChapter,
  showControl,
  setShowControl,
}: ReaderContentProps) {
  const params = useParams();
  const router = useRouter();
  const bookSlug = params.bookSlug as string;

  const canGoPrevious = prevChapter !== null;
  const canGoNext = nextChapter !== null;

  const handlePrevious = () => {
    if (canGoPrevious) {
      router.push(`/${bookSlug}/${prevChapter.slug}`);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      router.push(`/${bookSlug}/${nextChapter.slug}`);
    }
  };

  // Swipe handlers
  const swipeRef = useSwipe(
    {
      onSwipeLeft: handleNext,
      onSwipeRight: handlePrevious,
    },
    {
      threshold: 100,
      preventDefaultTouchmoveEvent: false,
    }
  );

  return (
    <div className="flex-1 flex flex-col" ref={swipeRef as any}>
      {/* Chapter Header */}
      <div
        style={
          showControl
            ? { position: "sticky", width: "100%", top: 73 }
            : undefined
        }
      >
        <div className="border-b p-3 sm:p-4 bg-background/95">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold line-clamp-1">
                {currentChapter.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {calculateProgress(currentChapter.order, chapterList.length)}%
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={!canGoPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Trước</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={!canGoNext}
              >
                <span className="hidden sm:inline mr-1">Tiếp</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Indicator */}
      {/* <div className="sm:hidden p-2 text-center">
        <p className="text-xs text-muted-foreground">
          💡 Vuốt trái/phải để chuyển chương
        </p>
      </div> */}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div
          className={cn(
            "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8",
            settings.fontFamily
          )}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
          }}
        >
          <div
            className="prose prose-sm sm:prose-lg max-w-none"
            onClick={() => setShowControl((prev) => !prev)}
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1
                    style={{
                      fontSize: `${settings.fontSize + 8}px`,
                      fontWeight: "bold",
                    }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    style={{
                      fontSize: `${settings.fontSize + 4}px`,
                      fontWeight: "bold",
                    }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    style={{
                      fontSize: `${settings.fontSize + 2}px`,
                      fontWeight: "bold",
                    }}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p
                    style={{
                      lineHeight: settings.lineHeight,
                    }}
                  >
                    {children}
                  </p>
                ),
                strong: ({ children }) => <strong>{children}</strong>,
                em: ({ children }) => <em>{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote
                    style={{
                      color: settings.theme === "dark" ? "#a1a1aa" : "#6b7280",
                      borderLeftColor:
                        settings.theme === "dark" ? "#374151" : "#d1d5db",
                    }}
                  >
                    {children}
                  </blockquote>
                ),
                li: ({ children }) => <li>{children}</li>,
              }}
            >
              {currentChapter.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t p-3 sm:p-4 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-2 text-xs sm:text-sm max-w-[40%]"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {canGoPrevious ? prevChapter?.title : "Không có chương trước"}
            </span>
          </Button>

          <div className="text-xs sm:text-sm text-muted-foreground px-4">
            {currentChapter.order} / {chapterList.length}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={!canGoNext}
            className="flex items-center gap-2 text-xs sm:text-sm max-w-[40%]"
          >
            <span className="truncate">
              {canGoNext ? nextChapter?.title : "Không có chương tiếp"}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
