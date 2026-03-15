'use client';

import React from 'react';
import Link from 'next/link';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useToast } from '@/contexts/ToastContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Loading';
import { ApiKeyDisplay } from '@/components/api-keys/ApiKeyDisplay';
import { Shield, Zap, Plus } from 'lucide-react';

export default function ApiKeysPage() {
  const { apiKeys, loading, revokeKey } = useApiKeys();
  const { showToast } = useToast();

  const handleRevoke = async (id: number) => {
    const ok = await revokeKey(id);
    if (ok) showToast('API key revoked', 'success');
    else showToast('Failed to revoke key', 'error');
  };

  const robloxKeys = apiKeys.filter((k) => k.type === 'roblox');
  const polarisKeys = apiKeys.filter((k) => k.type === 'polaris');

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">API Keys</h2>
        <p className="text-slate-400 text-sm mt-1">Manage all your API keys</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-blue-400" />
              <CardTitle>Roblox API Keys</CardTitle>
            </div>
            <Link href="/api-keys/roblox"><Button size="sm" variant="outline"><Plus size={12} />Add Key</Button></Link>
          </div>
        </CardHeader>
        {robloxKeys.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">No Roblox API keys configured</p>
        ) : (
          <div className="space-y-2">
            {robloxKeys.map((k) => (
              <ApiKeyDisplay key={k.id} apiKey={k} onRevoke={handleRevoke} />
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-pink-400" />
              <CardTitle>Polaris API Keys</CardTitle>
            </div>
            <Link href="/api-keys/polaris"><Button size="sm" variant="outline"><Plus size={12} />Generate</Button></Link>
          </div>
        </CardHeader>
        {polarisKeys.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">No Polaris API keys generated</p>
        ) : (
          <div className="space-y-2">
            {polarisKeys.map((k) => (
              <ApiKeyDisplay key={k.id} apiKey={k} onRevoke={handleRevoke} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
