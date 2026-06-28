import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { config } from "./config";
import { useUserStore } from "../stores/userStore";

const baseURL = config?.API_BASE_URL ?? "/api";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple response interceptor to return `data` directly
export type ApiError = {
  message: string;
  status: number;
};

export const normalizeApiError = (error: unknown): ApiError => {
  const responseDataMessage =
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
      ? (() => {
          const data = error.response.data;

          // case 1: { message: "..." }
          if (
            data &&
            typeof data === "object" &&
            !Array.isArray(data) &&
            "message" in data &&
            typeof data.message === "string"
          ) {
            return data.message;
          }

          // case 2: { detail: "..." }
          if (
            data &&
            typeof data === "object" &&
            "detail" in data &&
            typeof data.detail === "string"
          ) {
            return data.detail;
          }

          // case 3: { detail: [{ msg: "..." }] }
          if (
            data &&
            typeof data === "object" &&
            "detail" in data &&
            Array.isArray(data.detail) &&
            data.detail.length > 0
          ) {
            const first = data.detail[0];

            if (
              first &&
              typeof first === "object" &&
              "msg" in first &&
              typeof first.msg === "string"
            ) {
              return first.msg;
            }

            if (typeof first === "string") {
              return first;
            }
          }

          // case 4: [{ msg: "..." }]
          if (
            Array.isArray(data) &&
            data.length > 0 &&
            data[0] &&
            typeof data[0] === "object" &&
            "msg" in data[0] &&
            typeof data[0].msg === "string"
          ) {
            return data[0].msg;
          }

          return undefined;
        })()
      : undefined;

  // If already normalized
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return {
      message: responseDataMessage ?? error.message,
      status: error.status,
    };
  }

  // Axios error with response payload
  if (axios.isAxiosError(error)) {
    const resp = error.response;
    const status = resp?.status ?? 500;
    const data = resp?.data;

    const dataMessage =
      data && typeof data === "object"
        ? // { message: "..." }
          "message" in data && typeof data.message === "string"
          ? data.message
          : // [{ msg: "..." }]
            Array.isArray(data) &&
              data.length > 0 &&
              data[0] &&
              typeof data[0] === "object" &&
              "msg" in data[0] &&
              typeof data[0].msg === "string"
            ? data[0].msg
            : undefined
        : undefined;

    const message =
      responseDataMessage ?? dataMessage ?? error.message ?? "Request failed";

    return { message, status };
  }

  if (error instanceof Error) {
    return { message: responseDataMessage ?? error.message, status: 500 };
  }

  return { message: "Unexpected error", status: 500 };
};

// Create a raw client without interceptors for refresh calls
const rawClient = axios.create({ baseURL });

let refreshPromise: Promise<{
  access_token: string;
  refresh_token: string;
} | null> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If there's no response, just normalize and reject
    const response = (error && error.response) || null;

    // If it's a 401 with Not authenticated detail, try refresh flow
    if (
      response?.status === 401 &&
      response.data &&
      typeof response.data === "object" &&
      "detail" in response.data &&
      (response.data.detail === "Not authenticated" ||
        response.data.detail === "Invalid token")
    ) {
      const store = useUserStore.getState();
      const currentRefreshToken = store.session?.refreshToken;

      if (!currentRefreshToken) {
        // No refresh token available; clear session and reject
        store.signOut();
        return Promise.reject(normalizeApiError(error));
      }

      // If a refresh is already in progress, wait for it
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const resp = await rawClient.post("/auth/refresh", {
              refresh_token: currentRefreshToken,
            });
            // resp is raw axios response; if backend returns TokenPair in data,
            // rawClient.post will return the full response. Use resp.data if present.
            const data = (resp && resp.data) || resp;
            const accessToken = data?.access_token;
            const refreshToken = data?.refresh_token;
            if (!accessToken)
              throw new Error("No access token in refresh response");

            // update axios defaults and store
            setAuthToken(accessToken);
            store.setSession({
              ...store.session,
              isAuthenticated: true,
              authToken: accessToken,
              refreshToken: refreshToken,
            });

            return { access_token: accessToken, refresh_token: refreshToken };
          } catch (err) {
            console.log("Token refresh failed", err);
            // clear session on refresh failure
            store.signOut();
            return null;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const refreshed = await refreshPromise;
      if (!refreshed) {
        return Promise.reject(normalizeApiError(error));
      }

      // Retry original request with new token
      const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
        error.config || {};
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] =
          `Bearer ${refreshed.access_token}`;
        try {
          const retryResp = await axiosInstance(originalRequest);
          return retryResp;
        } catch (retryErr) {
          return Promise.reject(normalizeApiError(retryErr));
        }
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

axiosInstance.interceptors.request.use((config) => {
  const token = useUserStore.getState().session?.authToken;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const setAuthToken = (token?: string) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

export default axiosInstance;
