"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authActions } from "@/stores/auth.store";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { CACHE_TIME } from "./cache.const";

// Query keys constants
const AUTH_QUERY_KEYS = {
  user: ["user"] as const,
  session: ["session"] as const,
} as const;

// Hook để lấy user hiện tại
export const useUser = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: async () => {
      return authService.getUser();
    },
    staleTime: CACHE_TIME.FIVE_MINUTES,
    gcTime: CACHE_TIME.THIRTY_MINUTES,
  });
};

// Hook để lấy session hiện tại
export const useSession = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.session,
    queryFn: async () => {
      return authService.getSession();
    },
    staleTime: CACHE_TIME.FIVE_MINUTES,
    gcTime: CACHE_TIME.THIRTY_MINUTES,
  });
};

// Hook đăng nhập
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      authActions.setLoading(true);

      return authService.login({ email, password });
    },
    onSuccess: (data) => {
      // Cập nhật query cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, data.user);
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, data.session);

      // Cập nhật store
      authActions.login(data.user, data.session);

      // Toast notification
      toast.success("Đăng nhập thành công", {
        description: "Chào mừng bạn quay trở lại!",
      });
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      authActions.setLoading(false);

      toast.error("Đăng nhập thất bại", {
        description:
          error.message || "Vui lòng kiểm tra lại thông tin đăng nhập",
      });
    },
  });
};

// Hook đăng ký
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      metadata,
    }: {
      email: string;
      password: string;
      metadata?: Record<string, any>;
    }) => {
      authActions.setLoading(true);

      return authService.signup({ email, password, metadata });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, data.user);
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, data.session);

      if (data.user && data.session) {
        authActions.login(data.user, data.session);
      }

      toast.success("Đăng ký thành công", {
        description:
          data.user?.identities?.length === 0
            ? "Vui lòng kiểm tra email để xác nhận tài khoản"
            : "Chào mừng bạn!",
      });
    },
    onError: (error: any) => {
      console.error("Signup error:", error);
      authActions.setLoading(false);

      toast.error("Đăng ký thất bại", {
        description: error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    },
  });
};

// Hook đăng xuất
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return authService.logout();
    },
    onSuccess: () => {
      // Clear query cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, null);
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, null);
      queryClient.clear();

      // Reset store
      authActions.logout();

      toast.success("Đã đăng xuất", {
        description: "Hẹn gặp lại bạn!",
      });
    },
    onError: (error: any) => {
      console.error("Logout error:", error);

      toast.error("Lỗi khi đăng xuất", {
        description: error.message,
      });
    },
  });
};

// Hook reset password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return authService.resetPassword(email);
    },
    onSuccess: () => {
      toast.success("Email đã được gửi", {
        description: "Vui lòng kiểm tra hộp thư để đặt lại mật khẩu",
      });
    },
    onError: (error: any) => {
      toast.error("Không thể gửi email", {
        description: error.message || "Vui lòng kiểm tra lại địa chỉ email",
      });
    },
  });
};

// Hook update password
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      return authService.updatePassword(newPassword);
    },
    onSuccess: () => {
      toast.success("Mật khẩu đã được cập nhật", {
        description: "Mật khẩu mới của bạn đã được lưu",
      });
    },
    onError: (error: any) => {
      toast.error("Không thể cập nhật mật khẩu", {
        description: error.message,
      });
    },
  });
};

// Hook update user metadata
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: {
      email?: string;
      password?: string;
      data?: Record<string, any>;
    }) => {
      return authService.updateUser(updates);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, data.user);
      authActions.updateUser(data.user);

      toast.success("Cập nhật thành công", {
        description: "Thông tin của bạn đã được cập nhật",
      });
    },
    onError: (error: any) => {
      toast.error("Cập nhật thất bại", {
        description: error.message,
      });
    },
  });
};

// Hook đăng nhập bằng OAuth (Google, GitHub, etc.)
export const useOAuthLogin = () => {
  return useMutation({
    mutationFn: async (provider: "google" | "github" | "facebook") => {
      return authService.oauthLogin(provider);
    },
    onError: (error: any) => {
      toast.error("Đăng nhập thất bại", {
        description: error.message,
      });
    },
  });
};

export const useAuthCallback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      return authService.exchangeCodeForSession(code);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, data.user);
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, data.session);

      authActions.login(data.user, data.session);

      toast.success("Đăng nhập thành công", {
        description: "Chào mừng bạn quay trở lại!",
      });
    },
    onError: (error: any) => {
      toast.error("Đăng nhập thất bại", {
        description: error.message,
      });
    },
  });
};
