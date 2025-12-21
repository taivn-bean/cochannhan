// stores/bookmarkStore.ts
import { Store, useStore } from "@tanstack/react-store";
import { debounceSave, loadFromLocalStorage } from "@/lib/localstorage";

export interface BookmarkState {
  bookmarks: Record<string, Array<string>>;
}

const initialState: BookmarkState = {
  bookmarks: {},
};

const STORAGE_KEY = "bookmarks-store";

export const bookmarkStore = new Store<BookmarkState>(
  loadFromLocalStorage(STORAGE_KEY, initialState)
);

bookmarkStore.subscribe(() => {
  debounceSave(STORAGE_KEY, bookmarkStore.state);
});

const bookmarkActions = {
  // ✅ FIX: Add bookmark - tạo array MỚI
  addBookmark: (bookSlug: string, chapterSlug: string) => {
    bookmarkStore.setState((state) => {
      const existingBookmarks = state.bookmarks[bookSlug] || [];

      // Check nếu đã tồn tại thì skip
      if (existingBookmarks.includes(chapterSlug)) {
        return state; // Không thay đổi gì
      }

      // ✅ Tạo array MỚI
      const updatedBookmarks = [...existingBookmarks, chapterSlug];

      // ✅ Tạo object MỚI
      return {
        bookmarks: {
          ...state.bookmarks,
          [bookSlug]: updatedBookmarks,
        },
      };
    });
  },

  // ✅ FIX: Remove bookmark - tạo array MỚI
  removeBookmark: (bookSlug: string, chapterSlug: string) => {
    bookmarkStore.setState((state) => {
      const existingBookmarks = state.bookmarks[bookSlug];

      // ✅ Tạo array MỚI
      const updatedBookmarks = existingBookmarks.filter(
        (b) => b !== chapterSlug
      );

      // Nếu không có thay đổi, return state cũ
      if (updatedBookmarks.length === existingBookmarks.length) {
        return state;
      }

      // ✅ Tạo object MỚI
      return {
        bookmarks: {
          ...state.bookmarks,
          [bookSlug]: updatedBookmarks,
        },
      };
    });
  },

  // Toggle bookmark
  toggleBookmark: (bookSlug: string, chapterSlug: string) => {
    if (bookmarkActions.isBookmarked(bookSlug, chapterSlug)) {
      bookmarkActions.removeBookmark(bookSlug, chapterSlug);
    } else {
      bookmarkActions.addBookmark(bookSlug, chapterSlug);
    }
  },

  // Check if chapter is bookmarked
  isBookmarked: (bookSlug: string, chapterSlug: string): boolean => {
    const bookmarks = bookmarkStore.state.bookmarks[bookSlug] ?? [];
    return bookmarks?.includes(chapterSlug);
  },

  overrideBookmarks: (bookmarks: Record<string, Array<string>>) => {
    bookmarkStore.setState((state) => {
      return {
        bookmarks: bookmarks,
      };
    });
  },
};

export const useBookmarkStore = () => {
  const bookmarks = useStore(bookmarkStore, (s) => s.bookmarks);

  return {
    bookmarks,
    ...bookmarkActions,
  };
};
