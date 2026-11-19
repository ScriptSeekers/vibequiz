import { NextResponse } from "next/server";
import { QuizCreationFormValues } from "@/types/quiz";
import { Question } from "@/types/question";

export async function POST(req: Request) {
  try {
    const config: QuizCreationFormValues = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "No GEMINI_API_KEY configured" }, { status: 400 });
    }

    const prompt = `You are an expert curriculum examiner. Generate an educational quiz based strictly on the following configuration:
Subject: ${config.subject}
Topic: ${config.topic}
Education Level: ${config.educationLevel}
Difficulty: ${config.difficulty}
Language: ${config.language}
Number of Questions: ${config.questionCount}
Question Types to include: ${config.questionTypes.join(", ")}
${config.customInstructions ? `Custom Instructions: ${config.customInstructions}` : ""}

Return a JSON array of questions matching this schema:
[
  {
    "order": number,
    "type": "single-choice" | "multiple-select" | "true-false" | "fill-in-the-blank" | "short-answer" | "scenario-based",
    "difficulty": "easy" | "medium" | "hard",
    "questionText": string,
    "scenarioContext": string | null,
    "options": [
      { "id": "opt_a", "text": string },
      { "id": "opt_b", "text": string },
      { "id": "opt_c", "text": string },
      { "id": "opt_d", "text": string }
    ],
    "topicTag": string,
    "points": number,
    "correctAnswer": "opt_a" (or ["opt_a", "opt_b"] for multiple-select, or "opt_true"/"opt_false" for true-false, or string answer for text types),
    "explanation": string
  }
]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json({ error: "Gemini generation failed", details: errText }, { status: 502 });
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json({ error: "Empty response from Gemini" }, { status: 502 });
    }

    const parsedQuestions = JSON.parse(rawContent);
    const questionsWithIds: Question[] = parsedQuestions.map((q: any, idx: number) => ({
      id: `q_gemini_${Date.now()}_${idx + 1}`,
      order: idx + 1,
      type: q.type || "single-choice",
      difficulty: q.difficulty || "medium",
      questionText: q.questionText,
      scenarioContext: q.scenarioContext || undefined,
      options: q.options || undefined,
      topicTag: q.topicTag || config.topic,
      points: q.points || (q.difficulty === "hard" ? 2 : 1),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "No explanation recorded.",
    }));

    return NextResponse.json({ questions: questionsWithIds });
  } catch (err: any) {
    console.error("API route error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate quiz" }, { status: 500 });
  }
}
