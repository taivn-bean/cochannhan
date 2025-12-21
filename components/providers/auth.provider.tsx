"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { authActions } from "@/stores/auth.store";
import { useQueryClient } from "@tanstack/react-query";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Lấy session ban đầu từ Supabase (đã được lưu tự động)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        authActions.login(session.user, session);
      } else {
        authActions.setLoading(false);
      }

      queryClient.setQueryData(["user"], session?.user ?? null);
      queryClient.setQueryData(["session"], session);
    });

    // Lắng nghe thay đổi auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        authActions.login(session.user, session);
      } else {
        authActions.logout();
      }

      queryClient.setQueryData(["user"], session?.user ?? null);
      queryClient.setQueryData(["session"], session);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return <>{children}</>;
};
