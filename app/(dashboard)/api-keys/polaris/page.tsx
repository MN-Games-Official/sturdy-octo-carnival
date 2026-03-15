'use client';

import React from 'react';
import { useApiKeys } from '@/hooks/useApiKeys';
import { PolarisKeyGenerator } from '@/components/api-keys/PolarisKeyGenerator';
import { ApiKeyDisplay } from '@/components/api-keys/ApiKeyDisplay';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';
import { Zap } from 'lucide-react';

export default function PolarisApiKeyPage() {
  const { apiKeys, refetch, revokeKey } = useApiKeys();
  const { showToast } = useToast();
  const polarisKeys = apiKeys.filter((k) => k.type === 'polaris');

  const handleRevoke = async (id: number) => {
    const ok = await revokeKey(id);
    if (ok) showToast('Key revoked', 'success');
    else showToast('Failed to revoke', 'error');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Polaris API Keys</h2>
        <p className="text-slate-400 text-sm mt-1">Generate keys for Polaris integrations</p>
      </div>

      <PolarisKeyGenerator onGenerated={refetch} />

      {polarisKeys.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-pink-400" />
              <CardTitle>Active Keys</CardTitle>
            </div>
          </CardHeader>
          <div className="space-y-2">
            {polarisKeys.map((k) => (
              <ApiKeyDisplay key={k.id} apiKey={k} onRevoke={handleRevoke} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
