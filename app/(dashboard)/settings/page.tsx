'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Shield, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Configure your Polaris Pilot preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-pink-400" />
            <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-800/40">
            <div>
              <p className="text-sm font-medium text-slate-200">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security</p>
            </div>
            <Badge variant="warning">Coming Soon</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-slate-200">Active Sessions</p>
              <p className="text-xs text-slate-500 mt-0.5">Manage your active login sessions</p>
            </div>
            <Badge variant="warning">Coming Soon</Badge>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-pink-400" />
            <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <p className="text-slate-500 text-sm">Notification preferences coming soon.</p>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-pink-400" />
            <CardTitle>Appearance</CardTitle>
          </div>
        </CardHeader>
        <p className="text-slate-500 text-sm">Theme customization coming soon. Currently using dark mode.</p>
      </Card>
    </div>
  );
}
