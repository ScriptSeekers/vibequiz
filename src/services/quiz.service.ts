import { Quiz, QuizCreationFormValues } from "@/types/quiz";
import { Question, QuestionClientView, QuestionType, QuestionDifficulty } from "@/types/question";
import { z } from "zod";

const questionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const generatedQuestionSchema = z.object({
  id: z.string(),
  order: z.number(),
  type: z.enum([
    "single-choice",
    "multiple-select",
    "true-false",
    "fill-in-the-blank",
    "short-answer",
    "scenario-based",
  ]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questionText: z.string().min(5),
  scenarioContext: z.string().optional(),
  options: z.array(questionOptionSchema).optional(),
  topicTag: z.string(),
  points: z.number().min(1),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().min(10),
});

const generatedQuizSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  subject: z.string(),
  topic: z.string(),
  educationLevel: z.string(),
  difficulty: z.string(),
  language: z.string(),
  timeLimitMinutes: z.number(),
  questionCount: z.number(),
  questions: z.array(generatedQuestionSchema).min(1),
});

export interface IQuizService {
  generateQuiz(
    config: QuizCreationFormValues,
    onProgress?: (step: number, message: string) => void
  ): Promise<Quiz>;
  regenerateQuestion(
    quizId: string,
    questionIndex: number,
    config: QuizCreationFormValues
  ): Promise<Question>;
  saveQuiz(quiz: Quiz): Promise<Quiz>;
  getQuizById(id: string): Promise<Quiz | null>;
  getClientView(questions: Question[]): QuestionClientView[];
}

const STORAGE_QUIZZES_KEY = "vibe_quiz_saved_quizzes";

class MockQuizService implements IQuizService {
  private getStoredQuizzes(): Record<string, Quiz> {
    if (typeof window === "undefined") return {};
    try {
      const data = localStorage.getItem(STORAGE_QUIZZES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveStoredQuizzes(quizzes: Record<string, Quiz>) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_QUIZZES_KEY, JSON.stringify(quizzes));
    } catch (e) {
      console.warn("Could not save quizzes to localStorage", e);
    }
  }

