import { pgTable, uuid, varchar, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { businesses } from './business';
import { ContentType, ContentCategory } from '@/types/enums';

export const contentTypeEnum = pgEnum('content_type', [
  ContentType.IMAGE,
  ContentType.VIDEO,
  ContentType.DOCUMENT,
]);

export const contentCategoryEnum = pgEnum('content_category', [
  ContentCategory.PROFILE,
  ContentCategory.MENU,
  ContentCategory.FACILITY,
  ContentCategory.INTERIOR,
  ContentCategory.OTHER,
]);

// 콘텐츠 (이미지, 동영상 등)
export const contents = pgTable('contents', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  type: contentTypeEnum('type').notNull(),
  category: contentCategoryEnum('category').notNull(),
  url: text('url').notNull(),
  title: varchar('title', { length: 200 }),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
  fileSize: integer('file_size'), // bytes
  mimeType: varchar('mime_type', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Content = typeof contents.$inferSelect;
export type NewContent = typeof contents.$inferInsert;
