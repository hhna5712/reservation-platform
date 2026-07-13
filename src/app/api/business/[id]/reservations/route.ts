import { NextRequest } from 'next/server';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { getReservationsByBusiness } from '@/features/reservation/reservation.service';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET - Get reservations for business (owner only)
async function getHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;

    const reservations = await getReservationsByBusiness(
      params.id,
      startDate,
      endDate
    );

    return successResponse(reservations);
  } catch (error: any) {
    console.error('Get business reservations error:', error);
    return errorResponse(error.message || 'Failed to get reservations', 400);
  }
}

export const GET = authenticate(getHandler);
