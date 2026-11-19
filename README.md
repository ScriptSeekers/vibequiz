# Vibe Quiz — AI-Powered Quiz Generation & Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A production-quality, responsive SaaS web application designed for students, competitive exam aspirants, educators, and working professionals to generate personalized quizzes with AI, attempt assessments under timed conditions, review step-by-step reasoning, and monitor academic progress with interactive analytics.

---

## 🚀 Key Features

- **Natural Language & PDF Generation:** Generate custom quizzes from any subject prompt or by uploading lecture notes, slide decks, or textbook chapters (up to 25MB).
- **6 Assessment Formats:** Single-choice MCQs, Multiple-select MCQs, True/False, Fill in the blanks, Short conceptual answers, and Applied case study scenarios.
- **Academic Rigor Calibration:** Target School (K-10), Higher Secondary (11-12), Undergraduate, Postgraduate, or Professional licensing levels across Easy, Medium, Hard, and Mixed tiers.
- **Multilingual Support:** English, Hindi (हिंदी), and Hinglish (colloquial blend).
- **Active Recall & Explanations:** Comprehensive pedagogical AI explanations for every answer choice and distractor.
- **Deterministic Server-Side Evaluation:** Client responses are evaluated against authoritative keys to guarantee score integrity.
- **Mobile-First Responsive Design:** Engineered with intentional layout adaptations for screens from **320px** to **1440px+** with 44px minimum touch targets and safe-area inset protection.
- **Interactive Visual Analytics:** Track historical score trajectories, difficulty breakdown, and weak syllabus concepts using Recharts.

---

## 🎨 Design System & Color Palette

| Token | Hex | Role |
|---|---|---|
| **Primary Purple** | `#7655E8` | Core brand identity and primary user actions |
| **Vibe Blue** | `#477CF4` | Secondary accents, time limits, and cohort metrics |
| **Vibe Pink** | `#F06C9B` | Energy highlights and hard difficulty indicators |
| **Vibe Orange** | `#FFAA55` | Review bookmarks, streaks, and medium tiers |
| **Vibe Green** | `#25B98A` | Correct answers, strong topics, and success states |
| **Surface Ground** | `#F8F9FD` | Clean, low-fatigue application surface |
| **Surface Card** | `#FFFFFF` | Elevated cards with subtle `0 4px 12px` drop shadows |

### Typography
- **Headings:** `Plus Jakarta Sans` (weights: 600, 700, 800)
- **Body:** `Inter` (weights: 400, 500, 600)

---

## 📁 Architecture & File Structure

```text
src/
├── app/
│   ├── (marketing)/           # Public marketing routes
│   │   ├── page.tsx           # SaaS Landing page
│   │   ├── features/page.tsx  # Deep-dive capabilities
│   │   ├── about/page.tsx     # Mission and active recall philosophy
│   │   └── pricing/page.tsx   # Free Early Access and upcoming tiers
│   ├── (auth)/                # Authentication views
│   │   ├── login/page.tsx     # Sign-in with demo auto-fill
│   │   ├── signup/page.tsx    # Registration with password checklist
│   │   ├── forgot-password/   # Password reset request
│   │   ├── reset-password/    # Password update
│   │   └── verify-email/      # 6-digit email verification with resend
│   ├── (dashboard)/           # Authenticated application workspace
│   │   ├── dashboard/page.tsx # Central KPI workspace & activity
│   │   ├── create-quiz/       # Creation studio & PDF dropzone
│   │   ├── quiz-generation/   # Animated progress & editing studio
│   │   ├── quiz-attempt/      # Secure timed examination engine
│   │   ├── results/page.tsx   # Score banner, confetti & review cards
│   │   ├── analytics/page.tsx # Recharts performance trends & weak areas
│   │   ├── my-quizzes/        # Searchable quiz library & management
│   │   ├── quiz-history/      # Historical attempt records
│   │   ├── profile/page.tsx   # Academic profile editor
│   │   └── settings/page.tsx  # Security credentials & notifications
│   ├── not-found.tsx          # Custom 404 page
│   ├── error.tsx              # Error boundary
│   └── globals.css            # Tailwind v4 theme & CSS tokens
├── components/
│   ├── ui/                    # Reusable primitives (Button, Card, Badge, Dialog...)
│   ├── layout/                # Desktop sidebar, topbar, and mobile bottom nav
│   └── dashboard/             # Recharts charts and stat widgets
├── features/
│   ├── auth/                  # Zustand authentication store
│   ├── pdf-upload/            # Drag-and-drop PDF component
│   ├── quiz-generation/       # Question edit modal & draft store
│   └── quiz-attempt/          # Exam card, timer, and navigator drawer
├── services/                  # Decoupled mock & API service adapters
│   ├── auth.service.ts        # Auth service (Supabase ready)
│   ├── quiz.service.ts        # Question generation & client filtering
│   ├── pdf.service.ts         # Document validation & upload
│   ├── results.service.ts     # Deterministic scoring engine
│   └── analytics.service.ts   # Cohort trends & mastery calculations
├── types/                     # Shared TypeScript domain contracts
└── config/                    # Global metadata configuration
```

---

## 🛠️ Local Installation & Development

### Prerequisites
- **Node.js:** v18.17+ or v20+ (tested on Node v25.9)
- **Package Manager:** npm or pnpm

### Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vibequiz/vibequiz.git
   cd vibequiz
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

### Automated Scoring Test Suite
Run the mathematical verification suite that validates scoring accuracy, case normalization, and unattempted question handling:
```bash
npx tsx scripts/test-evaluation.ts
```

### Static Type Check
```bash
npx tsc --noEmit
```

### Production Build
```bash
npm run build
```

---

## 📱 Mobile Responsiveness Checklist

Vibe Quiz was designed mobile-first and audited across key breakpoints:

| Viewport | Category | Layout Behavior |
|---|---|---|
| `320px – 375px` | Small phones | 1-column forms, bottom mobile nav, hidden desktop sidebars, 44px+ touch targets |
| `376px – 430px` | Standard phones | 2-column KPI cards, full-width options, slide-up navigator sheet |
| `601px – 1024px` | Tablets | Compact 2-column forms, flexible Recharts widths |
| `1025px – 1440px` | Laptops / Desktops | Fixed 260px sidebar, dual-column question & sticky navigation panel |

---

## 🚢 Deployment (Vercel)

1. Push your repository to **GitHub**.
2. Connect your repository on the [Vercel Dashboard](https://vercel.com/new).
3. The framework preset is automatically detected as **Next.js**.
4. Configure required environment variables from `.env.example`.
5. Deploy. The project produces statically prerendered routes and handles dynamic routes seamlessly.

---

## 📄 License
This project is licensed under the MIT License.
