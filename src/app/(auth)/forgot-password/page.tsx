"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await authService.forgotPassword(data);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not dispatch reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200/90 shadow-lg">
      <CardHeader className="space-y-1.5 text-center">
        <div className="mx-auto w-10 h-10 rounded-xl bg-vibe-orange-light text-vibe-orange flex items-center justify-center mb-1">
          <KeyRound className="w-5 h-5" />
        </div>
        <CardTitle className="text-2xl font-bold font-heading text-slate-900">
          Reset Your Password
        </CardTitle>
        <CardDescription>
          Enter the email address registered with your Vibe Quiz account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {successMessage ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold text-emerald-900">
                Reset Link Dispatched
              </p>
              <p className="text-xs text-emerald-700 leading-relaxed">
                {successMessage}
              </p>
            </div>
            <Link href="/login" className="block w-full">
              <Button variant="default" size="lg" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full text-base font-bold shadow-md shadow-primary-purple/20"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-100 pt-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary-purple transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
