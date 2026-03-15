import { Metadata } from 'next';
import { ApplicationBuilder } from '@/components/applications/ApplicationBuilder';

export const metadata: Metadata = { title: 'New Application - Polaris Pilot' };

export default function NewApplicationPage() {
  return <ApplicationBuilder mode="create" />;
}
