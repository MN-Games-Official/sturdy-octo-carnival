import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken, comparePassword, hashPassword } from '@/lib/auth';
import { changePasswordSchema } from '@/lib/validation';

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
    const result = changePasswordSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { current_password, new_password } = result.data;

    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const valid = await comparePassword(current_password, dbUser.password_hash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    const password_hash = await hashPassword(new_password);
    await prisma.user.update({ where: { id: user.userId }, data: { password_hash } });

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
