import { db } from '@/db';
import { businesses, services, contents, NewBusiness, NewService, NewContent } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { BusinessStatus, ServiceStatus, ContentType, ContentCategory } from '@/types/enums';
import { generateSlug } from '@/lib/utils';

// Create Business
export interface CreateBusinessInput {
  ownerId: string;
  name: string;
  description?: string;
  category?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  email?: string;
  website?: string;
  businessHours?: any;
  holidays?: any;
}

export const createBusiness = async (input: CreateBusinessInput) => {
  const slug = generateSlug(input.name);

  // Check if slug exists
  const existing = await db.query.businesses.findFirst({
    where: eq(businesses.slug, slug),
  });

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const newBusiness: NewBusiness = {
    ownerId: input.ownerId,
    name: input.name,
    slug: finalSlug,
    description: input.description,
    category: input.category,
    address: input.address,
    latitude: input.latitude,
    longitude: input.longitude,
    phone: input.phone,
    email: input.email,
    website: input.website,
    status: BusinessStatus.PENDING,
    isVerified: false,
    naverBookingEnabled: false,
    businessHours: input.businessHours ? JSON.stringify(input.businessHours) : null,
    holidays: input.holidays ? JSON.stringify(input.holidays) : null,
  };

  const [business] = await db.insert(businesses).values(newBusiness).returning();

  return business;
};

// Get Business by ID
export const getBusinessById = async (businessId: string, ownerId?: string) => {
  const business = await db.query.businesses.findFirst({
    where: ownerId
      ? and(eq(businesses.id, businessId), eq(businesses.ownerId, ownerId))
      : eq(businesses.id, businessId),
  });

  if (!business) {
    throw new Error('Business not found');
  }

  return business;
};

// Get Businesses by Owner
export const getBusinessesByOwner = async (ownerId: string) => {
  return db.query.businesses.findMany({
    where: eq(businesses.ownerId, ownerId),
    orderBy: [desc(businesses.createdAt)],
  });
};

// Update Business
export interface UpdateBusinessInput {
  name?: string;
  description?: string;
  category?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  email?: string;
  website?: string;
  businessHours?: any;
  holidays?: any;
  naverBookingId?: string;
  naverBookingEnabled?: boolean;
}

export const updateBusiness = async (
  businessId: string,
  ownerId: string,
  input: UpdateBusinessInput
) => {
  // Verify ownership
  await getBusinessById(businessId, ownerId);

  const updateData: any = {
    ...input,
    updatedAt: new Date(),
  };

  if (input.name) {
    updateData.slug = generateSlug(input.name);
  }

  if (input.businessHours) {
    updateData.businessHours = JSON.stringify(input.businessHours);
  }

  if (input.holidays) {
    updateData.holidays = JSON.stringify(input.holidays);
  }

  const [updated] = await db
    .update(businesses)
    .set(updateData)
    .where(eq(businesses.id, businessId))
    .returning();

  return updated;
};

// Delete Business (soft delete - change status)
export const deleteBusiness = async (businessId: string, ownerId: string) => {
  await getBusinessById(businessId, ownerId);

  const [deleted] = await db
    .update(businesses)
    .set({
      status: BusinessStatus.SUSPENDED,
      updatedAt: new Date(),
    })
    .where(eq(businesses.id, businessId))
    .returning();

  return deleted;
};

// ===== Service Management =====

export interface CreateServiceInput {
  businessId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  capacity?: number;
  thumbnailImage?: string;
}

export const createService = async (ownerId: string, input: CreateServiceInput) => {
  // Verify business ownership
  await getBusinessById(input.businessId, ownerId);

  const newService: NewService = {
    businessId: input.businessId,
    name: input.name,
    description: input.description,
    price: input.price.toString(),
    duration: input.duration,
    capacity: input.capacity || 1,
    status: ServiceStatus.ACTIVE,
    thumbnailImage: input.thumbnailImage,
  };

  const [service] = await db.insert(services).values(newService).returning();

  return service;
};

export const getServicesByBusiness = async (businessId: string) => {
  return db.query.services.findMany({
    where: and(
      eq(services.businessId, businessId),
      eq(services.status, ServiceStatus.ACTIVE)
    ),
    orderBy: [desc(services.createdAt)],
  });
};

export const updateService = async (
  serviceId: string,
  ownerId: string,
  input: Partial<CreateServiceInput>
) => {
  const service = await db.query.services.findFirst({
    where: eq(services.id, serviceId),
    with: {
      business: true,
    },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  // Check ownership through business
  const business = await db.query.businesses.findFirst({
    where: and(eq(businesses.id, service.businessId), eq(businesses.ownerId, ownerId)),
  });

  if (!business) {
    throw new Error('Not authorized');
  }

  const updateData: any = {
    ...input,
    updatedAt: new Date(),
  };

  if (input.price !== undefined) {
    updateData.price = input.price.toString();
  }

  const [updated] = await db
    .update(services)
    .set(updateData)
    .where(eq(services.id, serviceId))
    .returning();

  return updated;
};

export const deleteService = async (serviceId: string, ownerId: string) => {
  const service = await db.query.services.findFirst({
    where: eq(services.id, serviceId),
  });

  if (!service) {
    throw new Error('Service not found');
  }

  // Verify ownership
  await getBusinessById(service.businessId, ownerId);

  const [deleted] = await db
    .update(services)
    .set({
      status: ServiceStatus.DELETED,
      updatedAt: new Date(),
    })
    .where(eq(services.id, serviceId))
    .returning();

  return deleted;
};

// ===== Content Management =====

export interface CreateContentInput {
  businessId: string;
  type: ContentType;
  category: ContentCategory;
  url: string;
  title?: string;
  description?: string;
  displayOrder?: number;
  fileSize?: number;
  mimeType?: string;
}

export const createContent = async (ownerId: string, input: CreateContentInput) => {
  // Verify business ownership
  await getBusinessById(input.businessId, ownerId);

  const newContent: NewContent = {
    businessId: input.businessId,
    type: input.type,
    category: input.category,
    url: input.url,
    title: input.title,
    description: input.description,
    displayOrder: input.displayOrder || 0,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
  };

  const [content] = await db.insert(contents).values(newContent).returning();

  return content;
};

export const getContentsByBusiness = async (businessId: string, category?: ContentCategory) => {
  return db.query.contents.findMany({
    where: category
      ? and(eq(contents.businessId, businessId), eq(contents.category, category))
      : eq(contents.businessId, businessId),
    orderBy: [desc(contents.displayOrder), desc(contents.createdAt)],
  });
};

export const deleteContent = async (contentId: string, ownerId: string) => {
  const content = await db.query.contents.findFirst({
    where: eq(contents.id, contentId),
  });

  if (!content) {
    throw new Error('Content not found');
  }

  // Verify ownership
  await getBusinessById(content.businessId, ownerId);

  await db.delete(contents).where(eq(contents.id, contentId));

  return { success: true };
};
