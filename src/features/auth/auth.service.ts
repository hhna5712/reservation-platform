import { db } from '@/db';
import { users, NewUser } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePassword, generateToken } from '@/lib/auth';
import { UserRole, UserStatus } from '@/types/enums';

export interface SignupInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const signup = async (input: SignupInput) => {
  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);

  // Create user
  const newUser: NewUser = {
    email: input.email,
    passwordHash,
    name: input.name,
    phone: input.phone,
    role: input.role || UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
  };

  const [user] = await db.insert(users).values(newUser).returning();

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const login = async (input: LoginInput) => {
  // Find user
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check status
  if (user.status !== UserStatus.ACTIVE) {
    throw new Error('Account is not active');
  }

  // Verify password
  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Update last login
  await db.update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const getMe = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    status: user.status,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
  };
};
