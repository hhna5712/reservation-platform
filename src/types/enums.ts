// User Types
export enum UserRole {
  CUSTOMER = 'customer',
  BUSINESS_OWNER = 'business_owner',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

// Business Status
export enum BusinessStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

// Service Status
export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

// Reservation Status
export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

// Payment Status
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Transaction Types
export enum TransactionType {
  DEPOSIT_TOPUP = 'deposit_topup',
  DEPOSIT_REFUND = 'deposit_refund',
  DEPOSIT_TO_POINTS = 'deposit_to_points',
  POINTS_FROM_DEPOSIT = 'points_from_deposit',
  POINTS_EARN = 'points_earn',
  POINTS_USE = 'points_use',
  POINTS_EXPIRE = 'points_expire',
  PAYMENT = 'payment',
  REFUND = 'refund',
  SETTLEMENT = 'settlement',
}

// Timeline Step Types
export enum TimelineStepType {
  SERVICE = 'service',
  TRANSPORT = 'transport',
  BREAK = 'break',
  CUSTOM = 'custom',
}

// Transport Types
export enum TransportType {
  WALK = 'walk',
  BICYCLE = 'bicycle',
  CAR = 'car',
  TAXI = 'taxi',
  BUS = 'bus',
  SUBWAY = 'subway',
  TRAIN = 'train',
}

// Settlement Status
export enum SettlementStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Review Status
export enum ReviewStatus {
  ACTIVE = 'active',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
}

// Notification Types
export enum NotificationType {
  RESERVATION_CONFIRMED = 'reservation_confirmed',
  RESERVATION_CANCELLED = 'reservation_cancelled',
  PAYMENT_COMPLETED = 'payment_completed',
  REVIEW_REQUEST = 'review_request',
  SETTLEMENT_COMPLETED = 'settlement_completed',
  SYSTEM = 'system',
}

// Content Types
export enum ContentType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

// Content Category
export enum ContentCategory {
  PROFILE = 'profile',
  MENU = 'menu',
  FACILITY = 'facility',
  INTERIOR = 'interior',
  OTHER = 'other',
}
