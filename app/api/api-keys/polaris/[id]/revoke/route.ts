import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function getUser(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const keyId = parseInt(params.id);
    if (isNaN(keyId)) {
      return NextResponse.json({ success: false, error: 'Invalid key ID' }, { status: 400 });
    }

    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, user_id: user.userId, type: 'polaris' },
    });

    if (!key) {
      return NextResponse.json({ success: false, error: 'API key not found' }, { status: 404 });
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { is_active: false },
    });

    return NextResponse.json({ success: true, message: 'API key revoked' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
