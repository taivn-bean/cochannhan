"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Book, Chapter, ChapterListItem } from "@/types/type";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useReaderSettingsStore } from "@/stores/reader-settings.store";
import { useRouter } from "next/navigation";
import { calculateProgress } from "@/lib/books";
import { QuoteShareDialog } from "./quote-share-dialog";
import { QuoteSelectionMenu } from "./quote-selection-menu";
import { QuoteCard } from "./quote-card";
import {
  generateQuoteImage,
  downloadQuoteImage,
  copyQuoteImageToClipboard,
  copyTextToClipboard,
  shareQuoteImage,
  extractTextWithFormat,
  type QuoteData,
} from "@/lib/quote-utils";
import { useToast } from "@/components/ui/use-toast";

interface ReaderContentProps {
  book: Book;
  chapterList: Array<ChapterListItem>;
  currentChapter: Chapter;
  prevMeta?: ChapterListItem;
  nextMeta?: ChapterListItem;
  showControl: boolean;
  setShowControl: Dispatch<SetStateAction<boolean>>;
}

export function ReaderContent({
  book,
  currentChapter,
  chapterList,
  nextMeta,
  prevMeta,
  showControl,
  setShowControl,
}: ReaderContentProps) {
  const router = useRouter();
  const { settings } = useReaderSettingsStore();
  const { toast } = useToast();
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  const canGoPrevious = prevMeta !== undefined;
  const canGoNext = nextMeta !== undefined;

  const handlePrevious = () => {
    if (canGoPrevious) {
      router.push(`/${book.slug}/${prevMeta.slug}`);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      router.push(`/${book.slug}/${nextMeta.slug}`);
    }
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setMenuPosition(null);
      savedSelectionRef.current = null;
      return;
    }

    // Check if selection is within the content area
    const range = selection.getRangeAt(0);
    const contentElement = contentRef.current;
    if (
      !contentElement ||
      !contentElement.contains(range.commonAncestorContainer)
    ) {
      setMenuPosition(null);
      savedSelectionRef.current = null;
      return;
    }

    // Extract text with format (preserving line breaks)
    const selectedText = extractTextWithFormat(range).trim();
    if (selectedText.length < 10) {
      setMenuPosition(null);
      savedSelectionRef.current = null;
      return; // Minimum quote length
    }

    const sanitizedText = selectedText;
    if (sanitizedText.length < 50) {
      setMenuPosition(null);
      savedSelectionRef.current = null;
      return;
    }

    // Save the selection range before showing menu (to restore it if browser clears it)
    savedSelectionRef.current = range.cloneRange();

    // Get position of selection
    const rect = range.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top,
    };

    setSelectedQuote({
      text: sanitizedText,
      book,
      chapter: currentChapter,
      settings,
    });
    setMenuPosition(position);

    // Restore selection after a short delay to ensure it's visible
    // This prevents browser from clearing selection when menu appears
    setTimeout(() => {
      if (savedSelectionRef.current) {
        const currentSelection = window.getSelection();
        if (currentSelection) {
          currentSelection.removeAllRanges();
          currentSelection.addRange(savedSelectionRef.current);
        }
      }
    }, 0);
  }, [book, currentChapter, settings]);

  const handleDownload = async () => {
    if (!selectedQuote || !quoteCardRef.current) return;

    try {
      const blob = await generateQuoteImage(quoteCardRef.current);
      const filename = `quote-${selectedQuote.book.slug}-${Date.now()}.png`;
      downloadQuoteImage(blob, filename);
      toast({
        title: "Thành công",
        description: "Đã tải xuống hình ảnh trích dẫn",
      });
      setMenuPosition(null);
      savedSelectionRef.current = null;
      // Clear selection
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo hình ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!selectedQuote || !quoteCardRef.current) return;

    try {
      const blob = await generateQuoteImage(quoteCardRef.current);
      await shareQuoteImage(blob, selectedQuote);
      toast({
        title: "Thành công",
        description: "Đã chia sẻ trích dẫn",
      });
      setMenuPosition(null);
      savedSelectionRef.current = null;
      // Clear selection
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      console.error("Failed to share:", error);
      toast({
        title: "Lỗi",
        description: "Không thể chia sẻ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleCopyText = async () => {
    if (!selectedQuote) return;

    try {
      await copyTextToClipboard(selectedQuote.text);
      toast({
        title: "Thành công",
        description: "Đã sao chép văn bản vào clipboard",
      });
      setMenuPosition(null);
      savedSelectionRef.current = null;
      // Clear selection after copying
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast({
        title: "Lỗi",
        description: "Không thể sao chép văn bản. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleCopyImage = async () => {
    if (!selectedQuote || !quoteCardRef.current) return;

    try {
      const blob = await generateQuoteImage(quoteCardRef.current);
      await copyQuoteImageToClipboard(blob);
      toast({
        title: "Thành công",
        description: "Đã sao chép hình ảnh vào clipboard",
      });
      setMenuPosition(null);
      savedSelectionRef.current = null;
      // Clear selection after copying
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      console.error("Failed to copy image:", error);
      toast({
        title: "Lỗi",
        description: "Không thể sao chép hình ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = () => {
    setIsQuoteDialogOpen(true);
    setMenuPosition(null);
    // Don't clear selection when opening dialog - user might want to see what they selected
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    let isSelecting = false;
    let selectionTimeout: NodeJS.Timeout | null = null;

    // Handle mouse/touch end (when user finishes selecting)
    const handleSelectionEnd = () => {
      // Clear any pending timeout
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }

      // Small delay to ensure selection is complete and stable
      selectionTimeout = setTimeout(() => {
        handleTextSelection();
        isSelecting = false;
      }, 150);
    };

    // Track when user starts selecting (mousedown/touchstart)
    const handleSelectionStart = () => {
      isSelecting = true;
      // Clear menu if user starts a new selection
      setMenuPosition(null);
    };

    // Listen for mouse events (desktop)
    contentElement.addEventListener("mousedown", handleSelectionStart);
    contentElement.addEventListener("mouseup", handleSelectionEnd);

    // Listen for touch events (mobile)
    contentElement.addEventListener("touchstart", handleSelectionStart, {
      passive: true,
    });
    contentElement.addEventListener("touchend", handleSelectionEnd, {
      passive: true,
    });

    return () => {
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }
      contentElement.removeEventListener("mousedown", handleSelectionStart);
      contentElement.removeEventListener("mouseup", handleSelectionEnd);
      contentElement.removeEventListener("touchstart", handleSelectionStart);
      contentElement.removeEventListener("touchend", handleSelectionEnd);
    };
  }, [handleTextSelection]);

  return (
    <div className="flex-1 flex flex-col">
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
            ref={contentRef}
            className="prose prose-sm sm:prose-lg max-w-none select-text"
            onClick={(e) => {
              // Only toggle control if no text is selected and not clicking on menu
              const selection = window.getSelection();
              const target = e.target as HTMLElement;

              // Don't toggle if clicking on menu
              if (target.closest("[data-quote-menu]")) {
                return;
              }

              // Close menu if clicking without selection
              if (!selection || selection.toString().length === 0) {
                setMenuPosition(null);
                setShowControl((prev) => !prev);
                return;
              }
            }}
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
              {canGoPrevious ? prevMeta.title : "Không có chương trước"}
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
              {canGoNext ? nextMeta.title : "Không có chương tiếp"}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Button>
        </div>
      </div>

      {/* Quote Selection Menu */}
      <QuoteSelectionMenu
        quoteData={selectedQuote}
        position={menuPosition}
        onClose={() => {
          setMenuPosition(null);
          savedSelectionRef.current = null;
          // Clear selection when closing menu
          window.getSelection()?.removeAllRanges();
        }}
        onPreview={handleOpenDialog}
        onDownload={handleDownload}
        onShare={handleShare}
        onCopy={handleCopyText}
      />

      {/* Hidden quote card for image generation */}
      {selectedQuote && (
        <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
          <div ref={quoteCardRef}>
            <QuoteCard
              quote={selectedQuote.text}
              book={selectedQuote.book}
              chapter={selectedQuote.chapter}
              settings={selectedQuote.settings}
            />
          </div>
        </div>
      )}

      {/* Quote Share Dialog */}
      <QuoteShareDialog
        isOpen={isQuoteDialogOpen}
        onClose={() => setIsQuoteDialogOpen(false)}
        quoteData={selectedQuote}
      />
    </div>
  );
}
