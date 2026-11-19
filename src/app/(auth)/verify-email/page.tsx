"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck, RefreshCw, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { verifyEmailSchema, VerifyEmailInput } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "your email address";

  const [isLoading, setIsLoading] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(30);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: "123456" },
  });

  // Countdown timer for resend
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const onSubmit = async (data: VerifyEmailInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await authService.verifyEmail(data);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    setErrorMessage(null);
    setValue("code", "123456");
  };

  return (
    <Card className="border-slate-200/90 shadow-lg">
      <CardHeader className="space-y-1.5 text-center">
        <div className="mx-auto w-10 h-10 rounded-xl bg-vibe-blue-light text-vibe-blue flex items-center justify-center mb-1">
          <MailCheck className="w-5 h-5" />
        </div>
        <CardTitle className="text-2xl font-bold font-heading text-slate-900">
          Verify Your Email
        </CardTitle>
        <CardDescription>
          We sent a 6-digit confirmation code to{" "}
          <span className="font-semibold text-slate-800">{emailParam}</span>.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {successMessage ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold text-emerald-900">
                Email Verified!
              </p>
              <p className="text-xs text-emerald-700 leading-relaxed">
                {successMessage}
              </p>
            </div>
            <Link href="/dashboard" className="block w-full">
              <Button variant="default" size="lg" className="w-full">
                Proceed to Dashboard
                <ArrowRight className="w-4 h-4 ml-1" />
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

            {/* Quick Demo Code Hint */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600">
              Demo Code: <span className="font-mono font-bold text-primary-purple">123456</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="code" required>
                  6-Digit Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="text-center font-mono text-lg tracking-widest"
                  error={!!errors.code}
                  {...register("code")}
                />
                {errors.code && (
                  <p className="text-xs text-red-500 text-center">{errors.code.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full text-base font-bold shadow-md shadow-primary-purple/20"
                isLoading={isLoading}
              >
                Verify & Continue
              </Button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-purple disabled:text-slate-400 hover:underline focus:outline-none"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend verification code"}
                </span>
              </button>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-100 pt-4">
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-600 hover:text-primary-purple transition-colors"
        >
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <Card className="border-slate-200/90 shadow-lg p-8 text-center text-slate-500 text-sm">
          Loading verification...
        </Card>
      }
    >
      <VerifyEmailForm />
    </React.Suspense>
  );
}
