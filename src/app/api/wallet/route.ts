import { NextRequest } from 'next/server';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { getWallet, initializeWallet } from '@/features/wallet/wallet.service';
import { successResponse, errorResponse } from '@/lib/api-response';

async function handler(req: AuthenticatedRequest) {
  try {
    // Ensure wallet exists
    await initializeWallet(req.user!.userId);

    const wallet = await getWallet(req.user!.userId);
    return successResponse(wallet);
  } catch (error: any) {
    console.error('Get wallet error:', error);
    return errorResponse(error.message || 'Failed to get wallet', 400);
  }
}

export const GET = authenticate(handler);
