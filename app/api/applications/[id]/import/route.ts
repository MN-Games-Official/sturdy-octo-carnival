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
    const body = await request.json();
    const { questions, mode = 'replace' } = body;

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ success: false, error: 'Questions array required' }, { status: 400 });
    }

    const application = await prisma.application.findFirst({
      where: { id: params.id, user_id: user.userId },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    let finalQuestions = questions;
    if (mode === 'merge') {
      const existing = JSON.parse(application.questions_json);
      finalQuestions = [...existing, ...questions];
    }

    const shortAnswerCount = finalQuestions.filter((q: { type: string }) => q.type === 'short_answer').length;
    if (shortAnswerCount > 3) {
      return NextResponse.json(
        { success: false, error: 'Maximum 3 short answer questions allowed' },
        { status: 400 }
      );
    }

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: { questions_json: JSON.stringify(finalQuestions) },
    });

    return NextResponse.json({
      success: true,
      application: { ...updated, questions: finalQuestions },
    });
  } catch (error) {
    console.error('Import questions error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
