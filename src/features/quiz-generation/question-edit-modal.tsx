"use client";

import * as React from "react";
import { Question } from "@/types/question";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

interface QuestionEditModalProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedQuestion: Question) => void;
}

export function QuestionEditModal({
  question,
  open,
  onOpenChange,
  onSave,
}: QuestionEditModalProps) {
  const [formData, setFormData] = React.useState<Question | null>(null);

  React.useEffect(() => {
    if (question) {
      setFormData(JSON.parse(JSON.stringify(question)));
    }
  }, [question]);

  if (!formData) return null;

  const handleOptionChange = (index: number, newText: string) => {
    if (!formData.options) return;
    const updated = [...formData.options];
    updated[index] = { ...updated[index], text: newText };
    setFormData({ ...formData, options: updated });
  };

  const handleAddOption = () => {
    if (!formData.options) return;
    const newId = `opt_${String.fromCharCode(97 + formData.options.length)}`;
    setFormData({
      ...formData,
      options: [...formData.options, { id: newId, text: "" }],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!formData.options || formData.options.length <= 2) return;
    const updated = formData.options.filter((_, idx) => idx !== index);
    setFormData({ ...formData, options: updated });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader onClose={() => onOpenChange(false)}>
        <div className="flex items-center gap-2">
          <Badge variant="purple">Question #{formData.order}</Badge>
          <Badge variant="outline">{formData.type}</Badge>
        </div>
        <DialogTitle>Edit Question Content</DialogTitle>
        <DialogDescription>
          Modify prompt text, answer choices, and explanatory reasoning.
        </DialogDescription>
      </DialogHeader>

      <DialogContent>
        {/* Scenario context if available */}
        {formData.scenarioContext && (
          <div className="space-y-1.5">
            <Label htmlFor="scenarioContext">Scenario Context</Label>
            <textarea
              id="scenarioContext"
              rows={3}
              value={formData.scenarioContext}
              onChange={(e) =>
                setFormData({ ...formData, scenarioContext: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-surface-ground"
            />
          </div>
        )}

        {/* Question Text */}
        <div className="space-y-1.5">
          <Label htmlFor="questionText" required>
            Question Statement
          </Label>
          <textarea
            id="questionText"
            rows={3}
            value={formData.questionText}
            onChange={(e) =>
              setFormData({ ...formData, questionText: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20"
          />
        </div>

        {/* Options List for MCQ & Scenario */}
        {formData.options && formData.options.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs font-bold text-primary-purple hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Option
              </button>
            </div>

            <div className="space-y-2">
              {formData.options.map((opt, idx) => {
                const isCorrect = Array.isArray(formData.correctAnswer)
                  ? formData.correctAnswer.includes(opt.id)
                  : formData.correctAnswer === opt.id;

                return (
                  <div key={opt.id} className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400 w-6">
                      {String.fromCharCode(65 + idx)})
                    </span>
                    <Input
                      value={opt.text}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      className="text-xs sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.type === "multiple-select") {
                          const current = Array.isArray(formData.correctAnswer)
                            ? [...formData.correctAnswer]
                            : [];
                          if (current.includes(opt.id)) {
                            setFormData({
                              ...formData,
                              correctAnswer: current.filter((id) => id !== opt.id),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              correctAnswer: [...current, opt.id],
                            });
                          }
                        } else {
                          setFormData({ ...formData, correctAnswer: opt.id });
                        }
                      }}
                      className={`h-9 px-2.5 rounded-lg text-[11px] font-bold border transition-colors shrink-0 ${
                        isCorrect
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
                      }`}
                      title="Set as correct answer"
                    >
                      {isCorrect ? "Correct ✓" : "Mark Correct"}
                    </button>
                    {formData.options && formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Explanation */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <Label htmlFor="explanation" required>
            AI Pedagogical Explanation
          </Label>
          <textarea
            id="explanation"
            rows={3}
            value={formData.explanation || ""}
            onChange={(e) =>
              setFormData({ ...formData, explanation: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20"
          />
        </div>
      </DialogContent>

      <DialogFooter>
        <Button
          variant="outline"
          size="default"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button variant="default" size="default" onClick={handleSave}>
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
