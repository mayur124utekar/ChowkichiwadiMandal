import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { LedgerService } from '../services/ledger.service.js';
import { logAuditAction } from '../services/audit.service.js';
import { StorageService } from '../services/storage.service.js';
import { PaymentMethod, RecordStatus, TransactionType, SourceType } from '@prisma/client';

const expenseSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  title: z.string().min(2),
  titleMarathi: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  amount: z.coerce.number().positive(),
  expenseDate: z.string(),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CASH),
  vendorName: z.string().optional().nullable(),
  billNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isPublic: z.coerce.boolean().default(true),
});

export async function getExpenses(req: Request, res: Response) {
  try {
    const { categoryId, fromDate, toDate, status, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {
      deletedAt: null,
    };

    if (categoryId) whereClause.categoryId = parseInt(String(categoryId), 10);
    if (status) whereClause.status = String(status) as RecordStatus;
    if (fromDate || toDate) {
      whereClause.expenseDate = {};
      if (fromDate) whereClause.expenseDate.gte = new Date(String(fromDate));
      if (toDate) whereClause.expenseDate.lte = new Date(String(toDate));
    }

    const [total, expenses, summaryAgg] = await Promise.all([
      prisma.expense.count({ where: whereClause }),
      prisma.expense.findMany({
        where: whereClause,
        orderBy: [{ expenseDate: 'desc' }, { id: 'desc' }],
        skip,
        take: limitNum,
        include: { category: true },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { ...whereClause, status: RecordStatus.CONFIRMED },
      }),
    ]);

    return sendSuccess(res, {
      expenses,
      totalExpenses: Number(summaryAgg._sum.amount || 0),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch expenses', 500);
  }
}

export async function createExpense(req: AuthRequest, res: Response) {
  try {
    const data = expenseSchema.parse(req.body);
    let receiptUrl = null;

    if (req.file) {
      receiptUrl = await StorageService.uploadFile(req.file, 'receipts');
    }

    const category = await prisma.expenseCategory.findUnique({ where: { id: data.categoryId } });
    if (!category) return sendError(res, 'Expense category not found', 404);

    const result = await prisma.$transaction(async (tx) => {
      const exp = await tx.expense.create({
        data: {
          categoryId: data.categoryId,
          title: data.title,
          titleMarathi: data.titleMarathi || data.title,
          description: data.description || null,
          amount: data.amount,
          expenseDate: new Date(data.expenseDate),
          paymentMethod: data.paymentMethod,
          vendorName: data.vendorName || null,
          billNumber: data.billNumber || null,
          receiptUrl,
          notes: data.notes || null,
          status: RecordStatus.CONFIRMED,
          isPublic: data.isPublic,
          createdBy: req.user?.id || null,
        },
        include: { category: true },
      });

      await LedgerService.postTransaction(tx, {
        transactionType: TransactionType.EXPENSE,
        sourceType: SourceType.EXPENSE,
        sourceId: exp.id,
        amount: data.amount,
        transactionDate: new Date(data.expenseDate),
        description: `खर्च: ${exp.titleMarathi} (${data.vendorName || category.nameMarathi})`,
        paymentMethod: data.paymentMethod,
        status: RecordStatus.CONFIRMED,
        createdBy: req.user?.id,
      });

      return exp;
    });

    await logAuditAction(req, 'CREATE_EXPENSE', 'Expense', result.id, null, result);
    return sendSuccess(res, result, 'Expense recorded successfully', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to create expense', 500);
  }
}

export async function voidExpense(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason } = req.body;

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) return sendError(res, 'Expense not found', 404);

    const updated = await prisma.$transaction(async (tx) => {
      const exp = await tx.expense.update({
        where: { id },
        data: {
          status: RecordStatus.VOIDED,
          deletionReason: reason || 'Voided by admin',
          deletedBy: req.user?.id,
        },
      });

      await LedgerService.voidTransaction(tx, SourceType.EXPENSE, id);
      return exp;
    });

    await logAuditAction(req, 'VOID_EXPENSE', 'Expense', id, existing, updated);
    return sendSuccess(res, updated, 'Expense voided successfully');
  } catch (error) {
    return sendError(res, 'Failed to void expense', 500);
  }
}

export async function getExpenseCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.expenseCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    return sendSuccess(res, categories);
  } catch (error) {
    return sendError(res, 'Failed to fetch expense categories', 500);
  }
}
