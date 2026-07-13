import { NextRequest } from 'next/server';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { getTransactions } from '@/features/wallet/wallet.service';
import { successResponse, errorResponse } from '@/lib/api-response';

async function handler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const txs = await getTransactions(req.user!.userId, limit, offset);
    return successResponse(txs);
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return errorResponse(error.message || 'Failed to get transactions', 400);
  }
}

export const GET = authenticate(handler);
