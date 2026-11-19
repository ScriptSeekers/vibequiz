"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  FileText,
  Sliders,
  Clock,
  Globe,
  Layers,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  HelpCircle,
  Check,
  Play,
} from "lucide-react";
import {
  quizCreationSchema,
  QuizCreationInput,
} from "@/lib/validations/quiz";
import { QuestionType, EducationLevel, QuizDifficulty, QuizLanguage, TimeLimitMinutes } from "@/types/quiz";
import { useQuizStore } from "@/features/quiz-generation/quiz-store";
import { PdfDropzone } from "@/features/pdf-upload/pdf-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const QUESTION_TYPES: { type: QuestionType; label: string; desc: string }[] = [
  { type: "single-choice", label: "Single-Choice MCQ", desc: "1 correct answer" },
  { type: "multiple-select", label: "Multi-Select MCQ", desc: "Multiple correct" },
  { type: "true-false", label: "True / False", desc: "Binary accuracy" },
  { type: "fill-in-the-blank", label: "Fill in the Blanks", desc: "Recall terms" },
  { type: "short-answer", label: "Short Answer", desc: "Conceptual feedback" },
  { type: "scenario-based", label: "Scenario Case Study", desc: "Applied reasoning" },
];

const EDUCATION_LEVELS: { value: EducationLevel; label: string }[] = [
  { value: "school", label: "School (K-10)" },
  { value: "higher-secondary", label: "Higher Secondary (11-12)" },
  { value: "undergraduate", label: "Undergraduate (College)" },
  { value: "postgraduate", label: "Postgraduate (University)" },
  { value: "professional", label: "Professional / Licensure" },
];

const DIFFICULTIES: { value: QuizDifficulty; label: string; badge: "green" | "orange" | "pink" | "purple" }[] = [
  { value: "easy", label: "Easy", badge: "green" },
  { value: "medium", label: "Medium", badge: "orange" },
  { value: "hard", label: "Hard", badge: "pink" },
  { value: "mixed", label: "Mixed Tiers", badge: "purple" },
];

const LANGUAGES: { value: QuizLanguage; label: string; sub: string }[] = [
  { value: "english", label: "English", sub: "Global standard" },
  { value: "hindi", label: "हिंदी", sub: "Devanagari" },
  { value: "hinglish", label: "Hinglish", sub: "Colloquial blend" },
];

const TIME_LIMITS: { value: TimeLimitMinutes; label: string }[] = [
  { value: 0, label: "No Limit" },
  { value: 15, label: "15 Mins" },
  { value: 30, label: "30 Mins" },
  { value: 45, label: "45 Mins" },
  { value: 60, label: "60 Mins" },
];

function CreateQuizFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setDraftConfig } = useQuizStore();

  const querySubject = searchParams.get("subject") || "";
  const queryTopic = searchParams.get("topic") || "";
  const queryMode = searchParams.get("mode") || "topic";

  const [activeTab, setActiveTab] = React.useState<"topic" | "pdf">(
    queryMode === "pdf" ? "pdf" : "topic"
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuizCreationInput>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      subject: querySubject || "Computer Science",
      topic: queryTopic || "Data Structures: Red-Black Trees",
      educationLevel: "undergraduate",
      difficulty: "medium",
      questionCount: 10,
      questionTypes: ["single-choice", "scenario-based"],
      language: "english",
      timeLimitMinutes: 15,
      customInstructions: "",
    },
  });

  const selectedQuestionTypes = watch("questionTypes") || [];
  const selectedDifficulty = watch("difficulty");
  const selectedLanguage = watch("language");
  const selectedTimeLimit = watch("timeLimitMinutes");
  const questionCount = watch("questionCount") || 10;

  const toggleQuestionType = (type: QuestionType) => {
    const exists = selectedQuestionTypes.includes(type);
    if (exists) {
      if (selectedQuestionTypes.length === 1) return; // Keep at least one
      setValue(
        "questionTypes",
        selectedQuestionTypes.filter((t) => t !== type)
      );
    } else {
      setValue("questionTypes", [...selectedQuestionTypes, type]);
    }
  };

  const onSubmit = async (data: QuizCreationInput) => {
    setDraftConfig(data);
    router.push("/quiz-generation");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="purple">AI Quiz Generator</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
          Configure Your Quiz
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Tailor your subject, difficulty, question styles, and time limits.
        </p>
      </div>

      {/* Input Mode Selector (Topic vs PDF) */}
      <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("topic")}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[44px]",
            activeTab === "topic"
              ? "bg-white text-primary-purple shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>Topic & Subject Prompt</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pdf")}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[44px]",
            activeTab === "pdf"
              ? "bg-white text-primary-purple shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Upload PDF Document</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Subject, Topic & PDF */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">1. Content Source</CardTitle>
            <CardDescription>
              {activeTab === "pdf"
                ? "Upload your syllabus, lecture slides, or textbook chapter."
                : "Specify the exact academic discipline and topic to test."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {activeTab === "pdf" && (
              <div className="space-y-2">
                <Label required>Upload PDF Study Material</Label>
                <Controller
                  name="uploadedDocument"
                  control={control}
                  render={({ field }) => (
                    <PdfDropzone
                      value={field.value}
                      onChange={(doc) => {
                        field.onChange(doc);
                        if (doc && !watch("subject")) {
                          setValue("subject", "Document Review");
                          setValue("topic", doc.fileName.replace(/\.pdf$/i, ""));
                        }
                      }}
                    />
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="subject" required>
                  Subject / Discipline
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g. Computer Science, Medicine, Law"
                  error={!!errors.subject}
                  {...register("subject")}
                />
                {errors.subject && (
                  <p className="text-xs text-red-500">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="topic" required>
                  Specific Topic / Focus Area
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g. Distributed Consensus, Cellular Respiration"
                  error={!!errors.topic}
                  {...register("topic")}
                />
                {errors.topic && (
                  <p className="text-xs text-red-500">{errors.topic.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Education Level & Difficulty */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">2. Academic Calibration</CardTitle>
            <CardDescription>
              Select your academic tier and target difficulty level.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Education Level */}
            <div className="space-y-2">
              <Label htmlFor="educationLevel" required>
                Education Level
              </Label>
              <select
                id="educationLevel"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-purple/20 focus:border-primary-purple min-h-[44px]"
                {...register("educationLevel")}
              >
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Cards */}
            <div className="space-y-2">
              <Label required>Difficulty Tier</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {DIFFICULTIES.map((diff) => {
                  const isSelected = selectedDifficulty === diff.value;
                  return (
                    <button
                      key={diff.value}
                      type="button"
                      onClick={() => setValue("difficulty", diff.value)}
                      className={cn(
                        "p-3 rounded-xl border text-center transition-all min-h-[44px] flex items-center justify-center gap-2",
                        isSelected
                          ? "border-primary-purple bg-primary-purple-light/50 font-bold text-primary-purple ring-2 ring-primary-purple/20 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                      )}
                    >
                      <span>{diff.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary-purple" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Question Formats & Count */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">3. Question Formats & Length</CardTitle>
            <CardDescription>
              Choose which question types to generate and the total question count.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question Types */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label required>Select Question Types</Label>
                <span className="text-xs text-slate-400">
                  {selectedQuestionTypes.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {QUESTION_TYPES.map((qt) => {
                  const isChecked = selectedQuestionTypes.includes(qt.type);
                  return (
                    <div
                      key={qt.type}
                      onClick={() => toggleQuestionType(qt.type)}
                      className={cn(
                        "p-3 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3 min-h-[52px]",
                        isChecked
                          ? "border-primary-purple bg-primary-purple-light/30 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50 opacity-80"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 transition-colors",
                          isChecked
                            ? "bg-primary-purple border-primary-purple text-white"
                            : "border-slate-300 bg-white"
                        )}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900">{qt.label}</p>
                        <p className="text-[11px] text-slate-500">{qt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.questionTypes && (
                <p className="text-xs text-red-500">{errors.questionTypes.message}</p>
              )}
            </div>

            {/* Question Count */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <Label htmlFor="questionCount" required>
                  Number of Questions
                </Label>
                <span className="font-mono text-sm font-bold text-primary-purple bg-primary-purple-light px-2.5 py-0.5 rounded-lg">
                  {questionCount} Questions
                </span>
              </div>
              <input
                id="questionCount"
                type="range"
                min={5}
                max={50}
                step={5}
                className="w-full accent-primary-purple h-2 bg-slate-200 rounded-lg cursor-pointer"
                {...register("questionCount", { valueAsNumber: true })}
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>5 (Quick test)</span>
                <span>25 (Standard)</span>
                <span>50 (Full Mock Exam)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Language, Timer & Instructions */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">4. Session Parameters</CardTitle>
            <CardDescription>
              Configure display language, exam timer constraint, and custom prompts.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Language */}
            <div className="space-y-2">
              <Label required>Language</Label>
              <div className="grid grid-cols-3 gap-2.5">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.value;
                  return (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => setValue("language", lang.value)}
                      className={cn(
                        "p-3 rounded-xl border text-center transition-all min-h-[44px]",
                        isSelected
                          ? "border-primary-purple bg-primary-purple-light/50 font-bold text-primary-purple ring-2 ring-primary-purple/20"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <p className="text-xs sm:text-sm font-bold">{lang.label}</p>
                      <p className="text-[10px] text-slate-500">{lang.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Limit */}
            <div className="space-y-2">
              <Label required>Exam Time Limit</Label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {TIME_LIMITS.map((limit) => {
                  const isSelected = selectedTimeLimit === limit.value;
                  return (
                    <button
                      key={limit.value}
                      type="button"
                      onClick={() => setValue("timeLimitMinutes", limit.value)}
                      className={cn(
                        "py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all min-h-[44px] flex items-center justify-center gap-1.5",
                        isSelected
                          ? "border-vibe-blue bg-vibe-blue-light text-vibe-blue ring-2 ring-vibe-blue/20 font-bold"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{limit.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Custom Instructions */}
            <div className="space-y-1.5">
              <Label htmlFor="customInstructions">
                Additional Instructions (Optional)
              </Label>
              <textarea
                id="customInstructions"
                rows={3}
                placeholder="e.g. Focus heavily on numerical problem solving and real-world edge cases. Avoid purely theoretical definitions."
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-purple/20 focus:border-primary-purple"
                {...register("customInstructions")}
              />
              <p className="text-[11px] text-slate-400">
                You can specify exam boards (e.g. CBSE, JEE, USMLE, GATE) or specific areas to stress.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions (Min 44px touch target) */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="flex-1 text-base sm:text-lg font-bold shadow-xl shadow-primary-purple/25 min-h-[52px]"
            isLoading={isSubmitting}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate & Start Quiz
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleSubmit((data) => {
              setDraftConfig(data);
              router.push("/quiz-generation?preview=true");
            })}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-xs sm:text-sm font-semibold border-slate-300 min-h-[52px] px-5 text-slate-700 hover:text-slate-900"
          >
            <Sliders className="w-4 h-4 mr-2" />
            Preview & Edit First
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CreateQuizPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading quiz creation studio...
        </div>
      }
    >
      <CreateQuizFormContent />
    </React.Suspense>
  );
}
