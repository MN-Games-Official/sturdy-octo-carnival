'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { z } from 'zod';

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    try {
      const response = await fetch('/api/password/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to send reset email');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-900/40 border border-blue-800 flex items-center justify-center mx-auto">
          <span className="text-3xl">&#x1F4E7;</span>
        </div>
        <h2 className="text-xl font-bold text-white">Reset link sent</h2>
        <p className="text-slate-400 text-sm">
          If an account with that email exists, we&apos;ve sent a reset link. Check your inbox.
        </p>
        <Link href="/login" className="inline-block text-pink-400 hover:text-pink-300 text-sm transition-colors">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Forgot password</h2>
        <p className="text-slate-400 text-sm mt-1">Enter your email to receive a reset link</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Remember your password?{' '}
        <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
