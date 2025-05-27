"use client";

import { useState, memo } from "react";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Chapter, Book, ChapterListItem } from "@/types/type";
import ChapterMenu from "../book/chapter-menu";

interface ChapterMenuProps {
  book: Book;
  chapterList: ChapterListItem[];
  currentChapter: Chapter;
}

function ChapterMenuDrawer({
  book,
  chapterList,
  currentChapter,
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

      <SheetContent side="left" className="w-full sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{book.title}</SheetTitle>
        </SheetHeader>

        <ChapterMenu
          book={book}
          chapterList={chapterList}
          currentChapter={currentChapter}
        />
      </SheetContent>
    </Sheet>
  );
}

export default memo(ChapterMenuDrawer);
