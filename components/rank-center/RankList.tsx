'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Trash2, Plus, GripVertical } from 'lucide-react';

export interface RankEntry {
  id: string;
  rank_id: number;
  gamepass_id: number;
  name: string;
  description?: string;
  price: number;
  is_for_sale: boolean;
  regional_pricing: boolean;
}

interface RankListProps {
  ranks: RankEntry[];
  onChange: (ranks: RankEntry[]) => void;
}

function generateId() {
  return 'rank_' + Math.random().toString(36).slice(2, 9);
}

export function RankList({ ranks, onChange }: RankListProps) {
  const addRank = () => {
    onChange([...ranks, {
      id: generateId(),
      rank_id: 0,
      gamepass_id: 0,
      name: '',
      description: '',
      price: 0,
      is_for_sale: false,
      regional_pricing: false,
    }]);
  };

  const updateRank = (id: string, updates: Partial<RankEntry>) => {
    onChange(ranks.map((r) => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRank = (id: string) => {
    onChange(ranks.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-3">
      {ranks.map((rank, i) => (
        <div key={rank.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical size={14} className="text-slate-600" />
              <Badge variant="pink">Rank {i + 1}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rank.is_for_sale}
                  onChange={(e) => updateRank(rank.id, { is_for_sale: e.target.checked })}
                  className="accent-pink-500"
                />
                For Sale
              </label>
              {ranks.length > 1 && (
                <button onClick={() => deleteRank(rank.id)} className="p-1 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Rank Name"
              placeholder="e.g., Moderator"
              value={rank.name}
              onChange={(e) => updateRank(rank.id, { name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Rank ID"
                type="number"
                value={rank.rank_id}
                onChange={(e) => updateRank(rank.id, { rank_id: parseInt(e.target.value) || 0 })}
                min={0}
                max={255}
              />
              <Input
                label="Gamepass ID"
                type="number"
                value={rank.gamepass_id}
                onChange={(e) => updateRank(rank.id, { gamepass_id: parseInt(e.target.value) || 0 })}
                min={0}
              />
            </div>
          </div>
          {rank.is_for_sale && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Price (Robux)"
                type="number"
                value={rank.price}
                onChange={(e) => updateRank(rank.id, { price: parseInt(e.target.value) || 0 })}
                min={0}
              />
              <label className="flex items-center gap-2 text-sm text-slate-300 pt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rank.regional_pricing}
                  onChange={(e) => updateRank(rank.id, { regional_pricing: e.target.checked })}
                  className="accent-pink-500"
                />
                Regional pricing
              </label>
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addRank} className="w-full">
        <Plus size={14} />
        Add Rank
      </Button>
    </div>
  );
}
