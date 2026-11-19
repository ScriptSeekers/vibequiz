"use client";

import { create } from "zustand";
import { UserProfile } from "@/types/user";
import { authService, AuthSession } from "@/services/auth.service";
import { LoginInput, SignupInput } from "@/lib/validations/auth";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  checkAuth: () => Promise<AuthSession>;
  login: (credentials: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  checkAuth: async () => {
    try {
      const session = await authService.getSession();
      set({
        user: session.user,
        isAuthenticated: session.isAuthenticated,
        isInitialized: true,
      });
      return session;
    } catch {
      set({ user: null, isAuthenticated: false, isInitialized: true });
      return { user: null, token: null, isAuthenticated: false, isMock: true };
    }
  },

  login: async (credentials: LoginInput) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.signIn(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to log in. Please check your credentials.",
        isLoading: false,
      });
      throw err;
    }
  },

  signup: async (data: SignupInput) => {
    set({ isLoading: true, error: null });
    try {
      const { user, requiresVerification } = await authService.signUp(data);
      set({ user, isAuthenticated: true, isLoading: false });
      return requiresVerification;
    } catch (err: any) {
      set({
        error: err.message || "Failed to create account. Please try again.",
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
