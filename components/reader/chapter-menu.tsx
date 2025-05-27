"use client";

import { useState, useMemo, memo } from "react";
import { Bookmark, BookmarkCheck, BookOpen, Search } from "lucide-react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Chapter, Book, ChapterListItem } from "@/types/type";

interface ChapterMenuProps {
  book: Book;
  chapterList: ChapterListItem[];
  currentChapter: Chapter;
}

function ChapterMenu({ book, chapterList, currentChapter }: ChapterMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const toggleBookmark = (chapterId: string) => {
    setBookmarks((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleChapterSelect = (chapter: ChapterListItem) => {
    router.push(`/${book.slug}/${chapter.slug}`);
    setIsOpen(false);
  };

  const filteredChapters = useMemo(() => {
    return chapterList.filter((chapter) =>
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chapterList, searchQuery]);

  const currentIndex = useMemo(
    () => filteredChapters.findIndex((c) => c.id === currentChapter.id),
    [filteredChapters, currentChapter.id]
  );

  const itemHeight = 44;
  const listHeight = 500;

  const Row = ({ index, style }: ListChildComponentProps) => {
    const chapter = filteredChapters[index];

    return (
      <div style={style} key={chapter.id} className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleBookmark(chapter.id)}
          className="p-2 h-8 w-8 shrink-0"
        >
          {bookmarks.includes(chapter.id) ? (
            <BookmarkCheck className="h-4 w-4 text-yellow-500" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={() => handleChapterSelect(chapter)}
          className={cn(
            "flex-1 justify-start h-auto p-3 text-left",
            currentChapter.id === chapter.id &&
              "bg-accent text-accent-foreground"
          )}
        >
          <div className="flex flex-col items-start gap-1">
            <span className="line-clamp-2 text-sm font-medium">
              {chapter.title}
            </span>
          </div>
        </Button>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" />
          Danh sách chương
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{book.title}</SheetTitle>
        </SheetHeader>

        <div className="p-2 space-y-4">
          <Input
            placeholder="Tìm chương..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium text-sm">
                {searchQuery
                  ? `Kết quả tìm kiếm (${filteredChapters.length})`
                  : "Danh sách chương"}
              </span>
            </div>

            {filteredChapters.length > 0 ? (
              <List
                initialScrollOffset={currentIndex * itemHeight}
                height={listHeight}
                itemCount={filteredChapters.length}
                itemSize={itemHeight}
                width="100%"
                className="border rounded-md overflow-x-hidden"
              >
                {Row}
              </List>
            ) : searchQuery ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Không tìm thấy chương nào</p>
              </div>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default memo(ChapterMenu);
