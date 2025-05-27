"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Play,
  RotateCcw,
  Clock,
  User,
  FileText,
  Bookmark,
  Download,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Book, Chapter, ChapterListItem } from "@/types/type";
import { useRouter } from "next/navigation";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { LOCAL_STORAGE_KEY } from "@/constants/common";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { calculateProgress } from "@/lib/books";

interface BookOverviewProps {
  book: Book;
  chapters: ChapterListItem[];
}

export function BookOverview({ book, chapters }: BookOverviewProps) {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const currentChapter = useReadLocalStorage<Chapter | null>(
    LOCAL_STORAGE_KEY.CURRENT_CHAPTER(book.slug)
  );

  useEffect(() => {
    const savedBookmarks = localStorage.getItem(`book-${book.slug}-bookmarks`);

    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, [book.slug]);

  const handleContinueReading = () => {
    const chapter =
      chapters.find((ch) => ch.id === currentChapter?.id) || chapters[0];
    router.push(`/${book.slug}/${chapter.slug}`);
  };

  const handleStartFromBeginning = () => {
    const firstChapter = chapters[0];
    router.push(`/${book.slug}/${firstChapter.slug}`);
  };

  const handleChapterSelect = (chapter: ChapterListItem) => {
    router.push(`/${book.slug}/${chapter.slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Book Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="aspect-[3/4] w-full max-w-64 mx-auto mb-4">
                  <img
                    src={book.coverImage || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
                <CardTitle className="text-xl sm:text-2xl">
                  {book.title}
                </CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4" />
                  {book.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {book.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="text-2xl font-bold">
                    {chapters.length}{" "}
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
                    <Progress value={calculateProgress(currentChapter.order, chapters.length)} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {currentChapter?.order} / {chapters.length}
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
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleChapterSelect(chapter)}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium line-clamp-1">
                            {chapter.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          {bookmarks.includes(chapter.id) && (
                            <Bookmark className="h-4 w-4 text-yellow-500" />
                          )}

                          {currentChapter?.id === chapter.id && (
                            <Badge variant="secondary">Đang đọc</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
