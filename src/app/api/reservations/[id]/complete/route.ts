import { NextRequest } from 'next/server';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { completeReservation } from '@/features/reservation/reservation.service';
import { successResponse, errorResponse } from '@/lib/api-response';

// POST - Complete reservation (business owner only)
async function postHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await completeReservation(params.id, req.user!.userId);
    return successResponse(reservation);
  } catch (error: any) {
    console.error('Complete reservation error:', error);
    return errorResponse(error.message || 'Failed to complete reservation', 400);
  }
}

export const POST = authenticate(postHandler);
