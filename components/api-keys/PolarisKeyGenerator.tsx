'use client';

import React, { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Zap, Copy, CheckCircle } from 'lucide-react';

interface PolarisKeyGeneratorProps {
  onGenerated: () => void;
}

export function PolarisKeyGenerator({ onGenerated }: PolarisKeyGeneratorProps) {
  const { showToast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setNewKey(null);

    try {
      const response = await fetch('/api/api-keys/polaris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to generate key');
        return;
      }
      setNewKey(result.api_key);
      showToast('API key generated! Copy it now.', 'success');
      onGenerated();
    } catch {
      setError('Failed to generate key');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Key copied to clipboard!', 'success');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-pink-400" />
          <CardTitle>Generate Polaris API Key</CardTitle>
        </div>
      </CardHeader>
      <p className="text-slate-400 text-sm mb-4">
        Generate a new API key for integrating with Polaris Pilot services.
      </p>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

      {newKey && (
        <Alert type="warning" message="Copy this key now! You won't be able to see it again after closing this page." className="mb-4" />
      )}

      {newKey ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input value={newKey} readOnly className="font-mono text-xs" />
            <Button variant="outline" onClick={handleCopy} className="shrink-0">
              {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <Button variant="secondary" onClick={() => setNewKey(null)} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <Button onClick={handleGenerate} loading={generating} className="w-full">
          <Zap size={14} />
          Generate New Key
        </Button>
      )}
    </Card>
  );
}
