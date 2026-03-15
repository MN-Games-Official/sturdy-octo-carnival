'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setMessage('Email verified successfully! You can now log in.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error. Please try again.');
      });
  }, [token]);

  return (
    <div className="text-center space-y-6">
      {status === 'loading' && (
        <>
          <Spinner size="lg" className="mx-auto" />
          <p className="text-slate-400">Verifying your email...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 rounded-full bg-green-900/40 border border-green-800 flex items-center justify-center mx-auto">
            <span className="text-3xl">&#x2705;</span>
          </div>
          <h2 className="text-xl font-bold text-white">Email Verified!</h2>
          <Alert type="success" message={message} />
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg font-medium hover:from-pink-500 hover:to-rose-400 transition-all"
          >
            Go to Login
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 rounded-full bg-red-900/40 border border-red-800 flex items-center justify-center mx-auto">
            <span className="text-3xl">&#x274C;</span>
          </div>
          <h2 className="text-xl font-bold text-white">Verification Failed</h2>
          <Alert type="error" message={message} />
          <div className="space-y-2">
            <Link href="/login" className="block text-pink-400 hover:text-pink-300 text-sm transition-colors">
              Back to Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
