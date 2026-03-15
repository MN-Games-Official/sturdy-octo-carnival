import { NextRequest, NextResponse } from 'next/server';
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
      where: { user_id: user.userId, type: 'roblox' },
      select: { id: true, type: true, key_prefix: true, last_used: true, created_at: true, is_active: true },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ success: true, keys });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { api_key } = body;

    if (!api_key || typeof api_key !== 'string') {
      return NextResponse.json({ success: false, error: 'API key is required' }, { status: 400 });
    }

    const encrypted_key = encrypt(api_key);
    const key_prefix = api_key.slice(0, 12) + '...' + api_key.slice(-4);

    await prisma.apiKey.updateMany({
      where: { user_id: user.userId, type: 'roblox' },
      data: { is_active: false },
    });

    const apiKey = await prisma.apiKey.create({
      data: {
        user_id: user.userId,
        type: 'roblox',
        encrypted_key,
        key_prefix,
        is_active: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Roblox API key saved',
      key: { id: apiKey.id, key_prefix: apiKey.key_prefix, is_active: apiKey.is_active },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.apiKey.deleteMany({
      where: { user_id: user.userId, type: 'roblox' },
    });
    return NextResponse.json({ success: true, message: 'Roblox API key deleted' });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
