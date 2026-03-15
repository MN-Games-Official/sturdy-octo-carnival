'use client';

import React from 'react';
import { useApiKeys } from '@/hooks/useApiKeys';
import { RobloxKeyUpload } from '@/components/api-keys/RobloxKeyUpload';
import { ApiKeyDisplay } from '@/components/api-keys/ApiKeyDisplay';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';
import { Shield } from 'lucide-react';

export default function RobloxApiKeyPage() {
  const { apiKeys, refetch, revokeKey } = useApiKeys();
  const { showToast } = useToast();
  const robloxKeys = apiKeys.filter((k) => k.type === 'roblox');

  const handleRevoke = async (id: number) => {
    const ok = await revokeKey(id);
    if (ok) showToast('Key revoked', 'success');
    else showToast('Failed to revoke', 'error');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Roblox API Keys</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your Roblox Open Cloud API keys</p>
      </div>

      <RobloxKeyUpload onSaved={refetch} />

      {robloxKeys.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-blue-400" />
              <CardTitle>Saved Keys</CardTitle>
            </div>
          </CardHeader>
          <div className="space-y-2">
            {robloxKeys.map((k) => (
              <ApiKeyDisplay key={k.id} apiKey={k} onRevoke={handleRevoke} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
