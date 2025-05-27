"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ChapterMenu from "@/components/reader/chapter-menu";
import { ReaderContent } from "@/components/reader/reader-content";
import { ReaderSettings } from "@/components/reader/reader-settings";
import { useLocalStorage } from "usehooks-ts";
import { LOCAL_STORAGE_KEY } from "@/constants/common";
import { useServices } from "@/hooks/use-services";
import { Chapter } from "@/types/type";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-sprinner";
import { useRouter } from "next/navigation";

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const bookSlug = params.bookSlug as string;
  const chapterSlug = params.chapterSlug as string;
  const [chapterData, setChapterData] = useState<{
    currentChapter: Chapter | null;
    nextChapter: Chapter | null;
    prevChapter: Chapter | null;
  }>({
    currentChapter: null,
    nextChapter: null,
    prevChapter: null,
  });

  const { book, chapterList, fetchChapter } = useServices(bookSlug);
  const [localReaderSettings, setLocalReaderSettings] = useLocalStorage(
    LOCAL_STORAGE_KEY.READER_SETTINGS,
    {
      fontSize: 16,
      fontFamily: "Inter",
      theme: "light",
      lineHeight: 1.6,
    }
  );
  const [, setCurrentChapter] = useLocalStorage<Chapter | null>(
    LOCAL_STORAGE_KEY.CURRENT_CHAPTER(bookSlug),
    null
  );
  const [readerSettings, setReaderSettings] = useState(localReaderSettings);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const chapterData = await fetchChapter(bookSlug, chapterSlug);

        // Save current chapter to localStorage
        if (chapterData) {
          setChapterData(chapterData);
          setCurrentChapter(chapterData.currentChapter);
        }
      } catch (error) {
        console.error("Error loading book:", error);
      }
    };

    if (bookSlug) {
      loadBook();
    }
  }, [bookSlug, chapterSlug]);

  useEffect(() => {
    setLocalReaderSettings(readerSettings);
  }, [readerSettings]);

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sách</h1>
          <p className="text-muted-foreground">
            Slug "{bookSlug}" không tồn tại trong hệ thống.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background"
      data-theme={readerSettings.theme}
    >
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="flex items-center gap-4  p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button onClick={() => router.replace(`/${bookSlug}`)}>
            <ArrowLeft />
            Back
          </Button>
          {book && chapterData.currentChapter && (
            <ChapterMenu
              chapterList={chapterList}
              book={book}
              currentChapter={chapterData.currentChapter}
            />
          )}
          {readerSettings && (
            <ReaderSettings
              settings={readerSettings}
              onSettingsChange={setReaderSettings}
            />
          )}
        </div>
        {chapterData.currentChapter && (
          <ReaderContent
            book={book}
            currentChapter={chapterData.currentChapter}
            settings={readerSettings}
            chapterList={chapterList}
            nextChapter={chapterData.nextChapter}
            prevChapter={chapterData.prevChapter}
          />
        )}
      </div>
    </div>
  );
}
