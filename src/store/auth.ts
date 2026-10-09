import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccountUser } from "../types";

interface AuthState {
  user: AccountUser | null;
  isLoggedIn: boolean;
  login: (user: AccountUser) => void;
  register: (user: AccountUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        name: "Nadia Rahman",
        email: "care@oshudh.com",
        phone: "+8801712345678",
      },
      isLoggedIn: true,
      login: (user) => set({ user, isLoggedIn: true }),
      register: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    { name: "oshudh-auth" },
  ),
);
