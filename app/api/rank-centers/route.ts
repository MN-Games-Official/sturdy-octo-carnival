import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { rankCenterSchema } from '@/lib/validation';

function getUser(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const rankCenters = await prisma.rankCenter.findMany({
      where: { user_id: user.userId },
      orderBy: { updated_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      rank_centers: rankCenters.map((rc) => {
        const ranks = JSON.parse(rc.ranks_json);
        return {
          id: rc.id,
          name: rc.name,
          group_id: rc.group_id,
          universe_id: rc.universe_id,
          created_at: rc.created_at,
          updated_at: rc.updated_at,
          rank_count: Array.isArray(ranks) ? ranks.length : 0,
        };
      }),
    });
  } catch (error) {
    console.error('Get rank centers error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const result = rankCenterSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, group_id, universe_id, ranks } = result.data;

    const rankCenter = await prisma.rankCenter.create({
      data: {
        user_id: user.userId,
        name, group_id, universe_id,
        ranks_json: JSON.stringify(ranks),
      },
    });

    return NextResponse.json({ success: true, rank_center: rankCenter }, { status: 201 });
  } catch (error) {
    console.error('Create rank center error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
