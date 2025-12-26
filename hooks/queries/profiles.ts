"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "@/types/profile";
import { useAuthStore } from "@/stores/auth.store";
import { profileService } from "@/services/profile.service";
import { toast } from "sonner";
import { CACHE_TIME } from "./cache.const";

// Query keys constants
const PROFILE_QUERY_KEYS = {
  all: ["profile"] as const,
  detail: (userId?: string) => [...PROFILE_QUERY_KEYS.all, userId] as const,
} as const;

export const useProfile = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.detail(user?.id),
    queryFn: () => {
      if (!user) throw new Error("No user");
      return profileService.getProfileInfo(user.id);
    },
    enabled: !!user,
    staleTime: CACHE_TIME.FIVE_MINUTES,
    gcTime: CACHE_TIME.THIRTY_MINUTES,
    refetchOnMount: false, // Không refetch khi component mount lại
    refetchOnWindowFocus: false, // Không refetch khi focus window
  });
};

export const useCreateProfile = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => {
      if (!user?.id) throw new Error("No user");
      return profileService.createProfileInfo(user.id, data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.detail(user?.id), data);
    },
  });
};

export const useUpdateProfile = ({
  showMessage = true,
}: { showMessage?: boolean } = {}) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => {
      if (!user?.id) throw new Error("No user");
      return profileService.updateProfileInfo(user.id, data);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: PROFILE_QUERY_KEYS.detail(user?.id),
      });
      const previous = queryClient.getQueryData(
        PROFILE_QUERY_KEYS.detail(user?.id)
      );

      if (previous) {
        queryClient.setQueryData(PROFILE_QUERY_KEYS.detail(user?.id), {
          ...previous,
          ...newData,
        });
      }

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          PROFILE_QUERY_KEYS.detail(user?.id),
          context.previous
        );
      }
      if (showMessage) {
        toast.error("Cập nhật thất bại", {
          description: err.message,
        });
      }
    },
    onSuccess: (data) => {
      // Chỉ update cache với data từ server, không invalidate để tránh refetch
      // Data đã được update optimistically trong onMutate
      // Merge với data hiện tại để giữ lại các fields không có trong response
      queryClient.setQueryData(
        PROFILE_QUERY_KEYS.detail(user?.id),
        (old: UserProfile | undefined) => {
          if (!old) return data;
          return { ...old, ...data };
        }
      );
      if (showMessage) {
        toast.success("Cập nhật thành công", {
          description: "Dữ liệu của bạn đã được cập nhật",
        });
      }
    },
  });
};
