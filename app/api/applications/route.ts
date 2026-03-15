import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { applicationSchema } from '@/lib/validation';

function getUser(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const user = getUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const applications = await prisma.application.findMany({
      where: { user_id: user.userId },
      orderBy: { updated_at: 'desc' },
      include: {
        _count: { select: { submissions: true } },
        submissions: {
          select: { passed: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      applications: applications.map((app) => ({
        id: app.id,
        name: app.name,
        description: app.description,
        group_id: app.group_id,
        target_role: app.target_role,
        pass_score: app.pass_score,
        primary_color: app.primary_color,
        secondary_color: app.secondary_color,
        created_at: app.created_at,
        updated_at: app.updated_at,
        submission_count: app._count.submissions,
        pass_count: app.submissions.filter((s) => s.passed).length,
      })),
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const { name, description, group_id, target_role, pass_score, primary_color, secondary_color, questions } = result.data;

    const shortAnswerCount = questions.filter((q) => q.type === 'short_answer').length;
    if (shortAnswerCount > 3) {
      return NextResponse.json(
        { success: false, error: 'Maximum 3 short answer questions allowed' },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        user_id: user.userId,
        name,
        description,
        group_id,
        target_role,
        pass_score,
        primary_color: primary_color || '#ff4b6e',
        secondary_color: secondary_color || '#1f2933',
        questions_json: JSON.stringify(questions),
        style_json: JSON.stringify({ primary_color, secondary_color }),
      },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
