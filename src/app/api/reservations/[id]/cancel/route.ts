import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { cancelReservation } from '@/features/reservation/reservation.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const cancelSchema = z.object({
  cancelReason: z.string().optional(),
});

// POST - Cancel reservation
async function postHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const validation = cancelSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const reservation = await cancelReservation(
      params.id,
      req.user!.userId,
      validation.data.cancelReason
    );

    return successResponse(reservation);
  } catch (error: any) {
    console.error('Cancel reservation error:', error);
    return errorResponse(error.message || 'Failed to cancel reservation', 400);
  }
}

export const POST = authenticate(postHandler);
