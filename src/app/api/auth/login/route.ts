import { NextRequest } from 'next/server';
import { z } from 'zod';
import { login } from '@/features/auth/auth.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const result = await login(validation.data);
    return successResponse(result);
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse(error.message || 'Login failed', 401);
  }
}
