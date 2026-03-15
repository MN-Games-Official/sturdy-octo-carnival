import { Metadata } from 'next';
import { ApplicationList } from '@/components/applications/ApplicationList';

export const metadata: Metadata = { title: 'Application Center - Polaris Pilot' };

export default function ApplicationCenterPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white">Application Center</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your Roblox group application forms</p>
      </div>
      <ApplicationList />
    </div>
  );
}
