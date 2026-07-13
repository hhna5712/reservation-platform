import { pgTable, uuid, timestamp, text, decimal, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { businesses } from './business';
import { services } from './services';
import { ReservationStatus } from '@/types/enums';

export const reservationStatusEnum = pgEnum('reservation_status', [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.COMPLETED,
  ReservationStatus.CANCELLED,
  ReservationStatus.NO_SHOW,
]);

// 예약
export const reservations = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => users.id).notNull(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),

  reservationDate: timestamp('reservation_date').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),

  headCount: integer('head_count').notNull().default(1),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),

  status: reservationStatusEnum('status').notNull().default(ReservationStatus.PENDING),

  customerNotes: text('customer_notes'),
  businessNotes: text('business_notes'),

  // 네이버 예약 연동
  naverReservationId: text('naver_reservation_id'),

  cancelledAt: timestamp('cancelled_at'),
  cancelReason: text('cancel_reason'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 예약 - 서비스 옵션 매핑
export const reservationOptions = pgTable('reservation_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  reservationId: uuid('reservation_id').references(() => reservations.id).notNull(),
  optionId: uuid('option_id').notNull(), // serviceOptions.id
  quantity: integer('quantity').notNull().default(1),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
});

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
export type ReservationOption = typeof reservationOptions.$inferSelect;
export type NewReservationOption = typeof reservationOptions.$inferInsert;
