"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ChapterMenuDrawer from "@/components/reader/chapter-menu-drawer";
import { ReaderContent } from "@/components/reader/reader-content";
import { ReaderSettings } from "@/components/reader/reader-settings";
import { useLocalStorage } from "usehooks-ts";
import { LOCAL_STORAGE_KEY } from "@/constants/common";
import { useServices } from "@/hooks/use-services";
import { Chapter } from "@/types/type";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const bookSlug = params.bookSlug as string;
  const chapterSlug = params.chapterSlug as string;
  const [showControl, setShowControl] = useState(false);
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

  return (
    <div
      className="min-h-screen bg-background"
      data-theme={localReaderSettings.theme}
      suppressHydrationWarning
    >
      <div
        className="flex flex-col h-20"
        style={
          showControl
            ? { position: "sticky", width: "100%", top: 0 }
            : undefined
        }
      >
        <div className="flex items-center gap-4 p-4 border-b bg-background/95 ">
          <Button onClick={() => router.replace(`/${bookSlug}`)}>
            <ArrowLeft />
            Back
          </Button>
          {book && chapterData.currentChapter && (
            <ChapterMenuDrawer
              chapterList={chapterList}
              book={book}
              currentChapter={chapterData.currentChapter}
            />
          )}
          {localReaderSettings && (
            <ReaderSettings
              settings={localReaderSettings}
              onSettingsChange={setLocalReaderSettings}
            />
          )}
        </div>
      </div>

      <div>
        {chapterData.currentChapter && book && (
          <ReaderContent
            showControl={showControl}
            setShowControl={setShowControl}
            book={book}
            currentChapter={chapterData.currentChapter}
            settings={localReaderSettings}
            chapterList={chapterList}
            nextChapter={chapterData.nextChapter}
            prevChapter={chapterData.prevChapter}
          />
        )}
      </div>
    </div>
  );
}
