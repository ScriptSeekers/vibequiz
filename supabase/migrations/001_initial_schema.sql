-- ============================================================
-- VIBE QUIZ: MASTER POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'aspirant', 'teacher', 'professional')),
  education_level TEXT NOT NULL DEFAULT 'undergraduate' CHECK (education_level IN ('school', 'higher-secondary', 'undergraduate', 'postgraduate', 'professional')),
  preferred_language TEXT NOT NULL DEFAULT 'english' CHECK (preferred_language IN ('english', 'hindi', 'hinglish')),
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. UPLOADED STUDY DOCUMENTS (PDF Ingestion)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  page_count INT DEFAULT 1,
  extracted_summary TEXT,
  status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('uploading', 'processing', 'ready', 'error')),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  education_level TEXT NOT NULL CHECK (education_level IN ('school', 'higher-secondary', 'undergraduate', 'postgraduate', 'professional')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
  language TEXT NOT NULL DEFAULT 'english' CHECK (language IN ('english', 'hindi', 'hinglish')),
  time_limit_minutes INT NOT NULL DEFAULT 15,
  question_count INT NOT NULL DEFAULT 10,
  custom_instructions TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_draft BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. QUESTIONS TABLE (Client-accessible metadata)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('single-choice', 'multiple-select', 'true-false', 'fill-in-the-blank', 'short-answer', 'scenario-based')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_text TEXT NOT NULL,
  scenario_context TEXT,
  topic_tag TEXT NOT NULL,
  points INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. QUESTION OPTIONS TABLE (For MCQ, Multi-select, True/False, Scenarios)
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL, -- e.g. 'opt_a', 'opt_b'
  option_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. QUESTION ANSWER KEYS & EXPLANATIONS TABLE
-- SECURITY NOTE: Strictly separated so clients CANNOT read before attempt submission!
CREATE TABLE IF NOT EXISTS public.question_answer_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE UNIQUE,
  correct_answer JSONB NOT NULL, -- string or array of strings (e.g. "opt_a" or ["opt_a", "opt_b"])
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. USER SUBMITTED ANSWERS
CREATE TABLE IF NOT EXISTS public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  submitted_answer JSONB, -- Option key, array of keys, or text
  is_correct BOOLEAN DEFAULT FALSE,
  score_awarded INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- 10. QUIZ RESULTS TABLE (Deterministic scoring records)
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE UNIQUE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_score INT NOT NULL,
  max_score INT NOT NULL,
  score_percentage INT NOT NULL,
  accuracy INT NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('A+', 'A', 'B', 'C', 'D', 'F')),
  correct_count INT NOT NULL,
  incorrect_count INT NOT NULL,
  unattempted_count INT NOT NULL,
  time_spent_seconds INT NOT NULL,
  topic_breakdown JSONB DEFAULT '[]'::JSONB,
  weak_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  strong_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. AI GENERATION LOGS (Audit & Performance monitoring)
CREATE TABLE IF NOT EXISTS public.ai_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
  model_name TEXT NOT NULL,
  prompt_tokens INT,
  completion_tokens INT,
  latency_ms INT,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'timeout')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answer_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Quizzes: Users can manage their own quizzes
DROP POLICY IF EXISTS "Users can manage own quizzes" ON public.quizzes;
CREATE POLICY "Users can manage own quizzes" ON public.quizzes FOR ALL USING (auth.uid() = user_id);

-- Questions & Options: Readable by quiz owner
DROP POLICY IF EXISTS "Users can read quiz questions" ON public.questions;
CREATE POLICY "Users can read quiz questions" ON public.questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.quizzes WHERE id = questions.quiz_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can read question options" ON public.question_options;
CREATE POLICY "Users can read question options" ON public.question_options FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.questions q JOIN public.quizzes qz ON q.quiz_id = qz.id WHERE q.id = question_options.question_id AND qz.user_id = auth.uid())
);

-- Answer Keys: CRITICAL SECURITY RESTRICTION
-- Only accessible once attempt is completed OR via service_role backend
DROP POLICY IF EXISTS "Answer keys hidden until attempt completed" ON public.question_answer_keys;
CREATE POLICY "Answer keys hidden until attempt completed" ON public.question_answer_keys FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.questions q
    JOIN public.quiz_attempts att ON q.quiz_id = att.quiz_id
    WHERE q.id = question_answer_keys.question_id
    AND att.user_id = auth.uid()
    AND att.is_completed = TRUE
  )
);

-- Results: Users can read their own results
DROP POLICY IF EXISTS "Users can view own results" ON public.quiz_results;
CREATE POLICY "Users can view own results" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- AUTOMATED TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
