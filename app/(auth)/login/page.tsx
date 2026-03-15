import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'Login - Polaris Pilot' };

export default function LoginPage() {
  return <LoginForm />;
}
