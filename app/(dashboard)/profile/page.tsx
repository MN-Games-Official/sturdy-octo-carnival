'use client';

import React from 'react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { PasswordChangeForm } from '@/components/profile/PasswordChangeForm';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Profile info card */}
      <Card className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{user?.full_name || user?.username}</h3>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={user?.email_verified ? 'success' : 'warning'}>
              {user?.email_verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        </div>
      </Card>

      <ProfileForm />
      <PasswordChangeForm />
    </div>
  );
}
