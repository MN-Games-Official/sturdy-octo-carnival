import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { signupSchema } from '@/lib/validation';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received signup request body:', body);
    console.log('Body keys:', Object.keys(body));
    console.log('Body values:', Object.entries(body).map(([k, v]) => `${k}: ${typeof v} = ${v}`));
    
    const result = signupSchema.safeParse(body);
    
    if (!result.success) {
      console.log('Validation failed:', result.error.issues);
      const issue = result.error.issues[0];
      const fieldName = issue.path.join('.');
      const message = `${fieldName || 'Validation'}: ${issue.message}`;
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 }
      );
    }

    const { email, username, password, full_name } = result.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      const field = existing.email === email ? 'Email' : 'Username';
      return NextResponse.json(
        { success: false, error: `${field} already in use` },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, username, password_hash, full_name },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 6 * 60 * 60 * 1000);

    await prisma.emailVerification.upsert({
      where: { user_id: user.id },
      update: { token, expires_at, used: false },
      create: { user_id: user.id, token, expires_at },
    });

    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created. Please verify your email.',
        user: { id: user.id, email: user.email, username: user.username },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
