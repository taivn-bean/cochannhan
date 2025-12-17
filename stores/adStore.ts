import { Store, useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { debounceSave, loadFromLocalStorage } from "@/lib/localstorage";
import { CACHE_TIME } from "@/hooks/queries/cache.const";

const STORAGE_KEY = "ad-store";
export const SHOW_AD_THRESHOLD = 1;

interface AdState {
  chaptersRead: number;
  adFreeUntil: number | null; // Timestamp in ms
  lastAdShown: number | null; // Timestamp in ms
}

const initialState: AdState = {
  chaptersRead: 0,
  adFreeUntil: null,
  lastAdShown: null,
};

export const adStore = new Store<AdState>(
  loadFromLocalStorage(STORAGE_KEY, initialState),
);

// Auto-save to localStorage on state change
adStore.subscribe(() => {
  debounceSave(STORAGE_KEY, adStore.state);
});

export const adActions = {
  incrementChapters: () => {
    adStore.setState((state) => ({
      ...state,
      chaptersRead: state.chaptersRead + 1,
    }));
  },

  resetChapters: () => {
    adStore.setState((state) => ({
      ...state,
      chaptersRead: 0,
    }));
  },

  grantAdFree: (minutes: number = CACHE_TIME.THIRTY_MINUTES) => {
    const now = Date.now();
    const expiry = now + minutes * 60 * 1000;
    adStore.setState((state) => ({
      ...state,
      adFreeUntil: expiry,
      chaptersRead: 0,
      lastAdShown: now,
    }));
  },

  checkIsAdFree: (): boolean => {
    const { adFreeUntil } = adStore.state;
    if (!adFreeUntil) return false;
    return Date.now() < adFreeUntil;
  },
};

export const useAdStore = () => {
  const state = useStore(adStore);

  const isAdFree = useMemo(() => {
    if (!state.adFreeUntil) return false;
    return Date.now() < state.adFreeUntil;
  }, [state.adFreeUntil]);

  const actions = useMemo(
    () => ({
      incrementChapters: adActions.incrementChapters,
      resetChapters: adActions.resetChapters,
      grantAdFree: adActions.grantAdFree,
      checkIsAdFree: adActions.checkIsAdFree,
    }),
    [],
  );

  return {
    ...state,
    isAdFree,
    ...actions,
  };
};
