import { Quiz } from "../src/types/quiz";
import { resultsService } from "../src/services/results.service";

/**
 * Automated Verification Script for Deterministic Quiz Scoring
 * Run: npx tsx scripts/test-evaluation.ts
 */
async function runTests() {
  console.log("=== VIBE QUIZ: DETERMINISTIC EVALUATION SUITE ===");

  const mockQuiz: Quiz = {
    id: "test_quiz_01",
    title: "Test Algorithms",
    subject: "Computer Science",
    topic: "Sorting & Trees",
    educationLevel: "undergraduate",
    difficulty: "medium",
    language: "english",
    timeLimitMinutes: 15,
    questionCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "test_usr",
    tags: ["CS"],
    questions: [
      {
        id: "q1",
        order: 1,
        type: "single-choice",
        difficulty: "easy",
        topicTag: "Sorting",
        points: 1,
        questionText: "What is the worst-case runtime of QuickSort?",
        options: [
          { id: "opt_a", text: "O(n log n)" },
          { id: "opt_b", text: "O(n^2)" },
        ],
        correctAnswer: "opt_b",
        explanation: "O(n^2) when bad pivots chosen.",
      },
      {
        id: "q2",
        order: 2,
        type: "multiple-select",
        difficulty: "medium",
        topicTag: "Trees",
        points: 2,
        questionText: "Which are balanced BST variants? (Select all)",
        options: [
          { id: "opt_avl", text: "AVL Tree" },
          { id: "opt_rb", text: "Red-Black Tree" },
          { id: "opt_ll", text: "Linked List" },
        ],
        correctAnswer: ["opt_avl", "opt_rb"],
        explanation: "AVL and Red-Black are balanced trees.",
      },
      {
        id: "q3",
        order: 3,
        type: "fill-in-the-blank",
        difficulty: "easy",
        topicTag: "Sorting",
        points: 1,
        questionText: "MergeSort uses a divide-and-________ paradigm.",
        correctAnswer: "conquer",
        explanation: "Divide and conquer.",
      },
    ],
  };

  // Test Case 1: 100% Correct Submission
  console.log("\n[TEST 1] Testing 100% Correct Responses...");
  const perfectAnswers = {
    q1: "opt_b",
    q2: ["opt_avl", "opt_rb"],
    q3: "Conquer ", // testing trimming and case-insensitivity
  };

  const res1 = await resultsService.evaluateQuiz(mockQuiz, perfectAnswers, 300);
  console.assert(res1.score === 4, `Expected score 4, got ${res1.score}`);
  console.assert(res1.scorePercentage === 100, `Expected 100%, got ${res1.scorePercentage}%`);
  console.assert(res1.grade === "A+", `Expected grade A+, got ${res1.grade}`);
  console.assert(res1.correctAnswers === 3, `Expected 3 correct, got ${res1.correctAnswers}`);
  console.log("✓ TEST 1 PASSED: 100% score, Grade A+, 3/3 correct.");

  // Test Case 2: Partial & Unattempted Questions
  console.log("\n[TEST 2] Testing Partial & Unattempted Submissions...");
  const partialAnswers = {
    q1: "opt_a", // wrong
    q2: ["opt_avl"], // incomplete multi-select
    // q3 unattempted
  };

  const res2 = await resultsService.evaluateQuiz(mockQuiz, partialAnswers, 450);
  console.assert(res2.score === 0, `Expected score 0, got ${res2.score}`);
  console.assert(res2.unattemptedQuestions === 1, `Expected 1 unattempted, got ${res2.unattemptedQuestions}`);
  console.assert(res2.incorrectAnswers === 2, `Expected 2 incorrect, got ${res2.incorrectAnswers}`);
  console.assert(res2.grade === "F", `Expected grade F, got ${res2.grade}`);
  console.log("✓ TEST 2 PASSED: 0 points, Grade F, 1 unattempted detected.");

  console.log("\n=== ALL AUTOMATED EVALUATION TESTS PASSED SUCCESSFULLY ===");
}

runTests().catch(console.error);
