import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createTimeline, getTimelinesByUser } from '@/features/timeline/timeline.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const createTimelineSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  description: z.string().optional(),
});

// GET - Get user's timelines
async function getHandler(req: AuthenticatedRequest) {
  try {
    const timelines = await getTimelinesByUser(req.user!.userId);
    return successResponse(timelines);
  } catch (error: any) {
    console.error('Get timelines error:', error);
    return errorResponse(error.message || 'Failed to get timelines', 400);
  }
}

// POST - Create timeline
async function postHandler(req: AuthenticatedRequest) {
  try {
    const body = await req.json();

    const validation = createTimelineSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const timeline = await createTimeline({
      ...validation.data,
      userId: req.user!.userId,
    });

    return successResponse(timeline, 201);
  } catch (error: any) {
    console.error('Create timeline error:', error);
    return errorResponse(error.message || 'Failed to create timeline', 400);
  }
}

export const GET = authenticate(getHandler);
export const POST = authenticate(postHandler);
