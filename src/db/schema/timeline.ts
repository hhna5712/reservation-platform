import { pgTable, uuid, varchar, text, timestamp, integer, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { reservations } from './reservation';
import { TimelineStepType, TransportType } from '@/types/enums';

export const timelineStepTypeEnum = pgEnum('timeline_step_type', [
  TimelineStepType.SERVICE,
  TimelineStepType.TRANSPORT,
  TimelineStepType.BREAK,
  TimelineStepType.CUSTOM,
]);

export const transportTypeEnum = pgEnum('transport_type', [
  TransportType.WALK,
  TransportType.BICYCLE,
  TransportType.CAR,
  TransportType.TAXI,
  TransportType.BUS,
  TransportType.SUBWAY,
  TransportType.TRAIN,
]);

// 타임라인 (일정)
export const timelines = pgTable('timelines', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 타임라인 스텝
export const timelineSteps = pgTable('timeline_steps', {
  id: uuid('id').defaultRandom().primaryKey(),
  timelineId: uuid('timeline_id').references(() => timelines.id).notNull(),
  stepOrder: integer('step_order').notNull(),
  type: timelineStepTypeEnum('type').notNull(),

  // 예약 관련 (type이 SERVICE인 경우)
  reservationId: uuid('reservation_id').references(() => reservations.id),

  // 이동 관련 (type이 TRANSPORT인 경우)
  transportType: transportTypeEnum('transport_type'),
  fromAddress: text('from_address'),
  toAddress: text('to_address'),
  fromLatitude: decimal('from_latitude', { precision: 10, scale: 7 }),
  fromLongitude: decimal('from_longitude', { precision: 10, scale: 7 }),
  toLatitude: decimal('to_latitude', { precision: 10, scale: 7 }),
  toLongitude: decimal('to_longitude', { precision: 10, scale: 7 }),
  estimatedDuration: integer('estimated_duration'), // 예상 소요 시간 (분)
  estimatedDistance: decimal('estimated_distance', { precision: 10, scale: 2 }), // 예상 거리 (km)

  // 공통
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  title: varchar('title', { length: 200 }),
  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Timeline = typeof timelines.$inferSelect;
export type NewTimeline = typeof timelines.$inferInsert;
export type TimelineStep = typeof timelineSteps.$inferSelect;
export type NewTimelineStep = typeof timelineSteps.$inferInsert;
