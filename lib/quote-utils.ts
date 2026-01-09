import html2canvas from "html2canvas";
import type { Book, Chapter, ReaderSettings } from "@/types/type";

export interface QuoteData {
  text: string;
  book: Book;
  chapter: Chapter;
  settings: ReaderSettings;
}

/**
 * Generates a PNG image from a quote card element
 */
export async function generateQuoteImage(
  element: HTMLElement,
  options?: { scale?: number }
): Promise<Blob> {
  const scale = options?.scale ?? 2; // Higher scale for better quality

  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: null,
    useCORS: true,
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to generate image blob"));
        }
      },
      "image/png",
      1.0
    );
  });
}

/**
 * Downloads the quote image
 */
export function downloadQuoteImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies text to clipboard
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch (err) {
      document.body.removeChild(textArea);
      throw new Error("Copy to clipboard not supported in this browser");
    }
  }
}

/**
 * Copies the quote image to clipboard
 */
export async function copyQuoteImageToClipboard(blob: Blob): Promise<void> {
  try {
    const item = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([item]);
  } catch (error) {
    // Fallback for browsers that don't support ClipboardItem
    throw new Error("Copy to clipboard not supported in this browser");
  }
}

/**
 * Shares the quote image using native share API
 */
export async function shareQuoteImage(
  blob: Blob,
  quoteData: QuoteData
): Promise<void> {
  if (!navigator.share) {
    throw new Error("Native share not supported");
  }

  const file = new File([blob], `quote-${quoteData.book.slug}.png`, {
    type: "image/png",
  });

  await navigator.share({
    title: `Trích dẫn từ ${quoteData.book.title}`,
    text: `"${quoteData.text}" - ${quoteData.chapter.title}`,
    files: [file],
  });
}

/**
 * Checks if native share is available
 */
export function isNativeShareAvailable(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/**
 * Checks if copy to clipboard is available (for images)
 */
export function isCopyToClipboardAvailable(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.clipboard &&
    !!window.ClipboardItem
  );
}

/**
 * Checks if copy text to clipboard is available
 */
export function isCopyTextAvailable(): boolean {
  return (
    typeof navigator !== "undefined" &&
    (!!navigator.clipboard || !!document.execCommand)
  );
}

/**
 * Extracts text from a range while preserving line breaks
 */
export function extractTextWithFormat(range: Range): string {
  const clonedContents = range.cloneContents();
  const div = document.createElement("div");
  div.appendChild(clonedContents);

  // Get text content while preserving line breaks from block elements
  let text = "";
  const walker = document.createTreeWalker(
    div,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return NodeFilter.FILTER_ACCEPT;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          // Block elements should add newline
          if (
            element.tagName === "P" ||
            element.tagName === "DIV" ||
            element.tagName === "BR" ||
            element.tagName === "H1" ||
            element.tagName === "H2" ||
            element.tagName === "H3" ||
            element.tagName === "H4" ||
            element.tagName === "H5" ||
            element.tagName === "H6" ||
            element.tagName === "LI"
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
        }
        return NodeFilter.FILTER_SKIP;
      },
    }
  );

  let node;
  let lastWasBlock = false;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || "";
      lastWasBlock = false;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.tagName === "BR") {
        text += "\n";
        lastWasBlock = false;
      } else if (
        element.tagName === "P" ||
        element.tagName === "DIV" ||
        element.tagName === "H1" ||
        element.tagName === "H2" ||
        element.tagName === "H3" ||
        element.tagName === "H4" ||
        element.tagName === "H5" ||
        element.tagName === "H6" ||
        element.tagName === "LI"
      ) {
        // Add newline before block elements (except first)
        if (text && !lastWasBlock && !text.endsWith("\n")) {
          text += "\n";
        }
        lastWasBlock = true;
      }
    }
  }

  // Clean up: normalize whitespace but keep line breaks
  return text
    .replace(/[ \t]+/g, " ") // Replace multiple spaces/tabs with single space
    .replace(/[ \t]*\n[ \t]*/g, "\n") // Remove spaces around newlines
    .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with 2
    .trim();
}
