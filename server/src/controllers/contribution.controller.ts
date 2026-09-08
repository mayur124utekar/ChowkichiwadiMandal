import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { LedgerService } from '../services/ledger.service.js';
import { logAuditAction } from '../services/audit.service.js';
import { ContributorType, PaymentMethod, RecordStatus, TransactionType, SourceType } from '@prisma/client';

const monthlyContributionSchema = z.object({
  memberId: z.coerce.number().int().positive().optional().nullable(),
  contributorName: z.string().min(2),
  contributorType: z.nativeEnum(ContributorType).default(ContributorType.MEMBER),
  groupId: z.coerce.number().int().positive().optional().nullable(),
  amount: z.coerce.number().positive(),
  contributionMonth: z.coerce.number().int().min(1).max(12),
  contributionYear: z.coerce.number().int().min(2020),
  paymentDate: z.string(),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CASH),
  receiptNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isPublic: z.coerce.boolean().default(true),
});

export async function getMonthlyContributions(req: Request, res: Response) {
  try {
    const { year, month, groupId, memberId, status, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {
      deletedAt: null,
    };

    if (year) whereClause.contributionYear = parseInt(String(year), 10);
    if (month) whereClause.contributionMonth = parseInt(String(month), 10);
    if (groupId) whereClause.groupId = parseInt(String(groupId), 10);
    if (memberId) whereClause.memberId = parseInt(String(memberId), 10);
    if (status) whereClause.status = String(status) as RecordStatus;

    const [total, contributions, summaryAgg] = await Promise.all([
      prisma.monthlyContribution.count({ where: whereClause }),
      prisma.monthlyContribution.findMany({
        where: whereClause,
        orderBy: [{ paymentDate: 'desc' }, { id: 'desc' }],
        skip,
        take: limitNum,
        include: {
          member: {
            select: {
              id: true,
              fullName: true,
              fullNameMarathi: true,
              mobileNumber: true,
              group: true,
            },
          },
        },
      }),
      prisma.monthlyContribution.aggregate({
        _sum: { amount: true },
        where: { ...whereClause, status: RecordStatus.CONFIRMED },
      }),
    ]);

    return sendSuccess(res, {
      contributions,
      totalCollected: Number(summaryAgg._sum.amount || 0),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch monthly contributions', 500);
  }
}

export async function createMonthlyContribution(req: AuthRequest, res: Response) {
  try {
    const data = monthlyContributionSchema.parse(req.body);

    let receiptNo = data.receiptNumber;
    if (!receiptNo) {
      const count = await prisma.monthlyContribution.count();
      receiptNo = `MB-${data.contributionYear}-${String(data.contributionMonth).padStart(2, '0')}-${String(count + 1).padStart(4, '0')}`;
    }

    // Atomic transaction: Create contribution + Ledger entry
    const result = await prisma.$transaction(async (tx) => {
      const mc = await tx.monthlyContribution.create({
        data: {
          memberId: data.memberId || null,
          contributorName: data.contributorName,
          contributorType: data.contributorType,
          groupId: data.groupId || null,
          amount: data.amount,
          contributionMonth: data.contributionMonth,
          contributionYear: data.contributionYear,
          paymentDate: new Date(data.paymentDate),
          paymentMethod: data.paymentMethod,
          receiptNumber: receiptNo,
          notes: data.notes || null,
          status: RecordStatus.CONFIRMED,
          isPublic: data.isPublic,
          createdBy: req.user?.id || null,
        },
        include: { member: true },
      });

      await LedgerService.postTransaction(tx, {
        transactionType: TransactionType.INCOME,
        sourceType: SourceType.MONTHLY_CONTRIBUTION,
        sourceId: mc.id,
        amount: data.amount,
        transactionDate: new Date(data.paymentDate),
        description: `मासिक वर्गणी: ${data.contributorName} (${data.contributionMonth}/${data.contributionYear})`,
        paymentMethod: data.paymentMethod,
        status: RecordStatus.CONFIRMED,
        createdBy: req.user?.id,
      });

      return mc;
    });

    await logAuditAction(req, 'CREATE_MONTHLY_CONTRIBUTION', 'MonthlyContribution', result.id, null, result);

    return sendSuccess(res, result, 'Monthly contribution recorded successfully', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to create contribution', 500);
  }
}

export async function voidMonthlyContribution(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason } = req.body;

    const existing = await prisma.monthlyContribution.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      return sendError(res, 'Contribution not found', 404);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const mc = await tx.monthlyContribution.update({
        where: { id },
        data: {
          status: RecordStatus.VOIDED,
          deletionReason: reason || 'Voided by admin',
          deletedBy: req.user?.id,
        },
      });

      await LedgerService.voidTransaction(tx, SourceType.MONTHLY_CONTRIBUTION, id);
      return mc;
    });

    await logAuditAction(req, 'VOID_MONTHLY_CONTRIBUTION', 'MonthlyContribution', id, existing, updated);

    return sendSuccess(res, updated, 'Contribution voided successfully');
  } catch (error) {
    return sendError(res, 'Failed to void contribution', 500);
  }
}

