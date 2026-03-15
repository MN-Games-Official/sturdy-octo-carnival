'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/formatters';
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'submission' | 'promotion' | 'application' | 'rank_center';
  message: string;
  timestamp: string;
  status?: 'success' | 'failed' | 'pending';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-pink-400" />
          <CardTitle>Recent Activity</CardTitle>
        </div>
      </CardHeader>
      {activities.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {activities.map((item) => (
            <div key={item.id} className="flex items-start gap-3 py-2 border-b border-slate-800/40 last:border-0">
              <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300">{item.message}</p>
                <p className="text-xs text-slate-600 mt-0.5">{formatRelativeTime(item.timestamp)}</p>
              </div>
              {item.status && (
                <Badge
                  variant={
                    item.status === 'success' ? 'success' :
                    item.status === 'failed' ? 'danger' : 'warning'
                  }
                >
                  {item.status}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
