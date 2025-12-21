import { Book } from "@/types/type";

export const mockBooks: Book[] = [
  {
    id: "1",
    author: "Cổ Chân Nhân",
    cover: "",
    description: "",
    slug: "co-chan-nhan",
    title: "Cổ Chân Nhân",
    chapters: 3802,
    coverImage: "/images/cover_image_u3.jpg",
  },
  
  {
    id: "2",
    author: "Cổ Chân Nhân",
    cover: "",
    description: "",
    slug: "nhan-to-truyen",
    title: "Nhân Tổ Truyện",
    chapters: 40,
    coverImage: "/images/nhan-to-truyen.jpg",
  },
  {
    id: "2",
    author: "Gu Zhen Re",
    cover: "",
    description: "",
    slug: "reverend-insanity",
    title: "Reverend Insanity",
    chapters: 2334,
    coverImage: "/images/reverend-insanity.jpg",
  }
];

export const LOCAL_STORAGE_KEY = {
  CHAPTERS: (bookSlug: string) => `chapters-${bookSlug}`,
  READER_SETTINGS: "reader-settings",
  LAST_READER: "last-reader",
  CURRENT_CHAPTER: (bookSlug: string) => `current-chapter-${bookSlug}`,
  BOOKMARKS: (bookSlug: string) => `bookmarks-${bookSlug}`,
};
