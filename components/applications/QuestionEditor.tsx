'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Trash2, GripVertical, Plus } from 'lucide-react';

export interface Question {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'true_false';
  text: string;
  options?: string[];
  correct_answer?: number | string | boolean;
  max_score: number;
  grading_criteria?: string;
}

interface QuestionEditorProps {
  question: Question;
  index: number;
  onChange: (question: Question) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

const typeOptions = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'true_false', label: 'True / False' },
];

export function QuestionEditor({ question, index, onChange, onDelete, canDelete }: QuestionEditorProps) {
  const update = (updates: Partial<Question>) => onChange({ ...question, ...updates });

  const updateOption = (i: number, value: string) => {
    const options = [...(question.options || ['', '', '', ''])];
    options[i] = value;
    update({ options });
  };

  const addOption = () => {
    const options = [...(question.options || []), ''];
    update({ options });
  };

  const removeOption = (i: number) => {
    const options = (question.options || []).filter((_, idx) => idx !== i);
    update({ options });
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-slate-600 cursor-grab" />
          <Badge variant="pink" size="md">Q{index + 1}</Badge>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Select
            options={typeOptions}
            value={question.type}
            onChange={(e) => update({ type: e.target.value as Question['type'], options: e.target.value === 'multiple_choice' ? ['', '', '', ''] : undefined })}
            className="w-48"
          />
          <Input
            type="number"
            value={question.max_score}
            onChange={(e) => update({ max_score: parseInt(e.target.value) || 1 })}
            className="w-20"
            min={1}
            max={100}
          />
          <span className="text-slate-500 text-xs shrink-0">pts</span>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(question.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <Textarea
        placeholder={`Question ${index + 1} text...`}
        value={question.text}
        onChange={(e) => update({ text: e.target.value })}
        className="min-h-[60px]"
      />

      {question.type === 'multiple_choice' && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium">Answer options (select correct one):</p>
          {(question.options || ['', '', '', '']).map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={question.correct_answer === i}
                onChange={() => update({ correct_answer: i })}
                className="accent-pink-500"
              />
              <Input
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1"
              />
              {(question.options?.length || 0) > 2 && (
                <button onClick={() => removeOption(i)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={addOption} className="text-xs">
            <Plus size={12} /> Add option
          </Button>
        </div>
      )}

      {question.type === 'true_false' && (
        <div className="flex items-center gap-4">
          <p className="text-xs text-slate-400">Correct answer:</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={question.correct_answer === true}
              onChange={() => update({ correct_answer: true })}
              className="accent-pink-500"
            />
            <span className="text-sm text-slate-300">True</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={question.correct_answer === false}
              onChange={() => update({ correct_answer: false })}
              className="accent-pink-500"
            />
            <span className="text-sm text-slate-300">False</span>
          </label>
        </div>
      )}

      {question.type === 'short_answer' && (
        <div className="space-y-2">
          <Textarea
            label="Grading criteria (used by AI grader)"
            placeholder="Describe what a good answer looks like..."
            value={question.grading_criteria || ''}
            onChange={(e) => update({ grading_criteria: e.target.value })}
            className="min-h-[60px]"
          />
          <p className="text-xs text-slate-500">💡 Max 3 short answer questions allowed per form</p>
        </div>
      )}
    </div>
  );
}
