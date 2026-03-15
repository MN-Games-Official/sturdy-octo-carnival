import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = { title: 'Sign Up - Polaris Pilot' };

export default function SignupPage() {
  return <SignupForm />;
}
