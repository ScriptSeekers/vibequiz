import { Quiz } from "@/types/quiz";

export interface DashboardStatData {
  totalQuizzes: number;
  questionsAttempted: number;
  averageScore: number;
  completionRate: number;
  scoreChange: string; // e.g. "+5.2% this week"
  quizzesChange: string;
}

export const MOCK_DASHBOARD_STATS: DashboardStatData = {
  totalQuizzes: 18,
  questionsAttempted: 245,
  averageScore: 82.4,
  completionRate: 94.2,
  scoreChange: "+4.8% vs last week",
  quizzesChange: "+3 new this week",
};

export interface PerformanceTrendPoint {
  date: string;
  score: number;
  platformAvg: number;
}

export const MOCK_PERFORMANCE_TREND: PerformanceTrendPoint[] = [
  { date: "Oct 12", score: 68, platformAvg: 65 },
  { date: "Oct 18", score: 72, platformAvg: 66 },
  { date: "Oct 25", score: 75, platformAvg: 68 },
  { date: "Nov 02", score: 81, platformAvg: 69 },
  { date: "Nov 09", score: 79, platformAvg: 70 },
  { date: "Nov 15", score: 86, platformAvg: 71 },
  { date: "Nov 18", score: 88, platformAvg: 72 },
];

export interface SubjectPerformancePoint {
  subject: string;
  score: number;
  quizzesCount: number;
}

export const MOCK_SUBJECT_PERFORMANCE: SubjectPerformancePoint[] = [
  { subject: "Computer Science", score: 88, quizzesCount: 8 },
  { subject: "Mathematics", score: 76, quizzesCount: 4 },
  { subject: "Physics", score: 82, quizzesCount: 3 },
  { subject: "General Aptitude", score: 91, quizzesCount: 3 },
];

export interface RecentQuizItem {
  id: string;
  title: string;
  subject: string;
  topic: string;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard" | "mixed";
  lastScore?: number;
  completedAt?: string;
  createdAt: string;
  status: "completed" | "in-progress" | "not-attempted";
}

export const MOCK_RECENT_QUIZZES: RecentQuizItem[] = [
  {
    id: "quiz_cs_01",
    title: "Operating Systems — Process Scheduling & Synchronization",
    subject: "Computer Science",
    topic: "Process Scheduling",
    questionCount: 15,
    difficulty: "medium",
    lastScore: 86.6,
    completedAt: "2 hours ago",
    createdAt: "2026-11-18T10:00:00Z",
    status: "completed",
  },
  {
    id: "quiz_ds_02",
    title: "Data Structures — Balanced Binary Search Trees",
    subject: "Computer Science",
    topic: "AVL & Red-Black Trees",
    questionCount: 12,
    difficulty: "hard",
    lastScore: 75.0,
    completedAt: "Yesterday",
    createdAt: "2026-11-17T14:30:00Z",
    status: "completed",
  },
  {
    id: "quiz_phy_03",
    title: "Quantum Physics — Photoelectric Effect & Wave Mechanics",
    subject: "Physics",
    topic: "Wave-Particle Duality",
    questionCount: 10,
    difficulty: "medium",
    createdAt: "2026-11-16T18:00:00Z",
    status: "not-attempted",
  },
  {
    id: "quiz_math_04",
    title: "Linear Algebra — Eigenvalues, Eigenvectors & Diagonalization",
    subject: "Mathematics",
    topic: "Matrices & Transformations",
    questionCount: 20,
    difficulty: "hard",
    lastScore: 80.0,
    completedAt: "3 days ago",
    createdAt: "2026-11-15T09:15:00Z",
    status: "completed",
  },
];

export interface SuggestedTopicItem {
  id: string;
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  estimatedMinutes: number;
}

export const MOCK_SUGGESTED_TOPICS: SuggestedTopicItem[] = [
  {
    id: "top_1",
    subject: "Computer Science",
    topic: "System Design: Cache Invalidation & CDNs",
    difficulty: "hard",
    description: "Deep dive into write-through vs write-back caching and LRU strategies.",
    estimatedMinutes: 20,
  },
  {
    id: "top_2",
    subject: "General Aptitude",
    topic: "Logical Deduction & Syllogisms",
    difficulty: "medium",
    description: "High-frequency reasoning patterns for entrance and placement exams.",
    estimatedMinutes: 15,
  },
  {
    id: "top_3",
    subject: "Machine Learning",
    topic: "Transformer Attention Mechanisms",
    difficulty: "hard",
    description: "Multi-head scaled dot-product attention formulations and positional encodings.",
    estimatedMinutes: 25,
  },
  {
    id: "top_4",
    subject: "Physics",
    topic: "Thermodynamics: Entropy & Carnot Engines",
    difficulty: "medium",
    description: "Reversible processes, second law formulations, and cycle efficiency.",
    estimatedMinutes: 15,
  },
];
