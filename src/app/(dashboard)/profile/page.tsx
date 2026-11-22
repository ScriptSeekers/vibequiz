"use client";

import * as React from "react";
import { useAuthStore } from "@/features/auth/auth-store";
import { User, Mail, GraduationCap, Globe, CheckCircle2, Shield, Camera } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useAuthStore();

  const [fullName, setFullName] = React.useState(
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Learner")
  );
  const [email, setEmail] = React.useState(user?.email || "");
  const [educationLevel, setEducationLevel] = React.useState(user?.educationLevel || "undergraduate");
  const [preferredLanguage, setPreferredLanguage] = React.useState(user?.preferredLanguage || "english");
  const [bio, setBio] = React.useState(user?.bio || "");
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      else if (user.email) setFullName(user.email.split("@")[0]);
      if (user.email) setEmail(user.email);
      if (user.educationLevel) setEducationLevel(user.educationLevel);
      if (user.preferredLanguage) setPreferredLanguage(user.preferredLanguage);
      if (user.bio) setBio(user.bio);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="space-y-1 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">Account Settings</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your account information, academic level, and personal preferences.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Profile changes updated successfully.</span>
        </div>
      )}

      {/* Profile Card */}
      <Card className="border-slate-200/90 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Personal Details</CardTitle>
          <CardDescription>
            Update your profile and academic context for calibrated quiz generation.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar & Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="relative">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-primary-purple via-vibe-blue to-vibe-pink flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                  {(fullName || "U").charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-heading font-bold text-slate-900 text-lg">
                  {fullName || "Student Learner"}
                </h3>
                <p className="text-xs text-slate-500">{email || "No email registered"}</p>
                <Badge variant="blue" size="sm">
                  Active Student
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" required>
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" required>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Education Level */}
              <div className="space-y-1.5">
                <Label htmlFor="educationLevel">Default Education Tier</Label>
                <select
                  id="educationLevel"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-purple/20 min-h-[44px]"
                >
                  <option value="school">School (K-10)</option>
                  <option value="higher-secondary">Higher Secondary (11-12)</option>
                  <option value="undergraduate">Undergraduate (College)</option>
                  <option value="postgraduate">Postgraduate (University)</option>
                  <option value="professional">Professional / Licensure</option>
                </select>
              </div>

              {/* Preferred Language */}
              <div className="space-y-1.5">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <select
                  id="preferredLanguage"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-purple/20 min-h-[44px]"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi (हिंदी)</option>
                  <option value="hinglish">Hinglish</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="bio">Academic Bio & Study Goals</Label>
              <textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-purple/20"
                placeholder="Mention your target exams (e.g. UPSC, GATE, GRE, Finals)..."
              />
            </div>

            <Button type="submit" variant="default" size="lg" className="font-bold min-h-[44px]">
              Save Profile Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
