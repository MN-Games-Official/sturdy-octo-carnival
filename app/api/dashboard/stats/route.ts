import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function getUser(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const [applications, rankCenters, apiKeys, submissions] = await Promise.all([
      prisma.application.count({ where: { user_id: user.userId } }),
      prisma.rankCenter.count({ where: { user_id: user.userId } }),
      prisma.apiKey.count({ where: { user_id: user.userId, is_active: true } }),
      prisma.applicationSubmission.findMany({
        where: {
          application: { user_id: user.userId },
        },
        select: { passed: true },
      }),
    ]);

    const total_submissions = submissions.length;
    const passed = submissions.filter((s) => s.passed).length;
    const pass_rate = total_submissions > 0 ? Math.round((passed / total_submissions) * 100) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        total_applications: applications,
        total_rank_centers: rankCenters,
        total_submissions,
        total_api_keys: apiKeys,
        pass_rate,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
