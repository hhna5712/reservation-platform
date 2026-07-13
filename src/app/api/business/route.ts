import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createBusiness, getBusinessesByOwner } from '@/features/business/business.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const createBusinessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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
});

// GET - Get businesses by owner
async function getHandler(req: AuthenticatedRequest) {
  try {
    const businesses = await getBusinessesByOwner(req.user!.userId);
    return successResponse(businesses);
  } catch (error: any) {
    console.error('Get businesses error:', error);
    return errorResponse(error.message || 'Failed to get businesses', 400);
  }
}

// POST - Create business
async function postHandler(req: AuthenticatedRequest) {
  try {
    const body = await req.json();

    const validation = createBusinessSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const business = await createBusiness({
      ...validation.data,
      ownerId: req.user!.userId,
    });

    return successResponse(business, 201);
  } catch (error: any) {
    console.error('Create business error:', error);
    return errorResponse(error.message || 'Failed to create business', 400);
  }
}

export const GET = authenticate(getHandler);
export const POST = authenticate(postHandler);
