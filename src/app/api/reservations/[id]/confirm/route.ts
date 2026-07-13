import { NextRequest } from 'next/server';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { confirmReservation } from '@/features/reservation/reservation.service';
import { successResponse, errorResponse } from '@/lib/api-response';

// POST - Confirm reservation (business owner only)
async function postHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await confirmReservation(params.id, req.user!.userId);
    return successResponse(reservation);
  } catch (error: any) {
    console.error('Confirm reservation error:', error);
    return errorResponse(error.message || 'Failed to confirm reservation', 400);
  }
}

export const POST = authenticate(postHandler);
