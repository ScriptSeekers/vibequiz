import { UserProfile } from "@/types/user";
import { MOCK_USER } from "@/mocks/users";
import { LoginInput, SignupInput, ForgotPasswordInput, ResetPasswordInput, VerifyEmailInput } from "@/lib/validations/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { SupabaseAuthService } from "./supabase-auth.service";

export interface AuthSession {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isMock: boolean;
}

export interface IAuthService {
  signIn(credentials: LoginInput): Promise<{ user: UserProfile; token: string }>;
  signUp(data: SignupInput): Promise<{ user: UserProfile; token: string; requiresVerification: boolean }>;
  signOut(): Promise<void>;
  forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }>;
  resetPassword(data: ResetPasswordInput): Promise<{ message: string }>;
  verifyEmail(data: VerifyEmailInput): Promise<{ success: boolean; message: string }>;
  getCurrentUser(): Promise<UserProfile | null>;
  getSession(): Promise<AuthSession>;
}

const STORAGE_KEY = "vibe_quiz_auth_session";

/**
 * MockAuthService
 * Realistic frontend mock adapter simulating asynchronous network calls,
 * session storage, and clear non-production disclosures.
 */
class MockAuthService implements IAuthService {
  private getStoredSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveSession(session: AuthSession) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn("Failed to save auth session to localStorage", e);
    }
  }

  private clearSession() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear auth session", e);
    }
  }

  async signIn(credentials: LoginInput): Promise<{ user: UserProfile; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (credentials.password === "wrongpassword") {
      throw new Error("Invalid email or password. Please try again.");
    }

    const user: UserProfile = {
      ...MOCK_USER,
      email: credentials.email,
      fullName: credentials.email.split("@")[0].replace(".", " ").replace(/^\w/, (c) => c.toUpperCase()),
    };

    const session: AuthSession = {
      user,
      token: `mock_jwt_token_${Date.now()}`,
      isAuthenticated: true,
      isMock: true,
    };

    this.saveSession(session);
    return { user, token: session.token! };
  }

  async signUp(data: SignupInput): Promise<{ user: UserProfile; token: string; requiresVerification: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user: UserProfile = {
      ...MOCK_USER,
      id: `usr_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      createdAt: new Date().toISOString(),
    };

    const session: AuthSession = {
      user,
      token: `mock_jwt_token_${Date.now()}`,
      isAuthenticated: true,
      isMock: true,
    };

    this.saveSession(session);
    return { user, token: session.token!, requiresVerification: true };
  }

  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.clearSession();
  }

  async forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      message: `Password reset link has been dispatched to ${data.email}. Please check your inbox.`,
    };
  }

  async resetPassword(_data: ResetPasswordInput): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return {
      message: "Your password has been successfully updated. You may now log in with your new credentials.",
    };
  }

  async verifyEmail(data: VerifyEmailInput): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (data.code === "000000") {
      throw new Error("Invalid or expired verification code. Please request a new code.");
    }
    return {
      success: true,
      message: "Email address verified successfully! Your account is now fully active.",
    };
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const session = this.getStoredSession();
    return session?.user || null;
  }

  async getSession(): Promise<AuthSession> {
    const session = this.getStoredSession();
    if (session && session.isAuthenticated) {
      return session;
    }
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isMock: true,
    };
  }
}

/**
 * Singleton export of the Auth Service.
 * Automatically chooses SupabaseAuthService if credentials are provided in .env,
 * otherwise transparently uses MockAuthService.
 */
export const authService: IAuthService =
  typeof window !== "undefined" && isSupabaseConfigured()
    ? new SupabaseAuthService()
    : new MockAuthService();
