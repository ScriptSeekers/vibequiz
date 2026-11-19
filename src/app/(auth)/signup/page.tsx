"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, AlertCircle, ArrowRight, Check } from "lucide-react";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { useAuthStore } from "@/features/auth/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password") || "";

  // Password requirement checks for visual feedback
  const hasMinLength = passwordVal.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordVal);
  const hasNumber = /[0-9]/.test(passwordVal);

  const onSubmit = async (data: SignupInput) => {
    try {
      clearError();
      const requiresVerification = await signup(data);
      if (requiresVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      // Error handled in store
    }
  };

  return (
    <Card className="border-slate-200/90 shadow-lg">
      <CardHeader className="space-y-1.5 text-center">
        <div className="mx-auto w-10 h-10 rounded-xl bg-primary-purple-light text-primary-purple flex items-center justify-center mb-1">
          <UserPlus className="w-5 h-5" />
        </div>
        <CardTitle className="text-2xl font-bold font-heading text-slate-900">
          Create Your Account
        </CardTitle>
        <CardDescription>
          Join Vibe Quiz to generate AI quizzes and track your mastery.
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
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" required>
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="e.g. Priya Sharma"
              autoComplete="name"
              error={!!errors.fullName}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

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
            <Label htmlFor="password" required>
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="new-password"
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

            {/* Password Requirements Checklist */}
            <div className="pt-1.5 space-y-1 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    hasMinLength ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className={hasMinLength ? "text-emerald-700 font-medium" : ""}>
                  Minimum 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    hasUppercase ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className={hasUppercase ? "text-emerald-700 font-medium" : ""}>
                  At least 1 uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    hasNumber ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className={hasNumber ? "text-emerald-700 font-medium" : ""}>
                  At least 1 number
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" required>
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                className="pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full text-base font-bold shadow-md shadow-primary-purple/20 mt-2"
            isLoading={isLoading}
          >
            Create Account
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary-purple hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
