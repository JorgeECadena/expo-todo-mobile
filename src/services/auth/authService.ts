import api from "@/services/api";
import { auth } from "@/services/auth/auth";
import { CreateUserResponse } from "@/types/createUser.js";
import { CreateUserReq } from "@/types/createUser.js";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const signUp = async (
    req: CreateUserReq
): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/users', req);

    return response.data;
};

export const login = async (
    email: string,
    password: string
  ): Promise<string> => {
    const UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await UserCredential.user.getIdToken();

    return token;
};

export const logout = async (): Promise<void> => {
    await signOut(auth);
};