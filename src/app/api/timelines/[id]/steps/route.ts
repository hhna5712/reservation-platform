import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { addTimelineStep, getStepsByTimeline } from '@/features/timeline/timeline.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { TimelineStepType, TransportType } from '@/types/enums';

const addStepSchema = z.object({
  stepOrder: z.number().int().positive(),
  type: z.nativeEnum(TimelineStepType),
  startTime: z.string().transform(str => new Date(str)),
  endTime: z.string().transform(str => new Date(str)),
  title: z.string().optional(),
  notes: z.string().optional(),
  reservationId: z.string().uuid().optional(),
  transportType: z.nativeEnum(TransportType).optional(),
  fromAddress: z.string().optional(),
  toAddress: z.string().optional(),
  fromLatitude: z.string().optional(),
  fromLongitude: z.string().optional(),
  toLatitude: z.string().optional(),
  toLongitude: z.string().optional(),
});

// GET - Get timeline steps
async function getHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const steps = await getStepsByTimeline(params.id);
    return successResponse(steps);
  } catch (error: any) {
    console.error('Get timeline steps error:', error);
    return errorResponse(error.message || 'Failed to get timeline steps', 400);
  }
}

// POST - Add timeline step
async function postHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const validation = addStepSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const step = await addTimelineStep(req.user!.userId, {
      ...validation.data,
      timelineId: params.id,
    });

    return successResponse(step, 201);
  } catch (error: any) {
    console.error('Add timeline step error:', error);
    return errorResponse(error.message || 'Failed to add timeline step', 400);
  }
}

export const GET = authenticate(getHandler);
export const POST = authenticate(postHandler);
