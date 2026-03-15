'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Award, Key, Plus, Zap } from 'lucide-react';

const actions = [
  { label: 'New Application', href: '/application-center/new', icon: FileText, description: 'Build an application form' },
  { label: 'New Rank Center', href: '/rank-center/new', icon: Award, description: 'Configure group ranks' },
  { label: 'Add API Key', href: '/api-keys', icon: Key, description: 'Manage your API keys' },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-pink-400" />
          <CardTitle>Quick Actions</CardTitle>
        </div>
      </CardHeader>
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-800/60 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-pink-500/10 transition-colors">
                <Icon size={16} className="text-slate-400 group-hover:text-pink-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{action.label}</p>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
              <Plus size={14} className="ml-auto text-slate-600 group-hover:text-pink-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
