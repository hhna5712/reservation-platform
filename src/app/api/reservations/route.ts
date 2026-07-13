import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createReservation, getReservationsByCustomer } from '@/features/reservation/reservation.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { ReservationStatus } from '@/types/enums';

const createReservationSchema = z.object({
  businessId: z.string().uuid(),
  serviceId: z.string().uuid(),
  reservationDate: z.string().transform(str => new Date(str)),
  startTime: z.string().transform(str => new Date(str)),
  endTime: z.string().transform(str => new Date(str)),
  headCount: z.number().positive(),
  customerNotes: z.string().optional(),
  selectedOptions: z.array(z.object({
    optionId: z.string().uuid(),
    quantity: z.number().positive(),
    price: z.number(),
  })).optional(),
  paymentMethod: z.enum(['deposit', 'points', 'mixed']),
  depositAmount: z.number().optional(),
  pointsAmount: z.number().optional(),
});

// GET - Get customer's reservations
async function getHandler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const status = statusParam as ReservationStatus | undefined;

    const reservations = await getReservationsByCustomer(req.user!.userId, status);
    return successResponse(reservations);
  } catch (error: any) {
    console.error('Get reservations error:', error);
    return errorResponse(error.message || 'Failed to get reservations', 400);
  }
}

// POST - Create reservation
async function postHandler(req: AuthenticatedRequest) {
  try {
    const body = await req.json();

    const validation = createReservationSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const result = await createReservation({
      ...validation.data,
      customerId: req.user!.userId,
    });

    return successResponse(result, 201);
  } catch (error: any) {
    console.error('Create reservation error:', error);
    return errorResponse(error.message || 'Failed to create reservation', 400);
  }
}

export const GET = authenticate(getHandler);
export const POST = authenticate(postHandler);
