import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { applicationSchema } from '@/lib/validation';

function getUser(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const application = await prisma.application.findFirst({
      where: { id: params.id, user_id: user.userId },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      application: {
        ...application,
        questions: JSON.parse(application.questions_json),
        style: application.style_json ? JSON.parse(application.style_json) : null,
      },
    });
  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const result = applicationSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findFirst({
      where: { id: params.id, user_id: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    const { name, description, group_id, target_role, pass_score, primary_color, secondary_color, questions } = result.data;

    const shortAnswerCount = questions.filter((q) => q.type === 'short_answer').length;
    if (shortAnswerCount > 3) {
      return NextResponse.json(
        { success: false, error: 'Maximum 3 short answer questions allowed' },
        { status: 400 }
      );
    }

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: {
        name, description, group_id, target_role, pass_score,
        primary_color: primary_color || '#ff4b6e',
        secondary_color: secondary_color || '#1f2933',
        questions_json: JSON.stringify(questions),
        style_json: JSON.stringify({ primary_color, secondary_color }),
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.application.findFirst({
      where: { id: params.id, user_id: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    await prisma.application.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