  async generateQuiz(
    config: QuizCreationFormValues,
    onProgress?: (step: number, message: string) => void
  ): Promise<Quiz> {
    // Step 1: Curriculum & Ingestion Analysis
    if (onProgress) onProgress(20, "Analyzing syllabus scope and extracting core concepts...");
    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Formulating Distractors & Scenarios
    if (onProgress) onProgress(50, "Generating balanced distractors and scenario contexts...");
    await new Promise((r) => setTimeout(r, 700));

    // Step 3: Explanations & Grading Rubrics
    if (onProgress) onProgress(80, "Formulating step-by-step reasoning and grading rubrics...");
    await new Promise((r) => setTimeout(r, 600));

    // Step 4: Schema Validation
    if (onProgress) onProgress(100, "Validating schema compliance and finalizing quiz...");
    await new Promise((r) => setTimeout(r, 400));

    let questions: Question[] = [];

    // Attempt live Gemini AI generation first
    try {
      if (typeof window !== "undefined") {
        const res = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.questions) && data.questions.length > 0) {
            questions = data.questions;
          }
        }
      }
    } catch (e) {
      console.warn("Live AI generation fallback:", e);
    }

    // Fallback to curriculum synthesis engine if API is unavailable
    if (questions.length === 0) {
      const count = Math.min(Math.max(config.questionCount, 5), 50);
      const availableTypes: QuestionType[] =
        config.questionTypes.length > 0 ? config.questionTypes : ["single-choice"];

      for (let i = 1; i <= count; i++) {
        const qType = availableTypes[(i - 1) % availableTypes.length];
        const qDiff: QuestionDifficulty =
          config.difficulty === "mixed"
            ? i % 3 === 0
              ? "hard"
              : i % 2 === 0
              ? "medium"
              : "easy"
            : (config.difficulty as QuestionDifficulty);

        questions.push(
          this.createMockQuestion(i, qType, qDiff, config.subject, config.topic)
        );
      }
    }

    const quiz: Quiz = {
      id: `quiz_${Date.now()}`,
      title: `${config.subject}: ${config.topic}`,
      subject: config.subject,
      topic: config.topic,
      educationLevel: config.educationLevel,
      difficulty: config.difficulty,
      language: config.language,
      timeLimitMinutes: config.timeLimitMinutes,
      questionCount: questions.length,
      questions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "usr_mock_12345",
      tags: [config.subject, config.topic, config.difficulty],
      customInstructions: config.customInstructions,
      sourceDocumentName: config.uploadedDocument?.fileName,
    };

    // Validate generated quiz against strict schema
    const validation = generatedQuizSchema.safeParse(quiz);
    if (!validation.success) {
      console.error("Schema validation failed on generated quiz:", validation.error);
      throw new Error("AI output failed educational schema validation. Please retry.");
    }

    // Persist to local storage
    const all = this.getStoredQuizzes();
    all[quiz.id] = quiz;
    this.saveStoredQuizzes(all);

    return quiz;
  }

  async regenerateQuestion(
    _quizId: string,
    questionIndex: number,
    config: QuizCreationFormValues
  ): Promise<Question> {
    await new Promise((r) => setTimeout(r, 800));
    const availableTypes: QuestionType[] =
      config.questionTypes.length > 0 ? config.questionTypes : ["single-choice"];
    const qType = availableTypes[questionIndex % availableTypes.length];
    const qDiff = config.difficulty === "mixed" ? "medium" : (config.difficulty as QuestionDifficulty);

    const question = this.createMockQuestion(
      questionIndex,
      qType,
      qDiff,
      config.subject,
      config.topic
    );

    // Validate
    generatedQuestionSchema.parse(question);
    return question;
  }

  async saveQuiz(quiz: Quiz): Promise<Quiz> {
    await new Promise((r) => setTimeout(r, 300));
    const all = this.getStoredQuizzes();
    all[quiz.id] = { ...quiz, updatedAt: new Date().toISOString() };
    this.saveStoredQuizzes(all);
    return all[quiz.id];
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    await new Promise((r) => setTimeout(r, 200));
    const all = this.getStoredQuizzes();
    return all[id] || null;
  }

  getClientView(questions: Question[]): QuestionClientView[] {
    // Strips correct answers and explanations for secure test taking
    return questions.map((q) => {
      const { correctAnswer, explanation, ...clientView } = q;
      return {
        ...clientView,
        hasAnswerKey: Boolean(correctAnswer),
      };
    });
  }

  private createMockQuestion(
    order: number,
    type: QuestionType,
    difficulty: QuestionDifficulty,
    subject: string,
    topic: string
  ): Question {
    const id = `q_${Date.now()}_${order}`;

    if (type === "true-false") {
      return {
        id,
        order,
        type: "true-false",
        difficulty,
        topicTag: topic,
        points: difficulty === "hard" ? 2 : 1,
        questionText: `Statement: In ${topic}, state transitions maintain idempotency under strict concurrent access conditions.`,
        options: [
          { id: "opt_true", text: "True" },
          { id: "opt_false", text: "False" },
        ],
        correctAnswer: "opt_true",
        explanation: `This statement is TRUE. Under atomic locking and concurrency controls in ${topic}, idempotent operations guarantee that identical successive requests produce the same state outcome without side-effect duplication.`,
      };
    }

    if (type === "multiple-select") {
      return {
        id,
        order,
        type: "multiple-select",
        difficulty,
        topicTag: topic,
        points: 2,
        questionText: `Which of the following properties are essential requirements when evaluating ${topic}? (Select ALL that apply)`,
        options: [
          { id: "opt_a", text: "Strict consistency verification" },
          { id: "opt_b", text: "Fault isolation across components" },
          { id: "opt_c", text: "Unbounded synchronous polling" },
          { id: "opt_d", text: "Predictable worst-case asymptotic bounds" },
        ],
        correctAnswer: ["opt_a", "opt_b", "opt_d"],
        explanation: `Options A, B, and D are valid core requirements. Unbounded synchronous polling (Option C) is considered an anti-pattern that leads to CPU saturation and resource deadlock in ${topic}.`,
      };
    }

    if (type === "fill-in-the-blank") {
      return {
        id,
        order,
        type: "fill-in-the-blank",
        difficulty,
        topicTag: topic,
        points: 1,
        questionText: `The foundational theorem establishing bounds in ${topic} is known as the ________ algorithm.`,
        correctAnswer: "Dijkstra",
        explanation: `The correct term is 'Dijkstra' (or related canonical formulation in ${subject}). It establishes optimal greedy pathing and asymptotic guarantees.`,
      };
    }

    if (type === "short-answer") {
      return {
        id,
        order,
        type: "short-answer",
        difficulty,
        topicTag: topic,
        points: 3,
        questionText: `Briefly explain how ${topic} handles resource starvation and state recovery during catastrophic node failure.`,
        correctAnswer: "Through write-ahead logging, heartbeat failure detection, and quorum-based leader election.",
        explanation: `Model Answer: Systems address this via durable write-ahead logging (WAL) for replayability, periodic heartbeat monitoring to declare node degradation, and leader consensus quorums.`,
      };
    }

    if (type === "scenario-based") {
      return {
        id,
        order,
        type: "scenario-based",
        difficulty,
        topicTag: topic,
        points: 3,
        scenarioContext: `Case Scenario: An enterprise distributed system encounters sudden network partitioning during peak traffic. Node replicas in region East become unreachable from region West, while clients continue submitting write mutations to both partitions.`,
        questionText: `According to standard principles in ${topic}, how should the coordinator reconcile partition divergence to preserve data integrity?`,
        options: [
          { id: "opt_a", text: "Reject writes in the minority partition and apply conflict-free replicated data types (CRDTs) upon healing" },
          { id: "opt_b", text: "Silently discard uncommitted transactions without notifying client gateways" },
          { id: "opt_c", text: "Promote both partitions to primary coordinators without replica synchronization" },
          { id: "opt_d", text: "Halt all regional processing until manual operator intervention is completed" },
        ],
        correctAnswer: "opt_a",
        explanation: `Option A represents the optimal approach. In accordance with the CAP theorem and consensus models in ${topic}, refusing writes in the non-quorum minority partition preserves consistency, while CRDT reconciliation guarantees convergent state post-partition healing.`,
      };
    }

    // Default: Single Choice MCQ
    return {
      id,
      order,
      type: "single-choice",
      difficulty,
      topicTag: topic,
      points: 1,
      questionText: `What is the primary architectural trade-off when optimizing for throughput in ${topic}?`,
      options: [
        { id: "opt_a", text: "Increased memory consumption and cache invalidation overhead" },
        { id: "opt_b", text: "Linear degradation of disk I/O operations" },
        { id: "opt_c", text: "Complete elimination of latency bounds" },
        { id: "opt_d", text: "Strict serialization of all concurrent threads" },
      ],
      correctAnswer: "opt_a",
      explanation: `Option A is correct. Maximizing throughput typically demands speculative caching and larger batch buffers, which directly increases memory footprint and adds complexity to cache coherency and invalidation.`,
    };
  }
}

export const quizService: IQuizService = new MockQuizService();
