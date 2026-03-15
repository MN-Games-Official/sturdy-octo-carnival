'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApplicationBuilder } from '@/components/applications/ApplicationBuilder';
import { PageLoader } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';

export default function EditApplicationPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData({ ...result.application, id });
        } else {
          setError(result.error || 'Failed to load application');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return null;

  return <ApplicationBuilder initialData={data as Parameters<typeof ApplicationBuilder>[0]['initialData']} mode="edit" />;
}
