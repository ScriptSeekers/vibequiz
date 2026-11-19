"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Bell,
  SunMoon,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/features/auth/auth-store";

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  const [emailDigest, setEmailDigest] = React.useState(true);
  const [streakAlerts, setStreakAlerts] = React.useState(true);
  const [examReminders, setExamReminders] = React.useState(false);

  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);
  const [isResetSuccess, setIsResetSuccess] = React.useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } else {
      alert("Passwords do not match or field is empty.");
    }
  };

  const handleResetHistory = () => {
    localStorage.removeItem("vibe_quiz_saved_results");
    localStorage.removeItem("vibe_quiz_saved_quizzes");
    setIsResetDialogOpen(false);
    setIsResetSuccess(true);
    setTimeout(() => setIsResetSuccess(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="space-y-1 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Badge variant="purple">Configuration</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
          System & App Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your security credentials, notification preferences, and storage.
        </p>
      </div>

      {isResetSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Local quiz history reset successfully.</span>
        </div>
      )}

      {/* 1. Security & Password Update */}
      <Card className="border-slate-200/90 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary-purple" />
            <CardTitle className="text-base sm:text-lg">Update Password</CardTitle>
          </div>
          <CardDescription>
            Ensure your account uses a strong, unique password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordSuccess && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Password updated successfully.</span>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" variant="default" size="default" className="font-semibold">
              Save New Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2. Notification Preferences */}
      <Card className="border-slate-200/90 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-vibe-blue" />
            <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
          </div>
          <CardDescription>
            Control how and when Vibe Quiz notifies you of study progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[44px]">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">Weekly Performance Digest</p>
              <p className="text-[11px] text-slate-500">Summary of accuracy, weak topics, and quizzes completed.</p>
            </div>
            <input
              type="checkbox"
              checked={emailDigest}
              onChange={(e) => setEmailDigest(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary-purple focus:ring-primary-purple"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[44px]">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">Study Streak Alerts</p>
              <p className="text-[11px] text-slate-500">Friendly reminders when your active daily streak is at risk.</p>
            </div>
            <input
              type="checkbox"
              checked={streakAlerts}
              onChange={(e) => setStreakAlerts(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary-purple focus:ring-primary-purple"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[44px]">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">Spaced Repetition Prompts</p>
              <p className="text-[11px] text-slate-500">Follow-up notifications to re-test topics you struggled with.</p>
            </div>
            <input
              type="checkbox"
              checked={examReminders}
              onChange={(e) => setExamReminders(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary-purple focus:ring-primary-purple"
            />
          </label>
        </CardContent>
      </Card>

      {/* 3. Destructive Actions: Reset History & Logout */}
      <Card className="border-red-200 bg-red-50/20 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="w-4 h-4" />
            <CardTitle className="text-base sm:text-lg text-red-700">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-red-600/80">
            Irreversible actions affecting stored quizzes and local attempts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-red-200">
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Reset Local Assessment History</p>
              <p className="text-[11px] text-slate-500">Clears completed quizzes and mock result logs from your browser.</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsResetDialogOpen(true)}
              className="shrink-0"
            >
              Reset History
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200">
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Sign Out of All Sessions</p>
              <p className="text-[11px] text-slate-500">Terminate your current session and return to the login screen.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="shrink-0 text-slate-700"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogHeader onClose={() => setIsResetDialogOpen(false)}>
          <DialogTitle>Reset Assessment Records?</DialogTitle>
          <DialogDescription>
            This action will wipe all stored assessment history and past attempts from your browser session.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleResetHistory}>
            Yes, Reset History
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
