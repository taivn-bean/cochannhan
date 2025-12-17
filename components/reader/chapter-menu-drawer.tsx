"use client";

import { memo, useState } from "react";
import { BookOpen } from "lucide-react";

import ChapterMenu from "../book/chapter-menu";
import type { Book, Chapter, ChapterListItem } from "@/types/type";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ChapterMenuProps {
  book: Book;
  chapterList: Array<ChapterListItem>;
  currentChapter: Chapter;
  isLoading?: boolean;
}

function ChapterMenuDrawer({
  book,
  chapterList,
  currentChapter,
  isLoading,
}: ChapterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" />
          Danh sách chương
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="p-4 w-full max-h-[85dvh]"
        aria-describedby={undefined}
      >
        <SheetHeader>
          <SheetTitle>{book.title}</SheetTitle>
        </SheetHeader>

        <ChapterMenu
          book={book}
          chapterList={chapterList}
          currentChapter={currentChapter}
          isLoading={isLoading}
        />
      </SheetContent>
    </Sheet>
  );
}

export default memo(ChapterMenuDrawer);
