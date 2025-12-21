import { BookmarkState } from "@/stores/bookmark.store";
import { ReaderSettings } from "./type";
import { RecentAccessItem } from "@/stores/recent-access.store";

export type UserRole = "ADMIN" | "EDITOR" | "USER";

export interface UserProfile {
  id: string;
  user_id: string;
  bookmarks: Record<string, string[]>; // jsonB
  reader_settings: ReaderSettings; //jsonB
  recent_access: Array<RecentAccessItem>; //jsonB
}
