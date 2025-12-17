export type UserRole = "ADMIN" | "EDITOR" | "USER";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
