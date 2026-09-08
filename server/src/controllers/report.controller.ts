import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { LedgerService } from '../services/ledger.service.js';
import { RecordStatus, ContributorType, TransactionType } from '@prisma/client';

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [
      totalMembers,
      normalGroupMembers,
      youthGroupMembers,
      activeMembers,
      settings,
      overallBalance,
    ] = await Promise.all([
      prisma.member.count({ where: { deletedAt: null } }),
      prisma.member.count({ where: { deletedAt: null, group: { code: 'NORMAL' }, isActive: true } }),
      prisma.member.count({ where: { deletedAt: null, group: { code: 'YOUTH' }, isActive: true } }),
      prisma.member.count({ where: { deletedAt: null, isActive: true } }),
      prisma.siteSettings.findFirst(),
      LedgerService.calculateBalance(),
    ]);

    const targetPerMember = Number(settings?.monthlyTargetAmount || 200);
    const expectedMonthCollection = activeMembers * targetPerMember;

    // This month's member collections
    const currentMonthMemberAgg = await prisma.monthlyContribution.aggregate({
      _sum: { amount: true },
      where: {
        contributionYear: currentYear,
        contributionMonth: currentMonth,
        contributorType: ContributorType.MEMBER,
        status: RecordStatus.CONFIRMED,
        deletedAt: null,
      },
    });

    // This month's outside collections
    const currentMonthOutsideAgg = await prisma.monthlyContribution.aggregate({
      _sum: { amount: true },
      where: {
        contributionYear: currentYear,
        contributionMonth: currentMonth,
        contributorType: ContributorType.OUTSIDE_PERSON,
        status: RecordStatus.CONFIRMED,
        deletedAt: null,
      },
    });

    const monthMemberCollected = Number(currentMonthMemberAgg._sum.amount || 0);
    const monthOutsideCollected = Number(currentMonthOutsideAgg._sum.amount || 0);
    const monthTotalCollected = monthMemberCollected + monthOutsideCollected;
    const monthPending = Math.max(0, expectedMonthCollection - monthMemberCollected);

    // Recent activity
    const [recentContributions, recentExpenses, recentMeetings] = await Promise.all([
      prisma.monthlyContribution.findMany({
        where: { deletedAt: null },
        orderBy: { paymentDate: 'desc' },
        take: 5,
        include: { member: true },
      }),
      prisma.expense.findMany({
        where: { deletedAt: null },
        orderBy: { expenseDate: 'desc' },
        take: 5,
        include: { category: true },
      }),
      prisma.meeting.findMany({
        orderBy: { meetingDate: 'desc' },
        take: 3,
      }),
    ]);

    return sendSuccess(res, {
      memberStats: {
        total: totalMembers,
        normalGroup: normalGroupMembers,
        youthGroup: youthGroupMembers,
        active: activeMembers,
        inactive: totalMembers - activeMembers,
      },
      currentMonth: {
        year: currentYear,
        month: currentMonth,
        expected: expectedMonthCollection,
        collected: monthTotalCollected,
        memberCollected: monthMemberCollected,
        outsideCollected: monthOutsideCollected,
        pending: monthPending,
        targetPerMember,
      },
      overallFinance: overallBalance,
      recentActivity: {
        contributions: recentContributions,
        expenses: recentExpenses,
        meetings: recentMeetings,
      },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch dashboard statistics', 500);
  }
}

