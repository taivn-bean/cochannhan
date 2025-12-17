// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { CACHE_TIME } from "./cache.const";
// import type { UserProfile } from "@/types/profile";
// import { profileService } from "@/services/profile.service";
// import { useAuth } from "@/hooks/useAuth";

// export const useProfile = () => {
//   const { user, isAuthenticated } = useAuth();
//   const queryClient = useQueryClient();

//   const profileQuery = useQuery({
//     queryKey: ["profile", user?.uid],
//     queryFn: () => {
//       if (!user?.uid) throw new Error("No user");
//       return profileService.getProfile(user.uid);
//     },
//     enabled: !!user?.uid && isAuthenticated,
//     staleTime: CACHE_TIME.ONE_MONTH,
//   });

//   const createProfileMutation = useMutation({
//     mutationFn: (data: Partial<UserProfile>) => {
//       if (!user?.uid) throw new Error("No user");
//       return profileService.createProfile(user.uid, data);
//     },
//     onSuccess: (data) => {
//       queryClient.setQueryData(["profile", user?.uid], data);
//     },
//   });

//   const updateProfileMutation = useMutation({
//     mutationFn: (data: Partial<UserProfile>) => {
//       if (!user?.uid) throw new Error("No user");
//       return profileService.updateProfile(user.uid, data);
//     },
//     onMutate: async (newData) => {
//       await queryClient.cancelQueries({ queryKey: ["profile", user?.uid] });
//       const previous = queryClient.getQueryData(["profile", user?.uid]);

//       if (previous) {
//         queryClient.setQueryData(["profile", user?.uid], {
//           ...previous,
//           ...newData,
//           updatedAt: new Date().toISOString(),
//         });
//       }

//       return { previous };
//     },
//     onError: (err, variables, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(["profile", user?.uid], context.previous);
//       }
//     },
//     onSuccess: (data) => {
//       queryClient.setQueryData(["profile", user?.uid], data);
//     },
//   });

//   const { data: profile } = profileQuery;

//   if (
//     isAuthenticated &&
//     user &&
//     profileQuery.isSuccess &&
//     !profile &&
//     !createProfileMutation.isPending
//   ) {
//     createProfileMutation.mutate({
//       displayName: user.displayName || "",
//       email: user.email || "",
//       photoURL: user.photoURL || undefined,
//     });
//   }

//   return {
//     profile: profileQuery.data,
//     isLoading: profileQuery.isLoading || createProfileMutation.isPending,
//     isError: profileQuery.isError,
//     error: profileQuery.error,

//     updateProfile: updateProfileMutation.mutate,
//     isUpdating: updateProfileMutation.isPending,

//     refetch: profileQuery.refetch,
//   };
// };
