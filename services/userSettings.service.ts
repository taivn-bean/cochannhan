// import { doc, getDoc, setDoc } from "firebase/firestore";
// import type { UserSettings } from "@/types/type";
// import { db } from "@/lib/firebase";

// export class UserSettingsService {
//   COLLECTION = "user_settings";

//   // Get user settings from Firestore
//   getUserSettings = async (uid: string): Promise<UserSettings | null> => {
//     const docRef = doc(db, this.COLLECTION, uid);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       return docSnap.data() as UserSettings;
//     }

//     return null;
//   };

//   // Save all settings to Firestore (override)
//   saveUserSettings = async (
//     uid: string,
//     settings: UserSettings,
//   ): Promise<void> => {
//     const docRef = doc(db, this.COLLECTION, uid);
//     await setDoc(docRef, settings);
//   };
// }

// export const userSettingsService = new UserSettingsService();
