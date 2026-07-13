import { db } from '@/db';
import {
  reservations,
  reservationOptions,
  services,
  businesses,
  payments,
  NewReservation,
  NewReservationOption,
  NewPayment
} from '@/db/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { ReservationStatus, PaymentStatus } from '@/types/enums';

// Create Reservation with Payment
export interface CreateReservationInput {
  customerId: string;
  businessId: string;
  serviceId: string;
  reservationDate: Date;
  startTime: Date;
  endTime: Date;
  headCount: number;
  customerNotes?: string;
  selectedOptions?: Array<{
    optionId: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: 'deposit' | 'points' | 'mixed';
  depositAmount?: number;
  pointsAmount?: number;
}

export const createReservation = async (input: CreateReservationInput) => {
  // Validate service exists
  const service = await db.query.services.findFirst({
    where: eq(services.id, input.serviceId),
  });

  if (!service) {
    throw new Error('Service not found');
  }

  // Calculate total price
  let totalPrice = parseFloat(service.price) * input.headCount;

  if (input.selectedOptions && input.selectedOptions.length > 0) {
    for (const option of input.selectedOptions) {
      totalPrice += option.price * option.quantity;
    }
  }

  // Create reservation
  const newReservation: NewReservation = {
    customerId: input.customerId,
    businessId: input.businessId,
    serviceId: input.serviceId,
    reservationDate: input.reservationDate,
    startTime: input.startTime,
    endTime: input.endTime,
    headCount: input.headCount,
    totalPrice: totalPrice.toString(),
    status: ReservationStatus.PENDING,
    customerNotes: input.customerNotes,
  };

  const [reservation] = await db.insert(reservations).values(newReservation).returning();

  // Add reservation options
  if (input.selectedOptions && input.selectedOptions.length > 0) {
    const optionRecords = input.selectedOptions.map(opt => ({
      reservationId: reservation.id,
      optionId: opt.optionId,
      quantity: opt.quantity,
      price: opt.price.toString(),
    }));

    await db.insert(reservationOptions).values(optionRecords);
  }

  // Create payment record
  const depositUsed = input.depositAmount || 0;
  const pointsUsed = input.pointsAmount || 0;

  const newPayment: NewPayment = {
    reservationId: reservation.id,
    userId: input.customerId,
    amount: totalPrice.toString(),
    depositUsed: depositUsed.toString(),
    pointsUsed: pointsUsed.toString(),
    status: PaymentStatus.PENDING,
    paymentMethod: input.paymentMethod,
  };

  const [payment] = await db.insert(payments).values(newPayment).returning();

  return {
    reservation,
    payment,
  };
};

// Get Reservation by ID
export const getReservationById = async (reservationId: string, userId?: string) => {
  const reservation = await db.query.reservations.findFirst({
    where: userId
      ? and(eq(reservations.id, reservationId), eq(reservations.customerId, userId))
      : eq(reservations.id, reservationId),
    with: {
      service: true,
      business: true,
    },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  return reservation;
};

// Get Reservations by Customer
export const getReservationsByCustomer = async (
  customerId: string,
  status?: ReservationStatus
) => {
  return db.query.reservations.findMany({
    where: status
      ? and(eq(reservations.customerId, customerId), eq(reservations.status, status))
      : eq(reservations.customerId, customerId),
    orderBy: [desc(reservations.reservationDate)],
    with: {
      service: true,
      business: true,
    },
  });
};

// Get Reservations by Business
export const getReservationsByBusiness = async (
  businessId: string,
  startDate?: Date,
  endDate?: Date
) => {
  let whereClause = eq(reservations.businessId, businessId);

  if (startDate && endDate) {
    whereClause = and(
      whereClause,
      gte(reservations.reservationDate, startDate),
      lte(reservations.reservationDate, endDate)
    ) as any;
  }

  return db.query.reservations.findMany({
    where: whereClause,
    orderBy: [desc(reservations.reservationDate)],
    with: {
      service: true,
    },
  });
};

// Confirm Reservation (by business owner)
export const confirmReservation = async (reservationId: string, ownerId: string) => {
  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.id, reservationId),
    with: {
      business: true,
    },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  // Check if user is business owner
  const business = await db.query.businesses.findFirst({
    where: and(
      eq(businesses.id, reservation.businessId),
      eq(businesses.ownerId, ownerId)
    ),
  });

  if (!business) {
    throw new Error('Not authorized');
  }

  if (reservation.status !== ReservationStatus.PENDING) {
    throw new Error('Reservation cannot be confirmed');
  }

  // Update reservation status
  const [updated] = await db
    .update(reservations)
    .set({
      status: ReservationStatus.CONFIRMED,
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, reservationId))
    .returning();

  // Update payment status
  await db
    .update(payments)
    .set({
      status: PaymentStatus.COMPLETED,
      updatedAt: new Date(),
    })
    .where(eq(payments.reservationId, reservationId));

  return updated;
};

// Cancel Reservation
export const cancelReservation = async (
  reservationId: string,
  userId: string,
  cancelReason?: string
) => {
  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.id, reservationId),
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  // Check if user is customer
  if (reservation.customerId !== userId) {
    throw new Error('Not authorized');
  }

  if (reservation.status === ReservationStatus.CANCELLED) {
    throw new Error('Reservation already cancelled');
  }

  if (reservation.status === ReservationStatus.COMPLETED) {
    throw new Error('Cannot cancel completed reservation');
  }

  // Update reservation
  const [updated] = await db
    .update(reservations)
    .set({
      status: ReservationStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelReason,
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, reservationId))
    .returning();

  // Refund payment if confirmed
  if (reservation.status === ReservationStatus.CONFIRMED) {
    await db
      .update(payments)
      .set({
        status: PaymentStatus.REFUNDED,
        updatedAt: new Date(),
      })
      .where(eq(payments.reservationId, reservationId));

    // TODO: Refund to wallet/points
  }

  return updated;
};

// Complete Reservation
export const completeReservation = async (reservationId: string, ownerId: string) => {
  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.id, reservationId),
    with: {
      business: true,
    },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  // Check ownership
  const business = await db.query.businesses.findFirst({
    where: and(
      eq(businesses.id, reservation.businessId),
      eq(businesses.ownerId, ownerId)
    ),
  });

  if (!business) {
    throw new Error('Not authorized');
  }

  if (reservation.status !== ReservationStatus.CONFIRMED) {
    throw new Error('Only confirmed reservations can be completed');
  }

  const [updated] = await db
    .update(reservations)
    .set({
      status: ReservationStatus.COMPLETED,
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, reservationId))
    .returning();

  return updated;
};
