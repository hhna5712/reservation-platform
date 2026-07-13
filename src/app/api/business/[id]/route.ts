import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { getBusinessById, updateBusiness, deleteBusiness } from '@/features/business/business.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const updateBusinessSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  businessHours: z.any().optional(),
  holidays: z.any().optional(),
  naverBookingId: z.string().optional(),
  naverBookingEnabled: z.boolean().optional(),
});

// GET - Get business by ID
async function getHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const business = await getBusinessById(params.id, req.user!.userId);
    return successResponse(business);
  } catch (error: any) {
    console.error('Get business error:', error);
    return errorResponse(error.message || 'Failed to get business', 404);
  }
}

// PATCH - Update business
async function patchHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const validation = updateBusinessSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const business = await updateBusiness(
      params.id,
      req.user!.userId,
      validation.data
    );

    return successResponse(business);
  } catch (error: any) {
    console.error('Update business error:', error);
    return errorResponse(error.message || 'Failed to update business', 400);
  }
}

// DELETE - Delete business
async function deleteHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const business = await deleteBusiness(params.id, req.user!.userId);
    return successResponse(business);
  } catch (error: any) {
    console.error('Delete business error:', error);
    return errorResponse(error.message || 'Failed to delete business', 400);
  }
}

export const GET = authenticate(getHandler);
export const PATCH = authenticate(patchHandler);
export const DELETE = authenticate(deleteHandler);
