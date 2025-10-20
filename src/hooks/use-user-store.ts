// src/store/userStore.ts
import { create } from 'zustand';
import { User } from "@supabase/supabase-js";

interface UserState {
    user: User | null;
    isLoggedIn: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoggedIn: false,
    login: (userData: User) =>
        set({
            user: userData,
            isLoggedIn: true,
        }),
    logout: () =>
        set({
            user: null,
            isLoggedIn: false,
        }),
}));