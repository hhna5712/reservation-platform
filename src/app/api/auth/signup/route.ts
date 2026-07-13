import { NextRequest } from 'next/server';
import { z } from 'zod';
import { signup } from '@/features/auth/auth.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { UserRole } from '@/types/enums';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const result = await signup(validation.data);
    return successResponse(result, 201);
  } catch (error: any) {
    console.error('Signup error:', error);
    return errorResponse(error.message || 'Failed to create account', 400);
  }
}
