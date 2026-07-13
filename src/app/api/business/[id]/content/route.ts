import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createContent, getContentsByBusiness } from '@/features/business/business.service';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { ContentType, ContentCategory } from '@/types/enums';

const createContentSchema = z.object({
  type: z.nativeEnum(ContentType),
  category: z.nativeEnum(ContentCategory),
  url: z.string().url('Invalid URL'),
  title: z.string().optional(),
  description: z.string().optional(),
  displayOrder: z.number().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
});

// GET - Get contents by business
async function getHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as ContentCategory | undefined;

    const contents = await getContentsByBusiness(params.id, category);
    return successResponse(contents);
  } catch (error: any) {
    console.error('Get contents error:', error);
    return errorResponse(error.message || 'Failed to get contents', 400);
  }
}

// POST - Create content
async function postHandler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const validation = createContentSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const content = await createContent(req.user!.userId, {
      ...validation.data,
      businessId: params.id,
    });

    return successResponse(content, 201);
  } catch (error: any) {
    console.error('Create content error:', error);
    return errorResponse(error.message || 'Failed to create content', 400);
  }
}

export const GET = authenticate(getHandler);
export const POST = authenticate(postHandler);
