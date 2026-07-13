import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './auth';
import { UserRole } from '@/types/enums';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export const authenticate = (
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) => {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    req.user = payload;
    return handler(req);
  };
};

export const authorizeRoles = (
  allowedRoles: UserRole[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) => {
  return authenticate(async (req: AuthenticatedRequest): Promise<NextResponse> => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return handler(req);
  });
};
