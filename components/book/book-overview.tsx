"use client";

import { BookOpen, FileText, Play, RotateCcw, User } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import ChapterMenu from "./chapter-menu";
import type { Book, ChapterListItem } from "@/types/type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRecentAccessStore } from "@/stores/recent-access.store";
import { calculateProgress } from "@/lib/books";
import { useRouter } from "next/navigation";

interface BookOverviewProps {
  book: Book;
  chapters: Array<ChapterListItem>;
  isLoading?: boolean;
}

export function BookOverview({
  book,
  chapters = [],
  isLoading,
}: BookOverviewProps) {
  const router = useRouter();
  const { items: recentItems } = useRecentAccessStore();

  const currentChapter = chapters.find((chapter) => {
    const recentItem = recentItems.find(
      (item) => item.chapterSlug === chapter.slug
    );
    return recentItem;
  });

  const lastReadChapter = recentItems.find(
    (item) => item.bookSlug === book.slug
  );

  const handleContinueReading = () => {
    if (lastReadChapter) {
      router.push(`/${book.slug}/${lastReadChapter.chapterSlug}`);
    } else if (chapters.length > 0) {
      router.push(`/${book.slug}/${chapters[0].slug}`);
    }
  };

  const handleStartFromBeginning = () => {
    if (chapters.length > 0) {
      router.push(`/${book.slug}/${chapters[0].slug}`);
    }
  };

  /*
  Check só lượng chapter
  */
  // useEffect(() => {
  //   (async () => {
  //     const chapters = await firebaseService.fetchAllFilesInFolder(`/${book.slug}/chapters`)
  //     console.log(chapters)
  //   })()
  // }, [])

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Book Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="aspect-[2/3] w-full max-w-64 mx-auto mb-4">
                  <img
                    loading="lazy"
                    src={book?.coverImage || "/placeholder.svg"}
                    alt={book?.title || ""}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
                <CardTitle className="text-xl sm:text-2xl">
                  {book?.title || ""}
                </CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4" />
                  {book?.author || ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {book?.description || ""}
                </p>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="text-2xl font-bold">
                    {chapters.length || 0}{" "}
                    <span className="text-xs text-muted-foreground">
                      Chương
                    </span>
                  </div>
                </div>

                {currentChapter && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tiến độ đọc</span>
                      <span className="font-medium">
                        {calculateProgress(
                          currentChapter.order,
                          chapters.length
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(
                        currentChapter.order,
                        chapters.length
                      )}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {currentChapter.order} / {chapters.length}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleStartFromBeginning}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Đọc từ đầu
                </Button>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {currentChapter ? (
                    <>
                      <Button
                        onClick={handleContinueReading}
                        className="w-full"
                        size="lg"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Đọc tiếp
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {currentChapter.title}
                      </span>
                    </>
                  ) : (
                    <Button
                      onClick={handleStartFromBeginning}
                      className="w-full"
                      size="lg"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Bắt đầu đọc
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chapter List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Danh sách chương
                </CardTitle>
                <CardDescription>Chọn chương để bắt đầu đọc</CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-2">
                <ChapterMenu
                  book={book}
                  chapterList={chapters}
                  currentChapter={currentChapter}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