// ----------------- Festival Contributions -----------------

const festivalContributionSchema = z.object({
  eventId: z.coerce.number().int().positive(),
  memberId: z.coerce.number().int().positive().optional().nullable(),
  contributorName: z.string().min(2),
  contributorType: z.nativeEnum(ContributorType).default(ContributorType.MEMBER),
  amount: z.coerce.number().positive(),
  paymentDate: z.string(),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CASH),
  receiptNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isPublic: z.coerce.boolean().default(true),
});

export async function getFestivalContributions(req: Request, res: Response) {
  try {
    const { eventId, status, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {
      deletedAt: null,
    };

    if (eventId) whereClause.eventId = parseInt(String(eventId), 10);
    if (status) whereClause.status = String(status) as RecordStatus;

    const [total, contributions, summaryAgg] = await Promise.all([
      prisma.festivalContribution.count({ where: whereClause }),
      prisma.festivalContribution.findMany({
        where: whereClause,
        orderBy: [{ paymentDate: 'desc' }, { id: 'desc' }],
        skip,
        take: limitNum,
        include: {
          event: true,
          member: {
            select: {
              id: true,
              fullName: true,
              fullNameMarathi: true,
              mobileNumber: true,
              group: true,
            },
          },
        },
      }),
      prisma.festivalContribution.aggregate({
        _sum: { amount: true },
        where: { ...whereClause, status: RecordStatus.CONFIRMED },
      }),
    ]);

    return sendSuccess(res, {
      contributions,
      totalCollected: Number(summaryAgg._sum.amount || 0),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch festival contributions', 500);
  }
}

export async function createFestivalContribution(req: AuthRequest, res: Response) {
  try {
    const data = festivalContributionSchema.parse(req.body);

    let receiptNo = data.receiptNumber;
    if (!receiptNo) {
      const count = await prisma.festivalContribution.count();
      const currentYear = new Date().getFullYear();
      receiptNo = `FEST-${currentYear}-${String(count + 1).padStart(4, '0')}`;
    }

    const event = await prisma.event.findUnique({ where: { id: data.eventId } });
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const fc = await tx.festivalContribution.create({
        data: {
          eventId: data.eventId,
          memberId: data.memberId || null,
          contributorName: data.contributorName,
          contributorType: data.contributorType,
          amount: data.amount,
          paymentDate: new Date(data.paymentDate),
          paymentMethod: data.paymentMethod,
          receiptNumber: receiptNo,
          notes: data.notes || null,
          status: RecordStatus.CONFIRMED,
          isPublic: data.isPublic,
          createdBy: req.user?.id || null,
        },
        include: { event: true, member: true },
      });

      await LedgerService.postTransaction(tx, {
        transactionType: TransactionType.INCOME,
        sourceType: SourceType.FESTIVAL_CONTRIBUTION,
        sourceId: fc.id,
        amount: data.amount,
        transactionDate: new Date(data.paymentDate),
        description: `उत्सव वर्गणी (${event.nameMarathi}): ${data.contributorName}`,
        paymentMethod: data.paymentMethod,
        status: RecordStatus.CONFIRMED,
        createdBy: req.user?.id,
      });

      return fc;
    });

    await logAuditAction(req, 'CREATE_FESTIVAL_CONTRIBUTION', 'FestivalContribution', result.id, null, result);

    return sendSuccess(res, result, 'Festival contribution recorded successfully', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to create festival contribution', 500);
  }
}

export async function voidFestivalContribution(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason } = req.body;

    const existing = await prisma.festivalContribution.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      return sendError(res, 'Festival contribution not found', 404);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const fc = await tx.festivalContribution.update({
        where: { id },
        data: {
          status: RecordStatus.VOIDED,
          deletionReason: reason || 'Voided by admin',
          deletedBy: req.user?.id,
        },
      });

      await LedgerService.voidTransaction(tx, SourceType.FESTIVAL_CONTRIBUTION, id);
      return fc;
    });

    await logAuditAction(req, 'VOID_FESTIVAL_CONTRIBUTION', 'FestivalContribution', id, existing, updated);

    return sendSuccess(res, updated, 'Festival contribution voided successfully');
  } catch (error) {
    return sendError(res, 'Failed to void festival contribution', 500);
  }
}
