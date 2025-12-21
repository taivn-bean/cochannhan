// stores/readerSettingsStore.ts
import { Store, useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import type { ReaderSettings } from "@/types/type";
import { debounceSave, loadFromLocalStorage } from "@/lib/localstorage";

const STORAGE_KEY = "reader-settings-store";

const initialState: ReaderSettings = {
  fontSize: 16,
  fontFamily: "Inter",
  theme: "light",
  lineHeight: 1.6,
};

export const readerSettingsStore = new Store<ReaderSettings>(
  loadFromLocalStorage(STORAGE_KEY, initialState),
);

// ✅ Auto-save to localStorage on state change
readerSettingsStore.subscribe(() => {
  debounceSave(STORAGE_KEY, readerSettingsStore.state);
});

// ✅ Actions
export const readerSettingsActions = {
  // Update one or more settings
  updateSettings: (partial: Partial<ReaderSettings>) => {
    readerSettingsStore.setState((state) => ({
      ...state,
      ...partial,
    }));
  },

  // Reset to default
  resetSettings: () => {
    readerSettingsStore.setState(initialState);
  },

  // Get current settings
  getSettings: (): ReaderSettings => {
    return readerSettingsStore.state;
  },
};

// ✅ Custom hook
export const useReaderSettingsStore = () => {
  const settings = useStore(readerSettingsStore);

  const actions = useMemo(
    () => ({
      updateSettings: readerSettingsActions.updateSettings,
      resetSettings: readerSettingsActions.resetSettings,
    }),
    [],
  );

  return {
    settings,
    ...actions,
  };
};
