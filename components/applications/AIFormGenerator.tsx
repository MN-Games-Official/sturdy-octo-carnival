'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { Sparkles, Wand2 } from 'lucide-react';

interface GeneratorFormData {
  name: string;
  description: string;
  group_id: string;
  rank: string;
  questions_count: string;
  vibe: string;
  instructions: string;
}

interface AIFormGeneratorProps {
  onGenerated: (form: { name: string; description: string; questions: unknown[] }) => void;
  applicationId?: string;
}

const vibeOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual & Friendly' },
  { value: 'strict', label: 'Strict & Formal' },
  { value: 'fun', label: 'Fun & Engaging' },
];

const countOptions = [
  { value: '4', label: '4 questions' },
  { value: '6', label: '6 questions' },
  { value: '8', label: '8 questions' },
  { value: '10', label: '10 questions' },
];

export function AIFormGenerator({ onGenerated, applicationId }: AIFormGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<GeneratorFormData>({
    defaultValues: { questions_count: '6', vibe: 'professional' },
  });

  const onSubmit = async (data: GeneratorFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/applications/${applicationId || 'generate'}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          questions_count: parseInt(data.questions_count),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || 'Failed to generate form');
        return;
      }

      onGenerated(result.form);
    } catch {
      setError('Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
          <Sparkles size={16} className="text-pink-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">AI Form Generator</h3>
          <p className="text-xs text-slate-400">Generate questions using Abacus AI</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Application name" placeholder="e.g., Staff Application" {...register('name', { required: true })} />
          <Input label="Group ID" placeholder="Roblox Group ID" {...register('group_id', { required: true })} />
        </div>
        <Textarea label="Description" placeholder="Brief description of this role..." {...register('description')} className="min-h-[60px]" />
        <div className="grid grid-cols-3 gap-3">
          <Input label="Target rank" placeholder="e.g., Moderator" {...register('rank')} />
          <Select label="Questions" options={countOptions} {...register('questions_count')} />
          <Select label="Tone" options={vibeOptions} {...register('vibe')} />
        </div>
        <Textarea label="Special instructions (optional)" placeholder="Any specific topics or requirements..." {...register('instructions')} className="min-h-[60px]" />

        <Button type="submit" loading={loading} className="w-full gap-2">
          <Wand2 size={16} />
          Generate with AI
        </Button>
      </form>
    </div>
  );
}
