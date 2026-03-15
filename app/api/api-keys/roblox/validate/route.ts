import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { RobloxService } from '@/lib/roblox-service';

function getUser(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: NextRequest) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { api_key } = body;

    if (!api_key) {
      return NextResponse.json({ success: false, error: 'API key is required' }, { status: 400 });
    }

    const service = new RobloxService(api_key);
    const isValid = await service.validateApiKey();

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 400 });
    }

    const preview = api_key.slice(0, 12) + '...' + api_key.slice(-4);
    return NextResponse.json({ success: true, message: 'API key is valid', preview });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Validation failed' }, { status: 500 });
  }
}
