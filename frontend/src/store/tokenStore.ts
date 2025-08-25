// store/tokenStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type TokenState = {
  token: string | null;
  setToken: (t: string) => void;
  clearToken: () => void;
};

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (t: string) => set({ token: t }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "token-storage", // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
