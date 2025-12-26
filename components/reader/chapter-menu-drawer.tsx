"use client";

import { memo, useState } from "react";
import { BookOpen } from "lucide-react";

import ChapterMenu from "../book/chapter-menu";
import type { Book, Chapter, ChapterListItem } from "@/types/type";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" />
          Danh sách chương
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-4 w-full max-h-[85dvh]">
        <DrawerHeader>
          <DrawerTitle>{book.title}</DrawerTitle>
        </DrawerHeader>

        <ChapterMenu
          book={book}
          chapterList={chapterList}
          currentChapter={currentChapter}
          isLoading={isLoading}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default memo(ChapterMenuDrawer);
