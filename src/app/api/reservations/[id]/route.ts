import { NextRequest } from 'next/server';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { getReservationById } from '@/features/reservation/reservation.service';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET - Get reservation by ID
async function getHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await getReservationById(params.id);
    return successResponse(reservation);
  } catch (error: any) {
    console.error('Get reservation error:', error);
    return errorResponse(error.message || 'Failed to get reservation', 404);
  }
}

export const GET = authenticate(getHandler);
