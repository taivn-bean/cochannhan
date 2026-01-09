"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Share2, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteCard } from "./quote-card";
import {
  generateQuoteImage,
  downloadQuoteImage,
  copyQuoteImageToClipboard,
  shareQuoteImage,
  isNativeShareAvailable,
  isCopyToClipboardAvailable,
  type QuoteData,
} from "@/lib/quote-utils";
import { useToast } from "@/components/ui/use-toast";

interface QuoteShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quoteData: QuoteData | null;
}

export function QuoteShareDialog({
  isOpen,
  onClose,
  quoteData,
}: QuoteShareDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const quoteCardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Reset generating state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsGenerating(false);
    }
  }, [isOpen]);

  if (!quoteData) return null;

  const handleDownload = async () => {
    if (!quoteCardRef.current) return;

    setIsGenerating(true);
    try {
      const blob = await generateQuoteImage(quoteCardRef.current);
      const filename = `quote-${quoteData.book.slug}-${Date.now()}.png`;
      downloadQuoteImage(blob, filename);
      toast({
        title: "Thành công",
        description: "Đã tải xuống hình ảnh trích dẫn",
      });
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo hình ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!quoteCardRef.current) return;

    setIsGenerating(true);
    try {
      const blob = await generateQuoteImage(quoteCardRef.current);
      await shareQuoteImage(blob, quoteData);
      toast({
        title: "Thành công",
        description: "Đã chia sẻ trích dẫn",
      });
    } catch (error) {
      console.error("Failed to share:", error);
      toast({
        title: "Lỗi",
        description: "Không thể chia sẻ. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!quoteCardRef.current) return;

    setIsGenerating(true);
    try {
      const blob = await generateQuoteImage(quoteCardRef.current);
      await copyQuoteImageToClipboard(blob);
      toast({
        title: "Thành công",
        description: "Đã sao chép hình ảnh vào clipboard",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Lỗi",
        description: "Không thể sao chép. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const canShare = isNativeShareAvailable();
  const canCopy = isCopyToClipboardAvailable();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Chia sẻ trích dẫn</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Card Preview */}
          <div className="flex justify-center bg-muted/30 p-0 rounded-lg">
            <div ref={quoteCardRef} className="w-full">
              <QuoteCard
                quote={quoteData.text}
                book={quoteData.book}
                chapter={quoteData.chapter}
                settings={quoteData.settings}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center">
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1"
              variant="outline"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Tải xuống
            </Button>

            {canShare && (
              <Button
                onClick={handleShare}
                disabled={isGenerating}
                className="flex-1"
                variant="outline"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4 mr-2" />
                )}
                Chia sẻ
              </Button>
            )}

            {canCopy && (
              <Button
                onClick={handleCopy}
                disabled={isGenerating}
                className="flex-1"
                variant="outline"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Sao chép
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
