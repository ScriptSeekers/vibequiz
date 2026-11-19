import { IAuthService, AuthSession } from "./auth.service";
import { UserProfile } from "@/types/user";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { LoginInput, SignupInput, ForgotPasswordInput, ResetPasswordInput, VerifyEmailInput } from "@/lib/validations/auth";

export class SupabaseAuthService implements IAuthService {
  async signIn(credentials: LoginInput): Promise<{ user: UserProfile; token: string }> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and KEY.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.user || !data.session) {
      throw new Error(error?.message || "Invalid email or password.");
    }

    // Fetch user profile from database
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    const user: UserProfile = {
      id: data.user.id,
      fullName: profile?.full_name || data.user.email?.split("@")[0] || "User",
      email: data.user.email || credentials.email,
      avatarUrl: profile?.avatar_url,
      role: profile?.role || "student",
      educationLevel: profile?.education_level || "undergraduate",
      preferredLanguage: profile?.preferred_language || "english",
      bio: profile?.bio,
      createdAt: data.user.created_at,
    };

    return { user, token: data.session.access_token };
  }

  async signUp(data: SignupInput): Promise<{ user: UserProfile; token: string; requiresVerification: boolean }> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error || !authData.user) {
      throw new Error(error?.message || "Failed to create account.");
    }

    const user: UserProfile = {
      id: authData.user.id,
      fullName: data.fullName,
      email: data.email,
      role: "student",
      educationLevel: "undergraduate",
      createdAt: authData.user.created_at,
    };

    return {
      user,
      token: authData.session?.access_token || "",
      requiresVerification: !authData.session,
    };
  }

  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  }

  async forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { message: `Password reset email dispatched to ${data.email}.` };
  }

  async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Your password has been successfully reset." };
  }

  async verifyEmail(data: VerifyEmailInput): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabase.auth.verifyOtp({
      token: data.code,
      type: "signup",
    });

    if (error) {
      throw new Error(error.message || "Invalid verification code.");
    }

    return { success: true, message: "Email address verified successfully!" };
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null;
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    return {
      id: data.user.id,
      fullName: data.user.user_metadata?.full_name || "User",
      email: data.user.email || "",
      role: "student",
      createdAt: data.user.created_at,
    };
  }

  async getSession(): Promise<AuthSession> {
    if (!isSupabaseConfigured()) {
      return { user: null, token: null, isAuthenticated: false, isMock: true };
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) {
      return { user: null, token: null, isAuthenticated: false, isMock: false };
    }

    const user: UserProfile = {
      id: data.session.user.id,
      fullName: data.session.user.user_metadata?.full_name || "User",
      email: data.session.user.email || "",
      role: "student",
      createdAt: data.session.user.created_at,
    };

    return {
      user,
      token: data.session.access_token,
      isAuthenticated: true,
      isMock: false,
    };
  }
}
