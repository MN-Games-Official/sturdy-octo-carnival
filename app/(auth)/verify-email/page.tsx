import { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyEmailContent } from '@/components/auth/VerifyEmailContent';

export const metadata: Metadata = { title: 'Verify Email - Polaris Pilot' };

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400">Verifying...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
