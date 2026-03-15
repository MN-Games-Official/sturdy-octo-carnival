'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupInput } from '@/lib/validation';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export function SignupForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Signup failed');
        return;
      }

      setSuccess(true);
      showToast('Account created! Check your email to verify.', 'success');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-900/40 border border-green-800 flex items-center justify-center mx-auto">
          <span className="text-3xl">&#x2709;&#xFE0F;</span>
        </div>
        <h2 className="text-xl font-bold text-white">Check your email</h2>
        <p className="text-slate-400 text-sm">
          We&apos;ve sent a verification link to your email. Please verify your email to continue.
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
        <h2 className="text-2xl font-bold text-white">Create account</h2>
        <p className="text-slate-400 text-sm mt-1">Start managing your Roblox groups</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name (optional)"
          type="text"
          placeholder="Your Name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Username"
          type="text"
          placeholder="username123"
          error={errors.username?.message}
          helper="3-20 chars, letters, numbers, underscores"
          {...register('username')}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          helper="Min 8 chars with uppercase, number, and special char"
          {...register('password')}
        />

        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
