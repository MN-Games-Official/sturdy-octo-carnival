'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Award, Users, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  total_applications: number;
  total_rank_centers: number;
  total_submissions: number;
  total_api_keys: number;
  pass_rate: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome back, <span className="text-pink-400">{user?.username || 'User'}</span>!
        </h2>
        <p className="text-slate-400 text-sm mt-1">Here&apos;s what&apos;s happening with your groups.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Applications"
          value={loading ? '...' : stats?.total_applications ?? 0}
          icon={<FileText size={20} />}
          description="Total application forms"
        />
        <StatsCard
          title="Rank Centers"
          value={loading ? '...' : stats?.total_rank_centers ?? 0}
          icon={<Award size={20} />}
          description="Rank configurations"
        />
        <StatsCard
          title="Submissions"
          value={loading ? '...' : stats?.total_submissions ?? 0}
          icon={<Users size={20} />}
          description="Total form submissions"
        />
        <StatsCard
          title="Pass Rate"
          value={loading ? '...' : `${stats?.pass_rate ?? 0}%`}
          icon={<TrendingUp size={20} />}
          description="Overall pass rate"
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed activities={[]} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
