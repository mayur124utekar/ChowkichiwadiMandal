import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { sendError } from '../utils/response.js';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'chowkichiwadi_secret_2026';

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: Role };
    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return sendError(res, 'Invalid or inactive user account', 401, 'UNAUTHORIZED');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Session expired or invalid token', 401, 'INVALID_TOKEN');
  }
}

export function requireRole(allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Permission denied', 403, 'FORBIDDEN');
    }
    next();
  };
}
