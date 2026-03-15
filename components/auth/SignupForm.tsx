'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export function SignupForm() {
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    } finally {
      setIsLoading(false);
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

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          name="full_name"
          label="Full name (optional)"
          type="text"
          placeholder="Your Name"
          value={formData.full_name}
          onChange={handleChange}
        />
        <Input
          name="username"
          label="Username"
          type="text"
          placeholder="username123"
          helper="3-20 chars, letters, numbers, underscores"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          helper="Min 8 chars with uppercase, number, and special char"
          value={formData.password}
          onChange={handleChange}
        />

        <Button type="submit" loading={isLoading} className="w-full" size="lg">
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
