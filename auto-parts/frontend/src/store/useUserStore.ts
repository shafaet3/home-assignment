import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
};

type UserStore = {
  user: User | null;
  setUser: (u: User | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
}));
