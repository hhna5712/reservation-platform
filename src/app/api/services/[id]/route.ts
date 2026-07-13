import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { updateService, deleteService } from '@/features/business/business.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  duration: z.number().positive().optional(),
  capacity: z.number().positive().optional(),
  thumbnailImage: z.string().optional(),
});

// PATCH - Update service
async function patchHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const validation = updateServiceSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const service = await updateService(
      params.id,
      req.user!.userId,
      validation.data
    );

    return successResponse(service);
  } catch (error: any) {
    console.error('Update service error:', error);
    return errorResponse(error.message || 'Failed to update service', 400);
  }
}

// DELETE - Delete service
async function deleteHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await deleteService(params.id, req.user!.userId);
    return successResponse(service);
  } catch (error: any) {
    console.error('Delete service error:', error);
    return errorResponse(error.message || 'Failed to delete service', 400);
  }
}

export const PATCH = authenticate(patchHandler);
export const DELETE = authenticate(deleteHandler);
