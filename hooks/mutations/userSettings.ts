// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { userSettingsService } from "@/services/userSettings.service";
// import { readerSettingsStore } from "@/stores/readerSettingsStore";
// import { bookmarkStore } from "@/stores/bookmarkStore";
// import { recentAccessStore } from "@/stores/recentAccessStore";

// // Save local data to Firebase
// export const useSaveToFirebase = () => {
//   return useMutation({
//     mutationFn: async (uid: string) => {
//       const settings = readerSettingsStore.state;
//       const bookmarks = bookmarkStore.state.bookmarks;
//       const recentAccess = recentAccessStore.state.items;

//       await userSettingsService.saveUserSettings(uid, {
//         uid,
//         readerSettings: settings,
//         bookmarks,
//         recentAccess,
//         lastSyncedAt: Date.now(),
//         updatedAt: Date.now(),
//       });
//     },
//     onSuccess: () => {
//       toast.success("Đã lưu lên cloud thành công!");
//     },
//     onError: () => {
//       toast.error("Lỗi khi lưu lên cloud");
//     },
//   });
// };

// // Load from Firebase and OVERRIDE local
// export const useLoadFromFirebase = () => {
//   return useMutation({
//     mutationFn: async (uid: string) => {
//       const remote = await userSettingsService.getUserSettings(uid);
//       if (!remote) {
//         throw new Error("Không tìm thấy dữ liệu trên cloud");
//       }

//       // ✅ Override local stores (will auto-save to localStorage via subscription)
//       readerSettingsStore.setState(remote.readerSettings);
//       bookmarkStore.setState({ bookmarks: remote.bookmarks });
//       recentAccessStore.setState({ items: remote.recentAccess });

//       return remote;
//     },
//     onSuccess: () => {
//       toast.success("Đã tải từ cloud thành công!");
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || "Lỗi khi tải từ cloud");
//     },
//   });
// };
