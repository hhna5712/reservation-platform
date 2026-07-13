import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { updateTimelineStep, deleteTimelineStep } from '@/features/timeline/timeline.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { TimelineStepType, TransportType } from '@/types/enums';

const updateStepSchema = z.object({
  stepOrder: z.number().int().positive().optional(),
  type: z.nativeEnum(TimelineStepType).optional(),
  startTime: z.string().transform(str => new Date(str)).optional(),
  endTime: z.string().transform(str => new Date(str)).optional(),
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

// PATCH - Update timeline step
async function patchHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string; stepId: string } }
) {
  try {
    const body = await req.json();

    const validation = updateStepSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const step = await updateTimelineStep(
      params.stepId,
      req.user!.userId,
      validation.data
    );

    return successResponse(step);
  } catch (error: any) {
    console.error('Update timeline step error:', error);
    return errorResponse(error.message || 'Failed to update timeline step', 400);
  }
}

// DELETE - Delete timeline step
async function deleteHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string; stepId: string } }
) {
  try {
    const result = await deleteTimelineStep(params.stepId, req.user!.userId);
    return successResponse(result);
  } catch (error: any) {
    console.error('Delete timeline step error:', error);
    return errorResponse(error.message || 'Failed to delete timeline step', 400);
  }
}

export const PATCH = authenticate(patchHandler);
export const DELETE = authenticate(deleteHandler);
