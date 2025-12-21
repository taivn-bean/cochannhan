"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { authActions } from "@/stores/auth.store";
import { toast } from "sonner";
class AuthService {
  getUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  };

  getSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  };

  login = async ({ email, password }: { email: string; password: string }) => {
    authActions.setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };
  signup = async ({
    email,
    password,
    metadata,
  }: {
    email: string;
    password: string;
    metadata?: Record<string, any>;
  }) => {
    authActions.setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  };

  logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  };

  updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  updateUser = async (updates: {
    email?: string;
    password?: string;
    data?: Record<string, any>;
  }) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  };
  oauthLogin = async (provider: "google" | "github" | "facebook") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  exchangeCodeForSession = async (code: string) => {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return data;
  };
}
export const authService = new AuthService();
