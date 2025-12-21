// stores/recentAccessStore.ts
import { Store, useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { debounceSave, loadFromLocalStorage } from "@/lib/localstorage";

export interface RecentAccessItem {
  title: string;
  bookSlug: string;
  chapterSlug: string;
  timestamp: number;
}

export interface RecentAccessState {
  items: Array<RecentAccessItem>;
}

const STORAGE_KEY = "recent-access-store";
const MAX_ITEMS = 10;

const initialState: RecentAccessState = {
  items: [],
};

export const recentAccessStore = new Store<RecentAccessState>(
  loadFromLocalStorage(STORAGE_KEY, initialState),
);

recentAccessStore.subscribe(() => {
  debounceSave(STORAGE_KEY, recentAccessStore.state);
});

// ✅ Actions
export const recentAccessActions = {
  // Add recent access item
  addRecentAccess: (item: Omit<RecentAccessItem, "timestamp">) => {
    recentAccessStore.setState((state) => {
      // Remove duplicate if exists (same bookSlug + chapterSlug)
      const filteredItems = state.items.filter(
        (i) => !(i.bookSlug === item.bookSlug),
      );

      // Add new item with timestamp
      const newItem: RecentAccessItem = {
        ...item,
        timestamp: Date.now(),
      };

      // Add to beginning and limit to MAX_ITEMS
      const updatedItems = [newItem, ...filteredItems].slice(0, MAX_ITEMS);

      return {
        items: updatedItems,
      };
    });
  },

  // Get all recent access items (sorted by timestamp, newest first)
  getRecentAccess: (): Array<RecentAccessItem> => {
    return recentAccessStore.state.items;
  },

  // Clear all recent access
  clearRecentAccess: () => {
    recentAccessStore.setState({ items: [] });
  },

  // Remove specific item
  removeRecentAccess: (bookSlug: string, chapterSlug: string) => {
    recentAccessStore.setState((state) => ({
      items: state.items.filter(
        (i) => !(i.bookSlug === bookSlug && i.chapterSlug === chapterSlug),
      ),
    }));
  },
};

// ✅ Custom hook
export const useRecentAccessStore = () => {
  const items = useStore(recentAccessStore, (state) => state.items);

  const actions = useMemo(
    () => ({
      addRecentAccess: recentAccessActions.addRecentAccess,
      clearRecentAccess: recentAccessActions.clearRecentAccess,
      removeRecentAccess: recentAccessActions.removeRecentAccess,
    }),
    [],
  );

  return {
    items,
    ...actions,
  };
};
