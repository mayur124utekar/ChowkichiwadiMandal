import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAuditAction } from '../services/audit.service.js';
import { EventStatus } from '@prisma/client';

const eventSchema = z.object({
  name: z.string().min(2),
  nameMarathi: z.string().min(2),
  description: z.string().optional().nullable(),
  descriptionMarathi: z.string().optional().nullable(),
  eventDate: z.string(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  year: z.coerce.number().int().min(2020),
  targetAmount: z.coerce.number().positive().optional().nullable(),
  status: z.nativeEnum(EventStatus).default(EventStatus.UPCOMING),
  isPublic: z.coerce.boolean().default(true),
});

export async function getEvents(req: Request, res: Response) {
  try {
    const { year, status } = req.query;
    const whereClause: any = {};
    if (year) whereClause.year = parseInt(String(year), 10);
    if (status) whereClause.status = String(status) as EventStatus;

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { eventDate: 'desc' },
      include: {
        _count: { select: { contributions: true } },
        contributions: {
          select: { amount: true, status: true },
        },
      },
    });

    const formatted = events.map((ev) => {
      const confirmedContributions = ev.contributions.filter(c => c.status === 'CONFIRMED');
      const totalCollected = confirmedContributions.reduce((sum, c) => sum + Number(c.amount), 0);
      return {
        ...ev,
        totalCollected,
        contributionsCount: confirmedContributions.length,
      };
    });

    return sendSuccess(res, formatted);
  } catch (error) {
    return sendError(res, 'Failed to fetch events', 500);
  }
}

export async function getEventById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        contributions: {
          orderBy: { paymentDate: 'desc' },
          include: { member: true },
        },
      },
    });

    if (!event) return sendError(res, 'Event not found', 404);

    return sendSuccess(res, event);
  } catch (error) {
    return sendError(res, 'Failed to fetch event details', 500);
  }
}

export async function createEvent(req: AuthRequest, res: Response) {
  try {
    const data = eventSchema.parse(req.body);
    const event = await prisma.event.create({
      data: {
        name: data.name,
        nameMarathi: data.nameMarathi,
        description: data.description || null,
        descriptionMarathi: data.descriptionMarathi || null,
        eventDate: new Date(data.eventDate),
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        year: data.year,
        targetAmount: data.targetAmount || null,
        status: data.status,
        isPublic: data.isPublic,
      },
    });

    await logAuditAction(req, 'CREATE_EVENT', 'Event', event.id, null, event);
    return sendSuccess(res, event, 'Event created successfully', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to create event', 500);
  }
}

export async function updateEvent(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return sendError(res, 'Event not found', 404);

    const data = eventSchema.partial().parse(req.body);
    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        eventDate: data.eventDate ? new Date(data.eventDate) : existing.eventDate,
        startDate: data.startDate !== undefined ? (data.startDate ? new Date(data.startDate) : null) : existing.startDate,
        endDate: data.endDate !== undefined ? (data.endDate ? new Date(data.endDate) : null) : existing.endDate,
      },
    });

    await logAuditAction(req, 'UPDATE_EVENT', 'Event', id, existing, updated);
    return sendSuccess(res, updated, 'Event updated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to update event', 500);
  }
}
