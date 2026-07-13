import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createService, getServicesByBusiness } from '@/features/business/business.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

const createServiceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  duration: z.number().positive('Duration must be positive'),
  capacity: z.number().positive().optional(),
  thumbnailImage: z.string().optional(),
});

// GET - Get services by business
async function getHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const services = await getServicesByBusiness(params.id);
    return successResponse(services);
  } catch (error: any) {
    console.error('Get services error:', error);
    return errorResponse(error.message || 'Failed to get services', 400);
  }
}

// POST - Create service
async function postHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const validation = createServiceSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const service = await createService(req.user!.userId, {
      ...validation.data,
      businessId: params.id,
    });

    return successResponse(service, 201);
  } catch (error: any) {
    console.error('Create service error:', error);
    return errorResponse(error.message || 'Failed to create service', 400);
  }
}

export const GET = authenticate(getHandler);
export const POST = authenticate(postHandler);
