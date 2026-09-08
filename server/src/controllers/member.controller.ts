import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAuditAction } from '../services/audit.service.js';

const memberSchema = z.object({
  groupId: z.coerce.number().int().positive(),
  positionId: z.coerce.number().int().positive().nullable().optional(),
  fullName: z.string().min(2),
  fullNameMarathi: z.string().optional().nullable(),
  mobileNumber: z.string().optional().nullable(),
  joiningDate: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  bioMarathi: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
  isPublic: z.coerce.boolean().default(true),
});

export async function getMembers(req: Request, res: Response) {
  try {
    const { groupId, positionId, isActive, search, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {
      deletedAt: null,
    };

    if (groupId) {
      whereClause.groupId = parseInt(String(groupId), 10);
    }
    if (positionId) {
      whereClause.positionId = parseInt(String(positionId), 10);
    }
    if (isActive !== undefined && isActive !== '') {
      whereClause.isActive = isActive === 'true';
    }
    if (search) {
      const q = String(search);
      whereClause.OR = [
        { fullName: { contains: q } },
        { fullNameMarathi: { contains: q } },
        { mobileNumber: { contains: q } },
      ];
    }

    const [total, members] = await Promise.all([
      prisma.member.count({ where: whereClause }),
      prisma.member.findMany({
        where: whereClause,
        orderBy: [{ displayOrder: 'asc' }, { fullName: 'asc' }],
        skip,
        take: limitNum,
        include: {
          group: true,
          position: true,
        },
      }),
    ]);

    return sendSuccess(res, {
      members,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch members', 500);
  }
}

export async function getMemberById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        group: true,
        position: true,
        monthlyContributions: {
          where: { deletedAt: null },
          orderBy: [{ contributionYear: 'desc' }, { contributionMonth: 'desc' }],
          take: 12,
        },
      },
    });

    if (!member || member.deletedAt) {
      return sendError(res, 'Member not found', 404);
    }

    return sendSuccess(res, member);
  } catch (error) {
    return sendError(res, 'Failed to fetch member details', 500);
  }
}

export async function createMember(req: AuthRequest, res: Response) {
  try {
    const data = memberSchema.parse(req.body);
    let photoUrl = null;

    if (req.file) {
      photoUrl = `/uploads/members/${req.file.filename}`;
    }

    const member = await prisma.member.create({
      data: {
        groupId: data.groupId,
        positionId: data.positionId || null,
        fullName: data.fullName,
        fullNameMarathi: data.fullNameMarathi || data.fullName,
        photoUrl,
        mobileNumber: data.mobileNumber || null,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : new Date(),
        bio: data.bio || null,
        bioMarathi: data.bioMarathi || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
        isPublic: data.isPublic,
      },
      include: { group: true, position: true },
    });

    await logAuditAction(req, 'CREATE_MEMBER', 'Member', member.id, null, member);

    return sendSuccess(res, member, 'Member created successfully', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to create member', 500);
  }
}

export async function updateMember(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.member.findUnique({ where: { id } });

    if (!existing || existing.deletedAt) {
      return sendError(res, 'Member not found', 404);
    }

    const data = memberSchema.partial().parse(req.body);
    let photoUrl = existing.photoUrl;

    if (req.file) {
      photoUrl = `/uploads/members/${req.file.filename}`;
    }

    const updated = await prisma.member.update({
      where: { id },
      data: {
        ...data,
        photoUrl,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : existing.joiningDate,
      },
      include: { group: true, position: true },
    });

    await logAuditAction(req, 'UPDATE_MEMBER', 'Member', id, existing, updated);

    return sendSuccess(res, updated, 'Member updated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to update member', 500);
  }
}

export async function deleteMember(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.member.findUnique({ where: { id } });

    if (!existing || existing.deletedAt) {
      return sendError(res, 'Member not found', 404);
    }

    // Soft delete
    const deleted = await prisma.member.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: req.user?.id || null,
        isActive: false,
      },
    });

    await logAuditAction(req, 'DELETE_MEMBER', 'Member', id, existing, { deletedAt: new Date() });

    return sendSuccess(res, deleted, 'Member soft-deleted successfully');
  } catch (error) {
    return sendError(res, 'Failed to delete member', 500);
  }
}

export async function getGroupsAndPositions(req: Request, res: Response) {
  try {
    const [groups, positions] = await Promise.all([
      prisma.group.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.position.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' }, include: { group: true } }),
    ]);

    return sendSuccess(res, { groups, positions });
  } catch (error) {
    return sendError(res, 'Failed to fetch groups and positions', 500);
  }
}
