import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { encrypt } from '@/lib/encryption';

function getUser(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const keys = await prisma.apiKey.findMany({
      where: { user_id: user.userId, type: 'polaris' },
      select: { id: true, type: true, key_prefix: true, last_used: true, created_at: true, is_active: true },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ success: true, keys });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const rawKey = 'polaris_' + crypto.randomBytes(24).toString('hex');
    const encrypted_key = encrypt(rawKey);
    const key_prefix = rawKey.slice(0, 16) + '...';

    const apiKey = await prisma.apiKey.create({
      data: {
        user_id: user.userId,
        type: 'polaris',
        encrypted_key,
        key_prefix,
        is_active: true,
      },
    });

    return NextResponse.json({
      success: true,
      api_key: rawKey,
      message: "Copy this key now. You won't be able to see it again.",
      preview: key_prefix,
      key_id: apiKey.id,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
