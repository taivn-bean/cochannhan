"use client";
// src/pages/Profile.tsx
import {
  Cloud,
  CloudDownload,
  CloudUpload,
  Globe,
  Loader2,
  Mail,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateProfile } from "@/hooks/queries/profiles";
import { useAuthStore } from "@/stores/auth.store";
import { UserAvatar } from "@/components/auth/user-avatar";
import { useBookmarkStore } from "@/stores/bookmark.store";
import { useReaderSettingsStore } from "@/stores/reader-settings.store";
import { useRecentAccessStore } from "@/stores/recent-access.store";
import { ReaderSettings } from "@/types/type";
import { useTheme } from "next-themes";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending: isUploading } = useUpdateProfile();
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);

  const { bookmarks, overrideBookmarks } = useBookmarkStore();
  const { settings: readerSettings, overrideSettings } =
    useReaderSettingsStore();
  const { items: recentAccess, overrideRecentAccess } = useRecentAccessStore();
  const { setTheme } = useTheme();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Vui lòng đăng nhập</p>
      </div>
    );
  }

  const displayName =
    user.user_metadata?.username ||
    user.user_metadata?.full_name ||
    "Chưa cập nhật";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const syncDataFromCloud = async () => {
    setShowLoadConfirm(false);
    overrideBookmarks(profile?.bookmarks ?? {});
    overrideSettings((profile?.reader_settings as ReaderSettings) ?? {});
    overrideRecentAccess(profile?.recent_access ?? []);
    setTheme(profile?.reader_settings?.theme ?? "light");
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thông Tin Cá Nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <UserAvatar className="h-16 w-16" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Tên</p>
                <p className="font-medium">{displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Sync Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Đồng bộ dữ liệu</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Đồng bộ cài đặt đọc, bookmarks và lịch sử truy cập với cloud
            </p>
            <p className="text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded-md border border-yellow-500">
              <strong>Lưu ý:</strong> Đồng bộ chỉ thực hiện thủ công. Dữ liệu
              không tự động đồng bộ.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  updateProfile({
                    user_id: user.id,
                    bookmarks: bookmarks,
                    reader_settings: readerSettings,
                    recent_access: recentAccess,
                  });
                }}
                disabled={isUploading}
                variant="outline"
                className="w-full justify-start"
              >
                <CloudUpload className="mr-2 h-4 w-4" />
                Lưu lên Cloud
                {isUploading && (
                  <span className="ml-auto text-xs">Đang lưu...</span>
                )}
              </Button>
              <Button
                onClick={() => setShowLoadConfirm(true)}
                disabled={isUploading}
                variant="outline"
                className="w-full justify-start"
              >
                <CloudDownload className="mr-2 h-4 w-4" />
                Tải từ Cloud
                {isUploading && (
                  <span className="ml-auto text-xs">Đang tải...</span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={showLoadConfirm}
        onClose={() => setShowLoadConfirm(false)}
        onConfirm={syncDataFromCloud}
        title="Xác nhận tải từ Cloud"
        description="Dữ liệu local (bookmarks, cài đặt đọc, lịch sử) sẽ bị ghi đè bởi dữ liệu từ cloud. Bạn có chắc chắn?"
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </div>
  );
}
