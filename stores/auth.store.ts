"use client";

import { Store } from "@tanstack/store";
import { User, Session } from "@supabase/supabase-js";
import { useStore } from "@tanstack/react-store";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
};

export const authStore = new Store<AuthState>(initialState);

export const useAuthStore = () => {
  return useStore(authStore);
};

// Auth actions để quản lý state
export const authActions = {
  login: (user: User, session: Session) => {
    authStore.setState((state) => ({
      ...state,
      user,
      session,
      isLoading: false,
    }));
  },

  setLoading: (isLoading: boolean) => {
    authStore.setState((state) => ({ ...state, isLoading }));
  },

  logout: () => {
    authStore.setState({
      user: null,
      session: null,
      isLoading: false,
    });
  },

  updateUser: (user: User) => {
    authStore.setState((state) => ({ ...state, user }));
  },
};
