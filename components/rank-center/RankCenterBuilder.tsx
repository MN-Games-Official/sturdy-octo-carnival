'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rankCenterSchema } from '@/lib/validation';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { RankList, RankEntry } from './RankList';
import { ArrowLeft, Save } from 'lucide-react';
import { z } from 'zod';

type RankCenterFormData = z.infer<typeof rankCenterSchema>;

interface RankCenterBuilderProps {
  initialData?: Partial<RankCenterFormData> & { id?: string };
  mode?: 'create' | 'edit';
}

function generateId() {
  return 'rank_' + Math.random().toString(36).slice(2, 9);
}

export function RankCenterBuilder({ initialData, mode = 'create' }: RankCenterBuilderProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [ranks, setRanks] = useState<RankEntry[]>(
    (initialData?.ranks as RankEntry[]) || [{
      id: generateId(),
      rank_id: 1,
      gamepass_id: 0,
      name: '',
      description: '',
      price: 0,
      is_for_sale: false,
      regional_pricing: false,
    }]
  );
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RankCenterFormData>({
    resolver: zodResolver(rankCenterSchema),
    defaultValues: {
      name: initialData?.name || '',
      group_id: initialData?.group_id || '',
      universe_id: initialData?.universe_id || '',
      ranks: ranks,
    },
  });

  const onSubmit = async (data: RankCenterFormData) => {
    setError(null);
    const payload = { ...data, ranks };

    try {
      const url = mode === 'edit' && initialData?.id
        ? `/api/rank-centers/${initialData.id}`
        : '/api/rank-centers';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to save rank center');
        return;
      }

      showToast(mode === 'edit' ? 'Rank center updated!' : 'Rank center created!', 'success');
      router.push('/rank-center');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/rank-center" className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white">{mode === 'edit' ? 'Edit Rank Center' : 'New Rank Center'}</h2>
          <p className="text-slate-400 text-sm">Configure ranks for your Roblox group</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <div className="space-y-4">
            <Input label="Rank Center Name" placeholder="e.g., Main Group Ranks" error={errors.name?.message} {...register('name')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Group ID" placeholder="Roblox Group ID" error={errors.group_id?.message} {...register('group_id')} />
              <Input label="Universe ID (optional)" placeholder="Game Universe ID" {...register('universe_id')} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ranks ({ranks.length})</CardTitle></CardHeader>
          <RankList ranks={ranks} onChange={setRanks} />
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/rank-center"><Button type="button" variant="secondary">Cancel</Button></Link>
          <Button type="submit" loading={isSubmitting}>
            <Save size={14} />
            {mode === 'edit' ? 'Save Changes' : 'Create Rank Center'}
          </Button>
        </div>
      </form>
    </div>
  );
}
