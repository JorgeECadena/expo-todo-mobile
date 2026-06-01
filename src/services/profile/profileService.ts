import api from "@/services/api";
import { UserProfile } from "@/types/userProfile";

export const getProfile = async (): Promise<UserProfile> => {
    const profile = await api.get<UserProfile>("/users/me");

    return profile.data;
};