import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateApplicationForm } from '@/lib/ai-service';

function getUser(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, description, group_id, rank, questions_count = 6, vibe = 'professional', primary_color, secondary_color, instructions } = body;

    if (!name || !group_id) {
      return NextResponse.json({ success: false, error: 'Name and group_id are required' }, { status: 400 });
    }

    const form = await generateApplicationForm({
      name, description: description || '', group_id, rank: rank || '1',
      questions_count, vibe, primary_color: primary_color || '#ff4b6e',
      secondary_color: secondary_color || '#1f2933', instructions,
    });

    return NextResponse.json({ success: true, form });
  } catch (error) {
    console.error('Generate form error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate form' }, { status: 500 });
  }
}
