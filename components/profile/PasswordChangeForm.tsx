'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '@/lib/validation';
import { useToast } from '@/contexts/ToastContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Lock } from 'lucide-react';
import { z } from 'zod';

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export function PasswordChangeForm() {
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setError(null);
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to change password');
        return;
      }

      reset();
      showToast('Password changed successfully!', 'success');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-pink-400" />
          <CardTitle>Change Password</CardTitle>
        </div>
      </CardHeader>

      {error && <Alert type="error" message={error} className="mb-4" onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Current password"
          type="password"
          placeholder="••••••••"
          error={errors.current_password?.message}
          {...register('current_password')}
        />
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          error={errors.new_password?.message}
          {...register('new_password')}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        <Button type="submit" loading={isSubmitting}>
          Change password
        </Button>
      </form>
    </Card>
  );
}
