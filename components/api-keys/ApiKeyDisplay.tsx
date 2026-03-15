'use client';

import React from 'react';
import { formatDate, maskApiKey } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trash2, Clock } from 'lucide-react';
import type { ApiKeyItem } from '@/hooks/useApiKeys';

interface ApiKeyDisplayProps {
  apiKey: ApiKeyItem;
  onRevoke?: (id: number) => void;
}

export function ApiKeyDisplay({ apiKey, onRevoke }: ApiKeyDisplayProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/40 gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-slate-300">
          {maskApiKey(apiKey.key_prefix)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant={apiKey.is_active ? 'success' : 'danger'} size="sm">
              {apiKey.is_active ? 'Active' : 'Revoked'}
            </Badge>
            <Badge variant={apiKey.type === 'roblox' ? 'info' : 'pink'} size="sm">
              {apiKey.type}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>Created {formatDate(apiKey.created_at)}</span>
            {apiKey.last_used && (
              <span className="flex items-center gap-1">
                <Clock size={10} />
                Last used {formatDate(apiKey.last_used)}
              </span>
            )}
          </div>
        </div>
      </div>
      {apiKey.is_active && onRevoke && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRevoke(apiKey.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 shrink-0"
        >
          <Trash2 size={14} />
          Revoke
        </Button>
      )}
    </div>
  );
}
