import type { UserProfile } from "@/types/profile";
import { supabase } from "@/lib/supabase";

const PROFILE_SCHEMA = "profiles";
export class ProfileService {
  getProfileInfo = async (uid: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from(PROFILE_SCHEMA)
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  createProfileInfo = async (
    uid: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> => {
    const profileData = {
      user_id: uid,
      ...data,
    };
    const { data: insertedData, error } = await supabase
      .from(PROFILE_SCHEMA)
      .insert(profileData)
      .select()
      .maybeSingle();
    if (error) throw error;
    return insertedData;
  };

  updateProfileInfo = async (uid: string, data: Partial<UserProfile>) => {
    const { data: updatedData, error } = await supabase
      .from(PROFILE_SCHEMA)
      .update(data)
      .eq("user_id", uid)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!updatedData) {
      return this.createProfileInfo(uid, data);
    }
    return updatedData;
  };
}

export const profileService = new ProfileService();
