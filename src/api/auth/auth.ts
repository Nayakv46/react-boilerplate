import axios from "../axiosConfig";
import { type AxiosResponse } from "axios";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
  retryPassword: string;
  first_name: string;
  last_name: string;
};

export type RefreshRequest = {
  refresh_token: string;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
};

export type UserResponse = {
  id: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
};

export async function login(payload: LoginRequest): Promise<TokenPair> {
  const { data }: AxiosResponse<TokenPair> = await axios.post(
    "/auth/login",
    payload,
  );
  return data;
}

export async function signUp(payload: SignUpRequest): Promise<TokenPair> {
  const { data }: AxiosResponse<TokenPair> = await axios.post(
    "/auth/signup",
    payload,
  );
  return data;
}

export async function refresh(payload: RefreshRequest): Promise<TokenPair> {
  const { data }: AxiosResponse<TokenPair> = await axios.post(
    "/auth/refresh",
    payload,
  );
  return data;
}

export async function logout(payload: RefreshRequest): Promise<void> {
  // Backend returns 204 with no payload.
  await axios.post("/auth/logout", payload);
}

export async function getMe(): Promise<UserResponse> {
  const { data }: AxiosResponse<UserResponse> = await axios.get("/auth/me");
  return data;
}

export default {
  login,
  refresh,
  logout,
  getMe,
};
