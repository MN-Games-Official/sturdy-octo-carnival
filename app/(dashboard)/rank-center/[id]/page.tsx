'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RankCenterBuilder } from '@/components/rank-center/RankCenterBuilder';
import { PageLoader } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';

export default function EditRankCenterPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/rank-centers/${id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData({ ...result.rank_center, id });
        } else {
          setError(result.error || 'Failed to load rank center');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return null;

  return <RankCenterBuilder initialData={data as Parameters<typeof RankCenterBuilder>[0]['initialData']} mode="edit" />;
}
