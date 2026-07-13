import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { topupDeposit } from '@/features/wallet/wallet.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const topupSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
});

async function handler(req: AuthenticatedRequest) {
  try {
    const body = await req.json();

    const validation = topupSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const result = await topupDeposit(req.user!.userId, validation.data.amount);
    return successResponse(result);
  } catch (error: any) {
    console.error('Topup error:', error);
    return errorResponse(error.message || 'Failed to topup deposit', 400);
  }
}

export const POST = authenticate(handler);
