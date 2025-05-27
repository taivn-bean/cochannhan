import { findBookBySlug, findChapterBySlug, findChapterList } from "@/services";
import { useLocalStorage } from "usehooks-ts";
import { LOCAL_STORAGE_KEY } from "@/constants/common";
import { useState, useEffect } from "react";
import { Book, Chapter, ChapterListItem } from "@/types/type";

export const useServices = (slug: string) => {
  const [book, setBook] = useState<Book | undefined>(undefined);
  const [chapterList, setChapterList] = useLocalStorage<ChapterListItem[]>(
    LOCAL_STORAGE_KEY.CHAPTERS(slug),
    []
  );

  const fetchBook = async (slug: string) => {
    const book = findBookBySlug(slug);
    setBook(book);
    return book;
  };

  const fetchChapterList = async (bookSlug: string) => {
    if (chapterList.length) {
      return chapterList;
    }
    const chapters = await findChapterList(bookSlug);
    setChapterList(chapters);
    return chapters;
  };

  const fetchChapterData = async (bookSlug: string, chapterSlug: string) => {
    const currentChapter = await findChapterBySlug(bookSlug, chapterSlug);
    if (!currentChapter) {
      return {
        currentChapter: null,
        prevChapter: null,
        nextChapter: null,
      };
    }
    const prevChapter = await fetchPrevChapter(currentChapter);
    const nextChapter = await fetchNextChapter(currentChapter);
    return {
      currentChapter: currentChapter,
      prevChapter,
      nextChapter,
    };
  };

  const fetchPrevChapter = async (currentChapter: Chapter) => {
    const prevChapter = chapterList.find(
      (chapter) => chapter.order === Number(currentChapter.order) - 1
    );

    if (!prevChapter) {
      return null;
    }
    return findChapterBySlug(slug, prevChapter.slug);
  };

  const fetchNextChapter = async (currentChapter: Chapter) => {
    const nextChapter = chapterList.find(
      (chapter) => chapter.order === Number(currentChapter.order) + 1
    );

    if (!nextChapter) {
      return null;
    }
    return findChapterBySlug(slug, nextChapter.slug);
  };

  useEffect(() => {
    fetchBook(slug);
    fetchChapterList(slug);
  }, [slug]);

  return {
    book,
    chapterList: chapterList,
    fetchBook,
    fetchChapterList,
    fetchChapter: fetchChapterData,
  };
};
