import { NextRequest } from 'next/server';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { getMe } from '@/features/auth/auth.service';
import { successResponse, errorResponse } from '@/lib/api-response';

async function handler(req: AuthenticatedRequest) {
  try {
    const user = await getMe(req.user!.userId);
    return successResponse(user);
  } catch (error: any) {
    console.error('Get me error:', error);
    return errorResponse(error.message || 'Failed to get user info', 400);
  }
}

export const GET = authenticate(handler);
