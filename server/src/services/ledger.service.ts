import { prisma } from '../config/db.js';
import { TransactionType, SourceType, PaymentMethod, RecordStatus, Prisma } from '@prisma/client';

export interface PostTransactionParams {
  transactionType: TransactionType;
  sourceType: SourceType;
  sourceId?: number;
  amount: number | Prisma.Decimal;
  transactionDate: Date;
  description: string;
  paymentMethod?: PaymentMethod;
  status?: RecordStatus;
  createdBy?: number;
}

export class LedgerService {
  /**
   * Posts or updates a double-entry ledger record
   */
  static async postTransaction(
    tx: Prisma.TransactionClient,
    params: PostTransactionParams
  ) {
    // Check if a ledger entry already exists for this source
    if (params.sourceId && params.sourceType) {
      const existing = await tx.financialTransaction.findFirst({
        where: {
          sourceType: params.sourceType,
          sourceId: params.sourceId,
        },
      });

      if (existing) {
        return tx.financialTransaction.update({
          where: { id: existing.id },
          data: {
            amount: params.amount,
            transactionDate: params.transactionDate,
            description: params.description,
            paymentMethod: params.paymentMethod,
            status: params.status || existing.status,
          },
        });
      }
    }

    return tx.financialTransaction.create({
      data: {
        transactionType: params.transactionType,
        sourceType: params.sourceType,
        sourceId: params.sourceId || null,
        amount: params.amount,
        transactionDate: params.transactionDate,
        description: params.description,
        paymentMethod: params.paymentMethod || null,
        status: params.status || RecordStatus.CONFIRMED,
        createdBy: params.createdBy || null,
      },
    });
  }

  /**
   * Marks a transaction as VOIDED in the ledger
   */
  static async voidTransaction(
    tx: Prisma.TransactionClient,
    sourceType: SourceType,
    sourceId: number
  ) {
    const existing = await tx.financialTransaction.findFirst({
      where: { sourceType, sourceId },
    });

    if (existing) {
      return tx.financialTransaction.update({
        where: { id: existing.id },
        data: { status: RecordStatus.VOIDED },
      });
    }
  }

  /**
   * Calculates current financial balance (Opening + Confirmed Income - Confirmed Expenses)
   */
  static async calculateBalance() {
    const settings = await prisma.siteSettings.findFirst();
    const openingBalance = Number(settings?.openingBalance || 0);

    const incomeAgg = await prisma.financialTransaction.aggregate({
      _sum: { amount: true },
      where: {
        transactionType: TransactionType.INCOME,
        status: RecordStatus.CONFIRMED,
        sourceType: { not: SourceType.OPENING_BALANCE }, // avoid double counting opening balance
      },
    });

    const expenseAgg = await prisma.financialTransaction.aggregate({
      _sum: { amount: true },
      where: {
        transactionType: TransactionType.EXPENSE,
        status: RecordStatus.CONFIRMED,
      },
    });

    const totalIncome = Number(incomeAgg._sum.amount || 0);
    const totalExpenses = Number(expenseAgg._sum.amount || 0);
    const netBalance = openingBalance + totalIncome - totalExpenses;

    return {
      openingBalance,
      totalIncome,
      totalExpenses,
      netBalance,
    };
  }
}
