import { pgTable, uuid, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { businesses } from './business';
import { reservations } from './reservation';
import { ReviewStatus } from '@/types/enums';

export const reviewStatusEnum = pgEnum('review_status', [
  ReviewStatus.ACTIVE,
  ReviewStatus.HIDDEN,
  ReviewStatus.DELETED,
]);

// 리뷰
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  reservationId: uuid('reservation_id').references(() => reservations.id).notNull().unique(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),

  rating: integer('rating').notNull(), // 1-5
  content: text('content'),

  status: reviewStatusEnum('status').notNull().default(ReviewStatus.ACTIVE),

  // 업체 답변
  businessReply: text('business_reply'),
  businessRepliedAt: timestamp('business_replied_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
