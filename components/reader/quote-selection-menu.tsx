"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2, Copy, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  isNativeShareAvailable,
  isCopyTextAvailable,
  type QuoteData,
} from "@/lib/quote-utils";

interface QuoteSelectionMenuProps {
  quoteData: QuoteData | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onCopy: () => void;
  onPreview?: () => void;
}

export function QuoteSelectionMenu({
  quoteData,
  position,
  onClose,
  onDownload,
  onShare,
  onCopy,
  onPreview,
}: QuoteSelectionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState<{
    x: number;
    y: number;
  } | null>(position);

  useEffect(() => {
    if (!position) {
      setAdjustedPosition(null);
      return;
    }

    // Set initial position (will be adjusted after menu renders)
    setAdjustedPosition({
      x: position.x,
      y: position.y - 50, // Estimate
    });

    // Adjust position after menu is rendered
    const adjustPosition = () => {
      if (!menuRef.current) return;

      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x - rect.width / 2; // Center on selection
      let y = position.y - rect.height - 8; // Position above selection

      // Adjust horizontal position
      if (x + rect.width > viewportWidth - 16) {
        x = viewportWidth - rect.width - 16;
      }
      if (x < 16) {
        x = 16;
      }

      // Adjust vertical position (if doesn't fit above, show below)
      if (y < 16) {
        y = position.y + 24; // Position below selection
      }
      if (y + rect.height > viewportHeight - 16) {
        y = viewportHeight - rect.height - 16;
      }

      setAdjustedPosition({ x, y });
    };

    // Adjust after a short delay to ensure menu is rendered
    const timeoutId = setTimeout(adjustPosition, 0);
    requestAnimationFrame(adjustPosition);

    return () => clearTimeout(timeoutId);
  }, [position]);

  useEffect(() => {
    if (!position) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        // Don't close if clicking on selected text area
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          // Check if click is within the selection range
          const range = selection.getRangeAt(0);
          const clickX = event.clientX;
          const clickY = event.clientY;
          const rect = range.getBoundingClientRect();
          
          // If click is within selection bounds, don't close
          if (
            clickX >= rect.left &&
            clickX <= rect.right &&
            clickY >= rect.top &&
            clickY <= rect.bottom
          ) {
            return;
          }
        }
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Small delay to avoid immediate close
    // Use mousedown instead of click to prevent selection from being cleared
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("keydown", handleEscape);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [position, onClose]);

  if (!quoteData || !adjustedPosition) return null;

  const canShare = isNativeShareAvailable();
  const canCopyText = isCopyTextAvailable();

  return (
    <div
      ref={menuRef}
      data-quote-menu
      className={cn(
        "fixed z-50 flex items-center rounded-lg border bg-popover p-2 shadow-lg",
        "animate-in fade-in-0 zoom-in-95"
      )}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      onClick={(e) => {
        // Prevent clicks on menu from propagating
        e.stopPropagation();
      }}
    >
      {onPreview && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onPreview}
          className="h-8 px-3 text-xs"
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Xem trước
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={onDownload}
        className="h-8 px-3 text-xs"
      >
        <Download className="h-3.5 w-3.5 mr-1.5" />
        Tải xuống
      </Button>

      {canShare && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onShare}
          className="h-8 px-3 text-xs"
        >
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          Chia sẻ
        </Button>
      )}

      {canCopyText && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onCopy}
          className="h-8 px-3 text-xs"
        >
          <Copy className="h-3.5 w-3.5 mr-1.5" />
          Sao chép
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={onClose}
        className="h-8 w-8 p-0"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
