'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RankCenterItem {
  id: string;
  name: string;
  group_id: string;
  universe_id?: string;
  created_at: string;
  updated_at: string;
  rank_count?: number;
}

export function useRankCenters() {
  const [rankCenters, setRankCenters] = useState<RankCenterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankCenters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/rank-centers');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch rank centers');
      setRankCenters(data.rank_centers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRankCenter = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/rank-centers/${id}`, { method: 'DELETE' });
      if (!response.ok) return false;
      setRankCenters((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchRankCenters();
  }, [fetchRankCenters]);

  return { rankCenters, loading, error, refetch: fetchRankCenters, deleteRankCenter };
}
