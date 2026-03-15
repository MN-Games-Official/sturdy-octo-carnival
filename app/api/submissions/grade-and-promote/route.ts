import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { decrypt } from '@/lib/encryption';
import { RobloxService } from '@/lib/roblox-service';
import { batchGradeShortAnswers } from '@/lib/ai-service';

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
    const { application_id, roblox_user_id, answers } = body;

    if (!application_id || !roblox_user_id || !answers) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const application = await prisma.application.findFirst({
      where: { id: application_id, user_id: user.userId },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    const questions = JSON.parse(application.questions_json);
    let total_score = 0;
    let max_score = 0;
    const shortAnswers: Array<{ question: string; answer: string; criteria: string; max_score: number }> = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      max_score += q.max_score;
      const answer = answers[q.id];

      if (q.type === 'multiple_choice') {
        if (answer === q.correct_answer || answer == q.correct_answer) {
          total_score += q.max_score;
        }
      } else if (q.type === 'true_false') {
        if (String(answer) === String(q.correct_answer)) {
          total_score += q.max_score;
        }
      } else if (q.type === 'short_answer') {
        shortAnswers.push({
          question: q.text,
          answer: String(answer || ''),
          criteria: q.grading_criteria || '',
          max_score: q.max_score,
        });
      }
    }

    if (shortAnswers.length > 0) {
      const grades = await batchGradeShortAnswers(shortAnswers);
      for (const grade of grades) {
        total_score += grade.score;
      }
    }

    const score_percentage = max_score > 0 ? (total_score / max_score) * 100 : 0;
    const passed = score_percentage >= application.pass_score;

    let promotion_status = 'pending';
    let membership_id: string | null = null;

    if (passed) {
      try {
        const robloxKeyRecord = await prisma.apiKey.findFirst({
          where: { user_id: user.userId, type: 'roblox', is_active: true },
        });

        if (robloxKeyRecord) {
          const apiKey = decrypt(robloxKeyRecord.encrypted_key);
          const robloxService = new RobloxService(apiKey);

          const membership = await robloxService.getMembership(application.group_id, roblox_user_id);
          if (membership) {
            membership_id = membership.path.split('/').pop() || null;
            const rolesMap = await robloxService.getRolesMap(application.group_id);
            const rankNum = parseInt(application.target_role.replace(/\D/g, ''));
            const roleId = rolesMap[rankNum];

            if (roleId && membership_id) {
              await robloxService.promoteUser(application.group_id, membership_id, String(roleId));
              promotion_status = 'success';
            }
          }
        }
      } catch (promoteError) {
        console.error('Promotion failed:', promoteError);
        promotion_status = 'failed';
      }
    }

    const submission = await prisma.applicationSubmission.create({
      data: {
        application_id,
        roblox_user_id,
        membership_id,
        answers_json: JSON.stringify(answers),
        score: total_score,
        max_score,
        passed,
        promotion_status,
      },
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        score: total_score,
        max_score,
        score_percentage: Math.round(score_percentage),
        passed,
        promotion_status,
      },
    });
  } catch (error) {
    console.error('Grade and promote error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
