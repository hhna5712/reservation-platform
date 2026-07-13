import { db } from '@/db';
import {
  timelines,
  timelineSteps,
  reservations,
  NewTimeline,
  NewTimelineStep
} from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { TimelineStepType, TransportType } from '@/types/enums';

// Create Timeline
export interface CreateTimelineInput {
  userId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
}

export const createTimeline = async (input: CreateTimelineInput) => {
  const newTimeline: NewTimeline = {
    userId: input.userId,
    title: input.title,
    startDate: input.startDate,
    endDate: input.endDate,
    description: input.description,
  };

  const [timeline] = await db.insert(timelines).values(newTimeline).returning();
  return timeline;
};

// Get Timeline by ID
export const getTimelineById = async (timelineId: string, userId?: string) => {
  const timeline = await db.query.timelines.findFirst({
    where: userId
      ? and(eq(timelines.id, timelineId), eq(timelines.userId, userId))
      : eq(timelines.id, timelineId),
  });

  if (!timeline) {
    throw new Error('Timeline not found');
  }

  return timeline;
};

// Get Timelines by User
export const getTimelinesByUser = async (userId: string) => {
  return db.query.timelines.findMany({
    where: eq(timelines.userId, userId),
    orderBy: [desc(timelines.startDate)],
  });
};

// Update Timeline
export interface UpdateTimelineInput {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

export const updateTimeline = async (
  timelineId: string,
  userId: string,
  input: UpdateTimelineInput
) => {
  await getTimelineById(timelineId, userId);

  const [updated] = await db
    .update(timelines)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(timelines.id, timelineId))
    .returning();

  return updated;
};

// Delete Timeline
export const deleteTimeline = async (timelineId: string, userId: string) => {
  await getTimelineById(timelineId, userId);

  // Delete all steps first
  await db.delete(timelineSteps).where(eq(timelineSteps.timelineId, timelineId));

  // Delete timeline
  await db.delete(timelines).where(eq(timelines.id, timelineId));

  return { success: true };
};

// ===== Timeline Steps =====

// Add Step to Timeline
export interface AddTimelineStepInput {
  timelineId: string;
  stepOrder: number;
  type: TimelineStepType;
  startTime: Date;
  endTime: Date;
  title?: string;
  notes?: string;

  // For SERVICE type
  reservationId?: string;

  // For TRANSPORT type
  transportType?: TransportType;
  fromAddress?: string;
  toAddress?: string;
  fromLatitude?: string;
  fromLongitude?: string;
  toLatitude?: string;
  toLongitude?: string;
}

export const addTimelineStep = async (userId: string, input: AddTimelineStepInput) => {
  // Verify timeline ownership
  await getTimelineById(input.timelineId, userId);

  // Calculate duration and distance for transport
  let estimatedDuration: number | undefined;
  let estimatedDistance: number | undefined;

  if (input.type === TimelineStepType.TRANSPORT && input.fromLatitude && input.toLatitude) {
    const result = calculateDistanceAndTime(
      parseFloat(input.fromLatitude),
      parseFloat(input.fromLongitude!),
      parseFloat(input.toLatitude),
      parseFloat(input.toLongitude!)
    );
    estimatedDuration = result.duration;
    estimatedDistance = result.distance;
  }

  const newStep: NewTimelineStep = {
    timelineId: input.timelineId,
    stepOrder: input.stepOrder,
    type: input.type,
    startTime: input.startTime,
    endTime: input.endTime,
    title: input.title,
    notes: input.notes,
    reservationId: input.reservationId,
    transportType: input.transportType,
    fromAddress: input.fromAddress,
    toAddress: input.toAddress,
    fromLatitude: input.fromLatitude,
    fromLongitude: input.fromLongitude,
    toLatitude: input.toLatitude,
    toLongitude: input.toLongitude,
    estimatedDuration,
    estimatedDistance: estimatedDistance?.toString(),
  };

  const [step] = await db.insert(timelineSteps).values(newStep).returning();
  return step;
};

// Get Steps by Timeline
export const getStepsByTimeline = async (timelineId: string) => {
  return db.query.timelineSteps.findMany({
    where: eq(timelineSteps.timelineId, timelineId),
    orderBy: [timelineSteps.stepOrder],
  });
};

// Update Timeline Step
export const updateTimelineStep = async (
  stepId: string,
  userId: string,
  input: Partial<AddTimelineStepInput>
) => {
  const step = await db.query.timelineSteps.findFirst({
    where: eq(timelineSteps.id, stepId),
  });

  if (!step) {
    throw new Error('Timeline step not found');
  }

  // Verify timeline ownership
  await getTimelineById(step.timelineId, userId);

  // Recalculate if transport data changed
  let updateData: any = { ...input, updatedAt: new Date() };

  if (
    input.type === TimelineStepType.TRANSPORT &&
    input.fromLatitude &&
    input.toLatitude
  ) {
    const result = calculateDistanceAndTime(
      parseFloat(input.fromLatitude),
      parseFloat(input.fromLongitude!),
      parseFloat(input.toLatitude),
      parseFloat(input.toLongitude!)
    );
    updateData.estimatedDuration = result.duration;
    updateData.estimatedDistance = result.distance.toString();
  }

  const [updated] = await db
    .update(timelineSteps)
    .set(updateData)
    .where(eq(timelineSteps.id, stepId))
    .returning();

  return updated;
};

// Delete Timeline Step
export const deleteTimelineStep = async (stepId: string, userId: string) => {
  const step = await db.query.timelineSteps.findFirst({
    where: eq(timelineSteps.id, stepId),
  });

  if (!step) {
    throw new Error('Timeline step not found');
  }

  // Verify timeline ownership
  await getTimelineById(step.timelineId, userId);

  await db.delete(timelineSteps).where(eq(timelineSteps.id, stepId));

  return { success: true };
};

// ===== Helper Functions =====

// Calculate distance and time between two coordinates (Haversine formula)
function calculateDistanceAndTime(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { distance: number; duration: number } {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  // Estimate duration (assuming average speed of 40 km/h)
  const duration = Math.round((distance / 40) * 60); // Duration in minutes

  return {
    distance: Math.round(distance * 100) / 100,
    duration,
  };
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Suggest transport type based on distance
export const suggestTransportType = (distanceKm: number): TransportType[] => {
  if (distanceKm < 1) {
    return [TransportType.WALK];
  } else if (distanceKm < 3) {
    return [TransportType.WALK, TransportType.BICYCLE, TransportType.BUS];
  } else if (distanceKm < 10) {
    return [TransportType.BUS, TransportType.SUBWAY, TransportType.TAXI];
  } else if (distanceKm < 30) {
    return [TransportType.SUBWAY, TransportType.CAR, TransportType.TAXI];
  } else {
    return [TransportType.CAR, TransportType.TRAIN];
  }
};
