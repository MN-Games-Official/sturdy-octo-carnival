'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema, ProfileUpdateInput } from '@/lib/validation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { User } from 'lucide-react';

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      avatar_url: user?.avatar_url || '',
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    setError(null);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to update profile');
        return;
      }

      updateUser(result.user);
      showToast('Profile updated successfully!', 'success');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User size={16} className="text-pink-400" />
          <CardTitle>Edit Profile</CardTitle>
        </div>
      </CardHeader>

      {error && <Alert type="error" message={error} className="mb-4" onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Your full name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Username"
          type="text"
          value={user?.username || ''}
          disabled
          helper="Username cannot be changed"
        />
        <Input
          label="Email address"
          type="email"
          value={user?.email || ''}
          disabled
          helper="Email cannot be changed here"
        />
        <Input
          label="Avatar URL (optional)"
          type="url"
          placeholder="https://..."
          error={errors.avatar_url?.message}
          {...register('avatar_url')}
        />

        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Save changes
        </Button>
      </form>
    </Card>
  );
}
