import { pgTable, uuid, decimal, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { TransactionType } from '@/types/enums';

export const transactionTypeEnum = pgEnum('transaction_type', [
  TransactionType.DEPOSIT_TOPUP,
  TransactionType.DEPOSIT_REFUND,
  TransactionType.DEPOSIT_TO_POINTS,
  TransactionType.POINTS_FROM_DEPOSIT,
  TransactionType.POINTS_EARN,
  TransactionType.POINTS_USE,
  TransactionType.POINTS_EXPIRE,
  TransactionType.PAYMENT,
  TransactionType.REFUND,
  TransactionType.SETTLEMENT,
]);

// 지갑 (예치금)
export const wallets = pgTable('wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  balance: decimal('balance', { precision: 10, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 포인트
export const points = pgTable('points', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  balance: decimal('balance', { precision: 10, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 거래 내역
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: transactionTypeEnum('type').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  balanceBefore: decimal('balance_before', { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal('balance_after', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
export type Point = typeof points.$inferSelect;
export type NewPoint = typeof points.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
