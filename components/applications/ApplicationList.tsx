'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/formatters';
import { useApplications } from '@/hooks/useApplications';
import { useToast } from '@/contexts/ToastContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { FileText, Edit, Trash2, Users, Plus, Search } from 'lucide-react';

export function ApplicationList() {
  const { applications, loading, error, deleteApplication } = useApplications();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = applications.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.group_id.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const ok = await deleteApplication(deleteId);
    if (ok) {
      showToast('Application deleted', 'success');
    } else {
      showToast('Failed to delete application', 'error');
    }
    setDeleteId(null);
    setDeleting(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (error) return <div className="text-red-400 text-sm">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
        </div>
        <Link href="/application-center/new">
          <Button>
            <Plus size={14} />
            New Application
          </Button>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <FileText size={40} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-slate-300 font-medium">No applications yet</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">Create your first application form to get started</p>
          <Link href="/application-center/new">
            <Button>
              <Plus size={14} />
              Create Application
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((app) => (
            <Card key={app.id} hover className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: app.primary_color + '20', border: `1px solid ${app.primary_color}40` }}>
                  <FileText size={18} style={{ color: app.primary_color }} />
                </div>
                <Badge variant="default">{app.group_id}</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{app.name}</h3>
                {app.description && <p className="text-slate-500 text-xs mt-1 line-clamp-2">{app.description}</p>}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users size={11} />{app.submission_count || 0} submissions</span>
                <span>Pass: {app.pass_score}%</span>
              </div>
              <div className="text-xs text-slate-600">Updated {formatDate(app.updated_at)}</div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                <Link href={`/application-center/${app.id}`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    <Edit size={12} />
                    Edit
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(app.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                  <Trash2 size={12} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Application" size="sm">
        <p className="text-slate-300 text-sm mb-6">Are you sure you want to delete this application? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
