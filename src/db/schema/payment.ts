import { pgTable, uuid, decimal, timestamp, text, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { reservations } from './reservation';
import { businesses } from './business';
import { PaymentStatus, SettlementStatus } from '@/types/enums';

export const paymentStatusEnum = pgEnum('payment_status', [
  PaymentStatus.PENDING,
  PaymentStatus.COMPLETED,
  PaymentStatus.FAILED,
  PaymentStatus.REFUNDED,
]);

export const settlementStatusEnum = pgEnum('settlement_status', [
  SettlementStatus.PENDING,
  SettlementStatus.PROCESSING,
  SettlementStatus.COMPLETED,
  SettlementStatus.FAILED,
]);

// 결제
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  reservationId: uuid('reservation_id').references(() => reservations.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),

  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  pointsUsed: decimal('points_used', { precision: 10, scale: 2 }).notNull().default('0'),
  depositUsed: decimal('deposit_used', { precision: 10, scale: 2 }).notNull().default('0'),

  status: paymentStatusEnum('status').notNull().default(PaymentStatus.PENDING),

  paymentMethod: varchar('payment_method', { length: 50 }), // card, bank_transfer, points, deposit
  paymentGateway: varchar('payment_gateway', { length: 50 }), // toss, iamport 등
  paymentGatewayId: varchar('payment_gateway_id', { length: 200 }),

  metadata: text('metadata'), // JSON string

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 정산
export const settlements = pgTable('settlements', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),

  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),

  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).notNull(),
  settlementAmount: decimal('settlement_amount', { precision: 10, scale: 2 }).notNull(),

  status: settlementStatusEnum('status').notNull().default(SettlementStatus.PENDING),

  bankName: varchar('bank_name', { length: 100 }),
  accountNumber: varchar('account_number', { length: 100 }),
  accountHolder: varchar('account_holder', { length: 100 }),

  completedAt: timestamp('completed_at'),
  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Settlement = typeof settlements.$inferSelect;
export type NewSettlement = typeof settlements.$inferInsert;
