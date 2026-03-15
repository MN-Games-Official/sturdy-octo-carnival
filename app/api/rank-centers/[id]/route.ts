import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { rankCenterSchema } from '@/lib/validation';

function getUser(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const rc = await prisma.rankCenter.findFirst({
      where: { id: params.id, user_id: user.userId },
    });

    if (!rc) return NextResponse.json({ success: false, error: 'Rank center not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      rank_center: { ...rc, ranks: JSON.parse(rc.ranks_json) },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const existing = await prisma.rankCenter.findFirst({
      where: { id: params.id, user_id: user.userId },
    });
    if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const { name, group_id, universe_id, ranks } = result.data;
    const updated = await prisma.rankCenter.update({
      where: { id: params.id },
      data: { name, group_id, universe_id, ranks_json: JSON.stringify(ranks) },
    });

    return NextResponse.json({ success: true, rank_center: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.rankCenter.findFirst({
      where: { id: params.id, user_id: user.userId },
    });
    if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    await prisma.rankCenter.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Rank center deleted' });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
