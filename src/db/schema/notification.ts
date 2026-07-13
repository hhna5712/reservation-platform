import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { NotificationType } from '@/types/enums';

export const notificationTypeEnum = pgEnum('notification_type', [
  NotificationType.RESERVATION_CONFIRMED,
  NotificationType.RESERVATION_CANCELLED,
  NotificationType.PAYMENT_COMPLETED,
  NotificationType.REVIEW_REQUEST,
  NotificationType.SETTLEMENT_COMPLETED,
  NotificationType.SYSTEM,
]);

// 알림
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content'),
  link: text('link'),
  isRead: boolean('is_read').notNull().default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
