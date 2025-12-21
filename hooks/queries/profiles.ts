import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "@/types/profile";
import { useAuthStore } from "@/stores/auth.store";
import { profileService } from "@/services/profile.service";

const PROFILE_QUERY_KEY = {
  PROFILE: (userId?: string) => ["profile", userId],
};

export const useProfile = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: PROFILE_QUERY_KEY.PROFILE(user?.id),
    queryFn: () => {
      if (!user) throw new Error("No user");
      return profileService.getProfileInfo(user.id);
    },
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
      queryClient.setQueryData(PROFILE_QUERY_KEY.PROFILE(user?.id), data);
    },
  });
};

export const useUpdateProfile = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => {
      if (!user?.id) throw new Error("No user");
      return profileService.updateProfileInfo(user.id, data);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: PROFILE_QUERY_KEY.PROFILE(user?.id),
      });
      const previous = queryClient.getQueryData(
        PROFILE_QUERY_KEY.PROFILE(user?.id)
      );

      if (previous) {
        queryClient.setQueryData(PROFILE_QUERY_KEY.PROFILE(user?.id), {
          ...previous,
          ...newData,
        });
      }

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          PROFILE_QUERY_KEY.PROFILE(user?.id),
          context.previous
        );
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY.PROFILE(user?.id), data);
    },
  });
};
