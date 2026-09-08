import { prisma } from '../config/db.js';
import { Request } from 'express';
import { AuthRequest } from '../middleware/auth.js';

export async function logAuditAction(
  req: AuthRequest,
  action: string,
  entityType: string,
  entityId?: number,
  oldValues?: any,
  newValues?: any
) {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const userId = req.user?.id || null;

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId: entityId || null,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress: ipAddress.slice(0, 50),
        userAgent: userAgent.slice(0, 255),
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
