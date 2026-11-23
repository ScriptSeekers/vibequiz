"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useAuthStore } from "@/features/auth/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      clearError();
      await login(data);
      router.push("/dashboard");
    } catch {
      // Error handled by store
    }
  };

  return (
    <Card className="border-slate-200/90 shadow-lg">
      <CardHeader className="space-y-1.5 text-center">
        <div className="mx-auto w-10 h-10 rounded-xl bg-primary-purple-light text-primary-purple flex items-center justify-center mb-1">
          <LogIn className="w-5 h-5" />
        </div>
        <CardTitle className="text-2xl font-bold font-heading text-slate-900">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to access your quizzes, analytics, and study notes.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" required>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              error={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" required>
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary-purple hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                error={!!errors.password}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 rounded border-slate-300 text-primary-purple focus:ring-primary-purple"
              {...register("rememberMe")}
            />
            <label htmlFor="rememberMe" className="text-xs text-slate-600 select-none cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button (44px min touch target) */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full text-base font-bold shadow-md shadow-primary-purple/20"
            isLoading={isLoading}
          >
            Sign In
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-primary-purple hover:underline">
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