export async function getFinancialSummaryReport(req: Request, res: Response) {
  try {
    const { year } = req.query;
    const reportYear = year ? parseInt(String(year), 10) : new Date().getFullYear();

    const settings = await prisma.siteSettings.findFirst();
    const openingBalance = Number(settings?.openingBalance || 0);

    // Monthly collections for year
    const monthlySumAgg = await prisma.monthlyContribution.aggregate({
      _sum: { amount: true },
      where: {
        contributionYear: reportYear,
        status: RecordStatus.CONFIRMED,
        deletedAt: null,
      },
    });

    // Festival collections for year
    const festivalSumAgg = await prisma.festivalContribution.aggregate({
      _sum: { amount: true },
      where: {
        event: { year: reportYear },
        status: RecordStatus.CONFIRMED,
        deletedAt: null,
      },
    });

    // Expenses for year
    const startOfYear = new Date(`${reportYear}-01-01`);
    const endOfYear = new Date(`${reportYear}-12-31T23:59:59.999Z`);

    const expenseSumAgg = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        expenseDate: { gte: startOfYear, lte: endOfYear },
        status: RecordStatus.CONFIRMED,
        deletedAt: null,
      },
    });

    // Month by month breakdown
    const monthlyBreakdown = [];
    for (let m = 1; m <= 12; m++) {
      const monthStart = new Date(reportYear, m - 1, 1);
      const monthEnd = new Date(reportYear, m, 0, 23, 59, 59, 999);

      const [mc, exp] = await Promise.all([
        prisma.monthlyContribution.aggregate({
          _sum: { amount: true },
          where: {
            contributionYear: reportYear,
            contributionMonth: m,
            status: RecordStatus.CONFIRMED,
            deletedAt: null,
          },
        }),
        prisma.expense.aggregate({
          _sum: { amount: true },
          where: {
            expenseDate: { gte: monthStart, lte: monthEnd },
            status: RecordStatus.CONFIRMED,
            deletedAt: null,
          },
        }),
      ]);

      monthlyBreakdown.push({
        month: m,
        income: Number(mc._sum.amount || 0),
        expense: Number(exp._sum.amount || 0),
      });
    }

    const totalMonthly = Number(monthlySumAgg._sum.amount || 0);
    const totalFestival = Number(festivalSumAgg._sum.amount || 0);
    const totalExpenses = Number(expenseSumAgg._sum.amount || 0);
    const totalIncome = totalMonthly + totalFestival;
    const closingBalance = openingBalance + totalIncome - totalExpenses;

    return sendSuccess(res, {
      year: reportYear,
      openingBalance,
      totalMonthly,
      totalFestival,
      totalIncome,
      totalExpenses,
      closingBalance,
      monthlyBreakdown,
    });
  } catch (error) {
    return sendError(res, 'Failed to generate financial summary report', 500);
  }
}

export async function getMonthlyMatrix(req: Request, res: Response) {
  try {
    const { year, groupId } = req.query;
    const selectedYear = year ? parseInt(String(year), 10) : new Date().getFullYear();

    const memberWhere: any = { deletedAt: null, isActive: true };
    if (groupId) memberWhere.groupId = parseInt(String(groupId), 10);

    const members = await prisma.member.findMany({
      where: memberWhere,
      orderBy: [{ displayOrder: 'asc' }, { fullName: 'asc' }],
      include: {
        group: true,
        position: true,
        monthlyContributions: {
          where: {
            contributionYear: selectedYear,
            status: RecordStatus.CONFIRMED,
            deletedAt: null,
          },
        },
      },
    });

    const matrix = members.map((m) => {
      const months: Record<number, number> = {};
      for (let i = 1; i <= 12; i++) {
        months[i] = 0;
      }

      let totalPaid = 0;
      m.monthlyContributions.forEach((mc) => {
        const amt = Number(mc.amount);
        months[mc.contributionMonth] = (months[mc.contributionMonth] || 0) + amt;
        totalPaid += amt;
      });

      return {
        memberId: m.id,
        fullName: m.fullName,
        fullNameMarathi: m.fullNameMarathi,
        group: m.group.nameMarathi,
        position: m.position?.nameMarathi || 'सदस्य',
        months,
        totalPaid,
      };
    });

    return sendSuccess(res, { year: selectedYear, matrix });
  } catch (error) {
    return sendError(res, 'Failed to generate monthly matrix', 500);
  }
}
