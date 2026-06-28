import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Session = {
  isAuthenticated: boolean;
  userEmail?: string;
  authToken?: string; // JWT token
  refreshToken?: string; // refresh token
};

export const anonymousSession: Session = {
  isAuthenticated: false,
  authToken: undefined,
  refreshToken: undefined,
};

type TUserStore = {
  session: Session;
  signIn: (
    userEmail?: string,
    authToken?: string,
    refreshToken?: string,
  ) => void;
  signOut: () => void;
  setSession: (session: Session) => void;
};

export const useUserStore = create<TUserStore>()(
  persist(
    (set) => ({
      session: anonymousSession,
      setSession: (session) => set({ session }),
      signIn: (userEmail, authToken, refreshToken) =>
        set({
          session: {
            isAuthenticated: true,
            userEmail: userEmail ?? "hello@example.com",
            authToken,
            refreshToken,
          },
        }),
      signOut: () => set({ session: anonymousSession }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
