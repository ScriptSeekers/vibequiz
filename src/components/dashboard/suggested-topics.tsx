import Link from "next/link";
import { Sparkles, ArrowRight, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SuggestedTopicItem } from "@/mocks/quizzes";

interface SuggestedTopicsProps {
  topics: SuggestedTopicItem[];
}

const DIFFICULTY_COLORS = {
  easy: "green",
  medium: "orange",
  hard: "pink",
} as const;

export function SuggestedTopics({ topics }: SuggestedTopicsProps) {
  return (
    <Card className="border-slate-200/90 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-purple" />
          <CardTitle className="text-base sm:text-lg">Suggested Focus Topics</CardTitle>
        </div>
        <CardDescription>
          Curated practice areas tailored to reinforce high-yield concepts.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl border border-slate-100 bg-surface-ground/60 hover:bg-white hover:border-slate-200 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {t.subject}
                  </span>
                  <Badge variant={DIFFICULTY_COLORS[t.difficulty] as any} size="sm">
                    {t.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {t.topic}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  ~{t.estimatedMinutes} mins
                </span>
                <Link
                  href={`/create-quiz?subject=${encodeURIComponent(t.subject)}&topic=${encodeURIComponent(t.topic)}`}
                >
                  <Button variant="ghost" size="sm" className="text-xs text-primary-purple font-semibold h-8 px-2">
                    Generate Quiz
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
