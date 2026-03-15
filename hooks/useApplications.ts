'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ApplicationItem {
  id: string;
  name: string;
  description?: string;
  group_id: string;
  target_role: string;
  pass_score: number;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
  submission_count?: number;
  pass_count?: number;
}

export function useApplications() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch applications');
      setApplications(data.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteApplication = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      if (!response.ok) return false;
      setApplications((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, loading, error, refetch: fetchApplications, deleteApplication };
}
