import { pgTable, uuid, varchar, text, decimal, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { businesses } from './business';
import { ServiceStatus } from '@/types/enums';

export const serviceStatusEnum = pgEnum('service_status', [
  ServiceStatus.ACTIVE,
  ServiceStatus.INACTIVE,
  ServiceStatus.DELETED,
]);

// 서비스
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration').notNull(), // 소요 시간 (분)
  capacity: integer('capacity').notNull().default(1), // 최대 인원
  status: serviceStatusEnum('status').notNull().default(ServiceStatus.ACTIVE),
  thumbnailImage: text('thumbnail_image'),

  // 네이버 예약 연동
  naverServiceId: varchar('naver_service_id', { length: 100 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 서비스 옵션
export const serviceOptions = pgTable('service_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'),
  isRequired: boolean('is_required').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type ServiceOption = typeof serviceOptions.$inferSelect;
export type NewServiceOption = typeof serviceOptions.$inferInsert;
