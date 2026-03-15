'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRankCenters } from '@/hooks/useRankCenters';
import { useToast } from '@/contexts/ToastContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { Award, Edit, Trash2, Plus } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

export default function RankCenterPage() {
  const { rankCenters, loading, deleteRankCenter } = useRankCenters();
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const ok = await deleteRankCenter(deleteId);
    if (ok) showToast('Rank center deleted', 'success');
    else showToast('Failed to delete', 'error');
    setDeleteId(null);
    setDeleting(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Rank Center</h2>
          <p className="text-slate-400 text-sm mt-1">Manage Roblox group rank configurations</p>
        </div>
        <Link href="/rank-center/new"><Button><Plus size={14} />New Rank Center</Button></Link>
      </div>

      {rankCenters.length === 0 ? (
        <Card className="text-center py-16">
          <Award size={40} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-slate-300 font-medium">No rank centers yet</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">Configure ranks for your Roblox groups</p>
          <Link href="/rank-center/new"><Button><Plus size={14} />Create Rank Center</Button></Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rankCenters.map((rc) => (
            <Card key={rc.id} hover className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <Award size={18} className="text-pink-400" />
                </div>
                <Badge variant="default">{rc.group_id}</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{rc.name}</h3>
                {rc.universe_id && <p className="text-slate-500 text-xs mt-0.5">Universe: {rc.universe_id}</p>}
              </div>
              <div className="text-xs text-slate-500">{rc.rank_count || 0} ranks configured</div>
              <div className="text-xs text-slate-600">Updated {formatDate(rc.updated_at)}</div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                <Link href={`/rank-center/${rc.id}`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full"><Edit size={12} />Edit</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(rc.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                  <Trash2 size={12} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Rank Center" size="sm">
        <p className="text-slate-300 text-sm mb-6">Are you sure? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
