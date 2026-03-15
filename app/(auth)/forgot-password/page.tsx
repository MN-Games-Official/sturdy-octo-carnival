import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = { title: 'Forgot Password - Polaris Pilot' };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
