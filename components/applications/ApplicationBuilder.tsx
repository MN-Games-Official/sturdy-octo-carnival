'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema } from '@/lib/validation';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { QuestionEditor, Question } from './QuestionEditor';
import { AIFormGenerator } from './AIFormGenerator';
import { Plus, Sparkles, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationBuilderProps {
  initialData?: Partial<ApplicationFormData> & { id?: string };
  mode?: 'create' | 'edit';
}

function generateId() {
  return 'q_' + Math.random().toString(36).slice(2, 9);
}

const defaultQuestion = (): Question => ({
  id: generateId(),
  type: 'multiple_choice',
  text: '',
  options: ['', '', '', ''],
  correct_answer: 0,
  max_score: 10,
});

export function ApplicationBuilder({ initialData, mode = 'create' }: ApplicationBuilderProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(
    (initialData?.questions as Question[]) || [defaultQuestion()]
  );
  const [error, setError] = useState<string | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      group_id: initialData?.group_id || '',
      target_role: initialData?.target_role || '',
      pass_score: initialData?.pass_score ?? 70,
      primary_color: initialData?.primary_color || '#ff4b6e',
      secondary_color: initialData?.secondary_color || '#1f2933',
      questions: questions,
    },
  });

  const shortAnswerCount = questions.filter((q) => q.type === 'short_answer').length;

  const addQuestion = () => {
    setQuestions((prev) => [...prev, defaultQuestion()]);
  };

  const updateQuestion = (updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAIGenerated = (form: { name: string; description: string; questions: unknown[] }) => {
    if (form.questions && Array.isArray(form.questions)) {
      const newQuestions = form.questions.map((q: unknown) => {
        const question = q as Question;
        return { ...question, id: generateId() };
      });
      setQuestions(newQuestions);
      setValue('name', form.name);
      setValue('description', form.description);
      showToast('Form generated! Review and save.', 'success');
    }
    setAiModalOpen(false);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setError(null);
    const payload = { ...data, questions };

    try {
      const url = mode === 'edit' && initialData?.id
        ? `/api/applications/${initialData.id}`
        : '/api/applications';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to save application');
        return;
      }

      showToast(mode === 'edit' ? 'Application updated!' : 'Application created!', 'success');
      router.push('/application-center');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/application-center" className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white">{mode === 'edit' ? 'Edit Application' : 'New Application'}</h2>
            <p className="text-slate-400 text-sm">{mode === 'edit' ? 'Update your application form' : 'Build a new application form'}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setAiModalOpen(true)}>
          <Sparkles size={14} />
          AI Generate
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <div className="space-y-4">
            <Input label="Application Name" placeholder="e.g., Staff Application Q2 2025" error={errors.name?.message} {...register('name')} />
            <Textarea label="Description (optional)" placeholder="Brief description of what this application is for..." error={errors.description?.message} {...register('description')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Group ID" placeholder="Roblox Group ID" error={errors.group_id?.message} {...register('group_id')} />
              <Input label="Target Role" placeholder="e.g., Moderator" error={errors.target_role?.message} {...register('target_role')} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Input label="Pass Score (%)" type="number" min={0} max={100} error={errors.pass_score?.message} {...register('pass_score', { valueAsNumber: true })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Primary Color</label>
                <input type="color" defaultValue="#ff4b6e" {...register('primary_color')} className="w-full h-10 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Secondary Color</label>
                <input type="color" defaultValue="#1f2933" {...register('secondary_color')} className="w-full h-10 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions ({questions.length})</CardTitle>
              <span className="text-xs text-slate-500">
                {shortAnswerCount}/3 short answers
              </span>
            </div>
          </CardHeader>
          <div className="space-y-4">
            {questions.map((q, i) => (
              <QuestionEditor
                key={q.id}
                question={q}
                index={i}
                onChange={updateQuestion}
                onDelete={deleteQuestion}
                canDelete={questions.length > 1}
              />
            ))}
            <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
              <Plus size={14} />
              Add Question
            </Button>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/application-center">
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" loading={isSubmitting}>
            <Save size={14} />
            {mode === 'edit' ? 'Save Changes' : 'Create Application'}
          </Button>
        </div>
      </form>

      <Modal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} title="AI Form Generator" size="lg">
        <AIFormGenerator onGenerated={handleAIGenerated} applicationId={initialData?.id || 'new'} />
      </Modal>
    </div>
  );
}
