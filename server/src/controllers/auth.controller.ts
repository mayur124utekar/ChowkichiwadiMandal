import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAuditAction } from '../services/audit.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chowkichiwadi_secret_2026';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      return sendError(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const authReq = req as AuthRequest;
    authReq.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    await logAuditAction(authReq, 'LOGIN', 'AdminUser', user.id, null, { email: user.email });

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, 'Login successful');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Invalid input', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Login failed', 500);
  }
}

export async function logout(req: AuthRequest, res: Response) {
  if (req.user) {
    await logAuditAction(req, 'LOGOUT', 'AdminUser', req.user.id);
  }
  res.clearCookie('token');
  return sendSuccess(res, null, 'Logged out successfully');
}

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }
  return sendSuccess(res, req.user);
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const userId = req.user!.id;

    const user = await prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Current password does not match', 400);
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.adminUser.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    await logAuditAction(req, 'PASSWORD_CHANGE', 'AdminUser', userId);
    return sendSuccess(res, null, 'Password updated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to change password', 500);
  }
}
