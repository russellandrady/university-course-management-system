import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserType } from "@/types/UserType";
import type { AuthResponseOfAdmin } from "@/types/auth/authTypes";

type UserState = {
  username: string | null; // Store the username
  setUsername: (username: string) => void; // Function to set the username
  clearUser: () => void; // Function to clear the user state
  modeDark: boolean; // Optional: Add a model property if needed
  toggleMode: () => void;
  userType: UserType | null; // Add userType
  setUserType: (userType: UserType) => void; // Setter for userType
  authResponseAdmin: AuthResponseOfAdmin | null;
  setAuthResponseAdmin: (data: AuthResponseOfAdmin) => void;
  clearAuthResponseAdmin: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: null, // Initial state
      modeDark: false, // Optional: Initial mode state
      userType: null, // Initial userType
      authResponseAdmin: null,
      setUsername: (username: string) => set({ username: username }), // Update username
      setUserType: (userType: UserType) => set({ userType }), // Setter
      setAuthResponseAdmin: (data: AuthResponseOfAdmin) => set({ authResponseAdmin: data }),
      toggleMode: () => set(() => ({ modeDark: !get().modeDark })), // Toggle mode state
      clearUser: () => set({ username: null, userType: null }), // Clear user state
      clearAuthResponseAdmin: () => set({ authResponseAdmin: null }),
    }),
    {
      name: "user-storage", // Key for local storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);