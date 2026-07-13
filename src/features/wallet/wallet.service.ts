import { db } from '@/db';
import { wallets, points, transactions, NewWallet, NewPoint, NewTransaction } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { TransactionType } from '@/types/enums';

// Initialize wallet and points for new user
export const initializeWallet = async (userId: string) => {
  const existingWallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  if (!existingWallet) {
    await db.insert(wallets).values({ userId, balance: '0' });
  }

  const existingPoints = await db.query.points.findFirst({
    where: eq(points.userId, userId),
  });

  if (!existingPoints) {
    await db.insert(points).values({ userId, balance: '0' });
  }
};

// Get wallet info
export const getWallet = async (userId: string) => {
  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  const point = await db.query.points.findFirst({
    where: eq(points.userId, userId),
  });

  if (!wallet || !point) {
    throw new Error('Wallet not found');
  }

  return {
    deposit: wallet.balance,
    points: point.balance,
    updatedAt: wallet.updatedAt,
  };
};

// Top up deposit
export const topupDeposit = async (userId: string, amount: number) => {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }

  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  if (!wallet) {
    throw new Error('Wallet not found');
  }

  const balanceBefore = parseFloat(wallet.balance);
  const balanceAfter = balanceBefore + amount;

  // Update wallet balance
  await db
    .update(wallets)
    .set({
      balance: balanceAfter.toString(),
      updatedAt: new Date(),
    })
    .where(eq(wallets.userId, userId));

  // Record transaction
  const transaction: NewTransaction = {
    userId,
    type: TransactionType.DEPOSIT_TOPUP,
    amount: amount.toString(),
    balanceBefore: balanceBefore.toString(),
    balanceAfter: balanceAfter.toString(),
    description: `예치금 충전`,
  };

  await db.insert(transactions).values(transaction);

  return {
    newBalance: balanceAfter.toString(),
    amount: amount.toString(),
  };
};

// Convert deposit to points
export const convertDepositToPoints = async (userId: string, amount: number) => {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }

  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  const point = await db.query.points.findFirst({
    where: eq(points.userId, userId),
  });

  if (!wallet || !point) {
    throw new Error('Wallet not found');
  }

  const walletBalance = parseFloat(wallet.balance);
  if (walletBalance < amount) {
    throw new Error('Insufficient deposit balance');
  }

  const pointBalance = parseFloat(point.balance);

  // Deduct from wallet
  const newWalletBalance = walletBalance - amount;
  await db
    .update(wallets)
    .set({
      balance: newWalletBalance.toString(),
      updatedAt: new Date(),
    })
    .where(eq(wallets.userId, userId));

  // Add to points
  const newPointBalance = pointBalance + amount;
  await db
    .update(points)
    .set({
      balance: newPointBalance.toString(),
      updatedAt: new Date(),
    })
    .where(eq(points.userId, userId));

  // Record transactions
  await db.insert(transactions).values([
    {
      userId,
      type: TransactionType.DEPOSIT_TO_POINTS,
      amount: amount.toString(),
      balanceBefore: walletBalance.toString(),
      balanceAfter: newWalletBalance.toString(),
      description: `예치금을 포인트로 전환`,
    },
    {
      userId,
      type: TransactionType.POINTS_FROM_DEPOSIT,
      amount: amount.toString(),
      balanceBefore: pointBalance.toString(),
      balanceAfter: newPointBalance.toString(),
      description: `예치금에서 포인트 전환`,
    },
  ]);

  return {
    depositBalance: newWalletBalance.toString(),
    pointBalance: newPointBalance.toString(),
    amount: amount.toString(),
  };
};

// Get transaction history
export const getTransactions = async (
  userId: string,
  limit: number = 50,
  offset: number = 0
) => {
  const txs = await db.query.transactions.findMany({
    where: eq(transactions.userId, userId),
    orderBy: [desc(transactions.createdAt)],
    limit,
    offset,
  });

  return txs;
};
