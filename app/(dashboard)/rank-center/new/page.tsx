import { Metadata } from 'next';
import { RankCenterBuilder } from '@/components/rank-center/RankCenterBuilder';

export const metadata: Metadata = { title: 'New Rank Center - Polaris Pilot' };

export default function NewRankCenterPage() {
  return <RankCenterBuilder mode="create" />;
}
