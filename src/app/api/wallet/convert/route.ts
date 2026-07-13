import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { convertDepositToPoints } from '@/features/wallet/wallet.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const convertSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
});

async function handler(req: AuthenticatedRequest) {
  try {
    const body = await req.json();

    const validation = convertSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const result = await convertDepositToPoints(req.user!.userId, validation.data.amount);
    return successResponse(result);
  } catch (error: any) {
    console.error('Convert error:', error);
    return errorResponse(error.message || 'Failed to convert deposit to points', 400);
  }
}

export const POST = authenticate(handler);
