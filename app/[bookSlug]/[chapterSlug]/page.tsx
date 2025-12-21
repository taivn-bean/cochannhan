"use client";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import ChapterMenuDrawer from "@/components/reader/chapter-menu-drawer";
import { ReaderContent } from "@/components/reader/reader-content";
import { ReaderSettings } from "@/components/reader/reader-settings";
// import { ChapterErrorFallback } from "@/components/reader/chapter-error-fallback";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-sprinner";
import {
  useFetchBookBySlug,
  useFetchChapterData,
  useFetchChapterList,
} from "@/hooks/queries/books";
import { recentAccessActions } from "@/stores/recent-access.store";
import { useReaderSettingsStore } from "@/stores/reader-settings.store";
import { useParams, useRouter } from "next/navigation";

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const bookSlug = params.bookSlug as string;
  const chapterSlug = params.chapterSlug as string;

  const [showControl, setShowControl] = useState(false);

  const { data: book } = useFetchBookBySlug(bookSlug);
  const { data: chapterList, isLoading: isLoadingChapterList } =
    useFetchChapterList(bookSlug);
  const {
    data: chapterData,
    isLoading,
    error,
  } = useFetchChapterData(bookSlug, chapterSlug);

  const { settings } = useReaderSettingsStore();

  // ✅ Add to recent access when chapter loads
  useEffect(() => {
    if (chapterData?.currentChapter) {
      recentAccessActions.addRecentAccess({
        title: chapterData.currentChapter.title,
        bookSlug,
        chapterSlug,
      });
    }
  }, [chapterData?.currentChapter, bookSlug, chapterSlug]);

  // Show error fallback if chapter fails to load
  // if (error && book) {
  //   return (
  //     <ChapterErrorFallback
  //       bookSlug={bookSlug}
  //       bookTitle={book.title}
  //       chapterSlug={chapterSlug}
  //       chapterTitle={chapterData?.currentChapter?.title || chapterSlug}
  //       error={error}
  //     />
  //   );
  // }

  return (
    <div
      className="min-h-screen bg-background"
      data-theme={settings.theme}
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
          {book && chapterList && chapterData?.currentChapter && (
            <ChapterMenuDrawer
              chapterList={chapterList}
              book={book}
              currentChapter={chapterData.currentChapter}
              isLoading={isLoadingChapterList}
            />
          )}
          <ReaderSettings />
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      <div>
        {!isLoading && chapterData?.currentChapter && book && (
          <div className="pb-10">
            <ReaderContent
              showControl={showControl}
              setShowControl={setShowControl}
              book={book}
              currentChapter={chapterData.currentChapter}
              chapterList={chapterList || []}
              nextMeta={chapterData.nextMeta}
              prevMeta={chapterData.prevMeta}
            />
            {/* 
            <div className="container mx-auto px-4 mt-8 pt-8 border-t">
              <CommentSection bookSlug={bookSlug} chapterSlug={chapterSlug} />
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
