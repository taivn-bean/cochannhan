// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import type { UserProfile } from "@/types/profile";
// import { db } from "@/lib/firebase";

// export class ProfileService {
//   PROFILE_COLLECTION = "profiles";

//   getProfile = async (uid: string): Promise<UserProfile | null> => {
//     const docRef = doc(db, this.PROFILE_COLLECTION, uid);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       return docSnap.data() as UserProfile;
//     }

//     return null;
//   };

//   createProfile = async (
//     uid: string,
//     data: Partial<UserProfile>,
//   ): Promise<UserProfile> => {
//     const profileData: UserProfile = {
//       uid,
//       displayName: data.displayName || "",
//       email: data.email || "",
//       photoURL: data.photoURL || "",
//       bio: data.bio || "",
//       location: data.location || "",
//       website: data.website || "",
//       role: "USER",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     await setDoc(doc(db, this.PROFILE_COLLECTION, uid), profileData);
//     return profileData;
//   };

//   updateProfile = async (
//     uid: string,
//     data: Partial<UserProfile>,
//   ): Promise<UserProfile> => {
//     const docRef = doc(db, this.PROFILE_COLLECTION, uid);

//     const updateData = {
//       ...data,
//       updatedAt: new Date().toISOString(),
//     };

//     await updateDoc(docRef, updateData);

//     const updated = await this.getProfile(uid);
//     if (!updated) throw new Error("Profile not found after update");

//     return updated;
//   };
// }

// export const profileService = new ProfileService();
