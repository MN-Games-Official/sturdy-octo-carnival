'use client';

import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  description?: string;
  className?: string;
}

export function StatsCard({ title, value, icon, change, description, className }: StatsCardProps) {
  return (
    <Card hover className={clsx('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          {change !== undefined && (
            <div className={clsx('flex items-center gap-1 mt-2 text-xs font-medium', change >= 0 ? 'text-green-400' : 'text-red-400')}>
              {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(change)}% from last month
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
          {icon}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-pink-600/5 to-transparent rounded-tl-full" />
    </Card>
  );
}
