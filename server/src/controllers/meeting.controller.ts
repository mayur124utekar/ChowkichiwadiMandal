import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAuditAction } from '../services/audit.service.js';

const meetingSchema = z.object({
  meetingTitle: z.string().min(2),
  meetingTitleMarathi: z.string().min(2),
  meetingDate: z.string(),
  location: z.string().min(2),
  description: z.string().optional().nullable(),
  descriptionMarathi: z.string().optional().nullable(),
  agenda: z.string().optional().nullable(),
  agendaMarathi: z.string().optional().nullable(),
  decisions: z.string().optional().nullable(),
  decisionsMarathi: z.string().optional().nullable(),
  attendanceCount: z.coerce.number().int().nonnegative().optional().nullable(),
  isPublic: z.coerce.boolean().default(true),
});

export async function getMeetings(req: Request, res: Response) {
  try {
    const { year, search } = req.query;
    const whereClause: any = {};
    if (search) {
      const q = String(search);
      whereClause.OR = [
        { meetingTitle: { contains: q } },
        { meetingTitleMarathi: { contains: q } },
        { location: { contains: q } },
      ];
    }

    const meetings = await prisma.meeting.findMany({
      where: whereClause,
      orderBy: { meetingDate: 'desc' },
    });

    return sendSuccess(res, meetings);
  } catch (error) {
    return sendError(res, 'Failed to fetch meetings', 500);
  }
}

export async function createMeeting(req: AuthRequest, res: Response) {
  try {
    const data = meetingSchema.parse(req.body);
    let minutesFileUrl = null;

    if (req.file) {
      minutesFileUrl = `/uploads/meetings/${req.file.filename}`;
    }

    const meeting = await prisma.meeting.create({
      data: {
        meetingTitle: data.meetingTitle,
        meetingTitleMarathi: data.meetingTitleMarathi,
        meetingDate: new Date(data.meetingDate),
        location: data.location,
        description: data.description || null,
        descriptionMarathi: data.descriptionMarathi || null,
        agenda: data.agenda || null,
        agendaMarathi: data.agendaMarathi || null,
        decisions: data.decisions || null,
        decisionsMarathi: data.decisionsMarathi || null,
        attendanceCount: data.attendanceCount || null,
        minutesFileUrl,
        isPublic: data.isPublic,
        createdBy: req.user?.id || null,
      },
    });

    await logAuditAction(req, 'CREATE_MEETING', 'Meeting', meeting.id, null, meeting);
    return sendSuccess(res, meeting, 'Meeting created successfully', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to create meeting', 500);
  }
}

export async function updateMeeting(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.meeting.findUnique({ where: { id } });
    if (!existing) return sendError(res, 'Meeting not found', 404);

    const data = meetingSchema.partial().parse(req.body);
    let minutesFileUrl = existing.minutesFileUrl;

    if (req.file) {
      minutesFileUrl = `/uploads/meetings/${req.file.filename}`;
    }

    const updated = await prisma.meeting.update({
      where: { id },
      data: {
        ...data,
        minutesFileUrl,
        meetingDate: data.meetingDate ? new Date(data.meetingDate) : existing.meetingDate,
      },
    });

    await logAuditAction(req, 'UPDATE_MEETING', 'Meeting', id, existing, updated);
    return sendSuccess(res, updated, 'Meeting updated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to update meeting', 500);
  }
}

export async function deleteMeeting(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.meeting.findUnique({ where: { id } });
    if (!existing) return sendError(res, 'Meeting not found', 404);

    await prisma.meeting.delete({ where: { id } });
    await logAuditAction(req, 'DELETE_MEETING', 'Meeting', id, existing, null);
    return sendSuccess(res, null, 'Meeting deleted successfully');
  } catch (error) {
    return sendError(res, 'Failed to delete meeting', 500);
  }
}
