'use client';

import { useState, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchReturn<T> extends FetchState<T> {
  execute: (url: string, options?: RequestInit) => Promise<T | null>;
  reset: () => void;
}

export function useFetch<T = unknown>(): UseFetchReturn<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (url: string, options?: RequestInit): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        ...options,
      });
      const data = await response.json();
      if (!response.ok) {
        setState({ data: null, loading: false, error: data.error || 'Request failed' });
        return null;
      }
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error';
      setState({ data: null, loading: false, error: message });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
