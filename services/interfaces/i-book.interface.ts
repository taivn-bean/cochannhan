import { Book, Chapter, ChapterListItem } from "@/types/type";

export interface IBookService {
  findAllBooks(): Array<Book>;
  fetchBookBySlug(slug: string): Book | undefined;
  fetchChapterList(bookSlug: string): Promise<Array<ChapterListItem>>;
  fetchChapterBySlug(bookSlug: string, chapterSlug: string): Promise<Chapter | null>;
}
