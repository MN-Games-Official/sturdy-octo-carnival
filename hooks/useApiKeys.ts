'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ApiKeyItem {
  id: number;
  type: string;
  key_prefix: string;
  last_used?: string;
  created_at: string;
  is_active: boolean;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [robloxRes, polarisRes] = await Promise.all([
        fetch('/api/api-keys/roblox'),
        fetch('/api/api-keys/polaris'),
      ]);
      const robloxData = await robloxRes.json();
      const polarisData = await polarisRes.json();
      const all = [
        ...(robloxData.keys || []),
        ...(polarisData.keys || []),
      ];
      setApiKeys(all);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeKey = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/api-keys/polaris/${id}/revoke`, { method: 'POST' });
      if (!response.ok) return false;
      setApiKeys((prev) => prev.map((k) => k.id === id ? { ...k, is_active: false } : k));
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return { apiKeys, loading, error, refetch: fetchApiKeys, revokeKey };
}
