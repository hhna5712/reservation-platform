import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { getTimelineById, updateTimeline, deleteTimeline } from '@/features/timeline/timeline.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const updateTimelineSchema = z.object({
  title: z.string().min(2).optional(),
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  description: z.string().optional(),
});

// GET - Get timeline by ID
async function getHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timeline = await getTimelineById(params.id, req.user!.userId);
    return successResponse(timeline);
  } catch (error: any) {
    console.error('Get timeline error:', error);
    return errorResponse(error.message || 'Failed to get timeline', 404);
  }
}

// PATCH - Update timeline
async function patchHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const validation = updateTimelineSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const timeline = await updateTimeline(
      params.id,
      req.user!.userId,
      validation.data
    );

    return successResponse(timeline);
  } catch (error: any) {
    console.error('Update timeline error:', error);
    return errorResponse(error.message || 'Failed to update timeline', 400);
  }
}

// DELETE - Delete timeline
async function deleteHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteTimeline(params.id, req.user!.userId);
    return successResponse(result);
  } catch (error: any) {
    console.error('Delete timeline error:', error);
    return errorResponse(error.message || 'Failed to delete timeline', 400);
  }
}

export const GET = authenticate(getHandler);
export const PATCH = authenticate(patchHandler);
export const DELETE = authenticate(deleteHandler);
