import { z } from 'zod';

export const signupSchema = z.object({
  email: z
    .string({ invalid_type_error: 'Email must be a string' })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  username: z
    .string({ invalid_type_error: 'Username must be a string' })
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string({ invalid_type_error: 'Password must be a string' })
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  full_name: z
    .string({ invalid_type_error: 'Full name must be a string' })
    .max(100, 'Full name must be at most 100 characters')
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirm_password: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirm_password: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple_choice', 'short_answer', 'true_false']),
  text: z.string().min(1, 'Question text is required'),
  options: z.array(z.string()).optional(),
  correct_answer: z.union([z.number(), z.string(), z.boolean()]).optional(),
  max_score: z.number().min(1).max(100),
  grading_criteria: z.string().optional(),
});

export const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  group_id: z.string().min(1, 'Group ID is required'),
  target_role: z.string().min(1, 'Target role is required'),
  pass_score: z.number().min(0).max(100),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

export const rankEntrySchema = z.object({
  id: z.string(),
  rank_id: z.number().min(0).max(255),
  gamepass_id: z.number().min(0),
  name: z.string().min(1, 'Rank name is required'),
  description: z.string().optional(),
  price: z.number().min(0),
  is_for_sale: z.boolean(),
  regional_pricing: z.boolean(),
});

export const rankCenterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  group_id: z.string().min(1, 'Group ID is required'),
  universe_id: z.string().optional(),
  ranks: z.array(rankEntrySchema).min(1, 'At least one rank is required'),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().max(100).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
});

export const apiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required').max(50),
  scopes: z.array(z.string()).optional(),
  expires_in: z.number().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type RankCenterInput = z.infer<typeof rankCenterSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
