import { pgTable, uuid, varchar, text, decimal, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { BusinessStatus } from '@/types/enums';

export const businessStatusEnum = pgEnum('business_status', [
  BusinessStatus.PENDING,
  BusinessStatus.ACTIVE,
  BusinessStatus.SUSPENDED,
  BusinessStatus.REJECTED,
]);

// 업체
export const businesses = pgTable('businesses', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  description: text('description'),
  category: varchar('category', { length: 100 }), // 업종 (카페, 레스토랑, 호텔 등)
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  website: text('website'),
  status: businessStatusEnum('status').notNull().default(BusinessStatus.PENDING),
  isVerified: boolean('is_verified').notNull().default(false),

  // 네이버 예약 연동 정보
  naverBookingId: varchar('naver_booking_id', { length: 100 }),
  naverBookingEnabled: boolean('naver_booking_enabled').notNull().default(false),

  // 영업 정보
  businessHours: text('business_hours'), // JSON string
  holidays: text('holidays'), // JSON string

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
