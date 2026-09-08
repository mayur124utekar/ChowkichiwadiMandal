import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { LedgerService } from '../services/ledger.service.js';
import { RecordStatus, EventStatus } from '@prisma/client';

export async function getPublicMandalInfo(req: Request, res: Response) {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: {
        mandalNameMarathi: true,
        mandalName: true,
        regNumberMarathi: true,
        regNumber: true,
        addressMarathi: true,
        address: true,
        primaryPhone: true,
        secondaryPhone: true,
        email: true,
        logoUrl: true,
        mainImageUrl: true,
        primaryColor: true,
        monthlyTargetAmount: true,
        showMonthlySummaryPublicly: true,
        showFestivalSummaryPublicly: true,
        showExpenseListPublicly: true,
      },
    });

    const groups = await prisma.group.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        nameMarathi: true,
        name: true,
        code: true,
        description: true,
        _count: {
          select: { members: { where: { isActive: true, isPublic: true, deletedAt: null } } },
        },
      },
    });

    const activeMembersCount = await prisma.member.count({
      where: { isActive: true, isPublic: true, deletedAt: null },
    });

    const latestEvent = await prisma.event.findFirst({
      where: { isPublic: true },
      orderBy: { eventDate: 'desc' },
      select: {
        id: true,
        nameMarathi: true,
        descriptionMarathi: true,
        eventDate: true,
        status: true,
        targetAmount: true,
      },
    });

    const latestMeeting = await prisma.meeting.findFirst({
      where: { isPublic: true },
      orderBy: { meetingDate: 'desc' },
      select: {
        id: true,
        meetingTitleMarathi: true,
        meetingDate: true,
        location: true,
        decisionsMarathi: true,
      },
    });

    return sendSuccess(res, {
      settings,
      groups,
      stats: {
        totalMembers: activeMembersCount,
      },
      latestEvent,
      latestMeeting,
    });
  } catch (error) {
    console.error('Failed to fetch public mandal info:', error);
    return sendError(res, 'Failed to fetch public mandal info', 500);
  }
}

export async function getPublicMembers(req: Request, res: Response) {
  try {
    const { groupCode } = req.query;

    const whereClause: any = {
      isActive: true,
      isPublic: true,
      deletedAt: null,
    };

    if (groupCode) {
      whereClause.group = { code: String(groupCode) };
    }

    const members = await prisma.member.findMany({
      where: whereClause,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'asc' },
      ],
      select: {
        id: true,
        fullNameMarathi: true,
        fullName: true,
        photoUrl: true,
        bioMarathi: true,
        group: {
          select: {
            id: true,
            nameMarathi: true,
            code: true,
          },
        },
        position: {
          select: {
            id: true,
            nameMarathi: true,
          },
        },
      },
    });

    return sendSuccess(res, members);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return sendError(res, 'Failed to fetch members', 500);
  }
}

export async function getPublicFinancialSummary(req: Request, res: Response) {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings?.showMonthlySummaryPublicly) {
      return sendSuccess(res, { isHidden: true });
    }

    const { year, month } = req.query;
    const currentYear = year ? parseInt(String(year), 10) : new Date().getFullYear();
    const currentMonth = month ? parseInt(String(month), 10) : new Date().getMonth() + 1;

    // Monthly collection for requested month
    const monthlyAgg = await prisma.monthlyContribution.aggregate({
      _sum: { amount: true },
      where: {
        contributionYear: currentYear,
        contributionMonth: currentMonth,
        status: RecordStatus.CONFIRMED,
        deletedAt: null,
      },
    });

    // Overall mandal finances
    const overallBalance = await LedgerService.calculateBalance();

    return sendSuccess(res, {
      year: currentYear,
      month: currentMonth,
      monthlyCollected: Number(monthlyAgg._sum.amount || 0),
      totalBalance: overallBalance.netBalance,
      totalIncome: overallBalance.totalIncome,
      totalExpenses: overallBalance.totalExpenses,
    });
  } catch (error) {
    console.error('Failed to fetch financial summary:', error);
    return sendError(res, 'Failed to fetch financial summary', 500);
  }
}

export async function getPublicEvents(req: Request, res: Response) {
  try {
    const events = await prisma.event.findMany({
      where: { isPublic: true },
      orderBy: { eventDate: 'desc' },
      include: {
        _count: {
          select: { contributions: { where: { status: RecordStatus.CONFIRMED, deletedAt: null } } },
        },
        contributions: {
          where: { status: RecordStatus.CONFIRMED, deletedAt: null },
          select: { amount: true },
        },
      },
    });

    const formatted = events.map((ev) => {
      const totalCollected = ev.contributions.reduce((acc, curr) => acc + Number(curr.amount), 0);
      return {
        id: ev.id,
        nameMarathi: ev.nameMarathi,
        descriptionMarathi: ev.descriptionMarathi,
        eventDate: ev.eventDate,
        year: ev.year,
        targetAmount: ev.targetAmount ? Number(ev.targetAmount) : null,
        status: ev.status,
        totalCollected,
        contributorsCount: ev._count.contributions,
      };
    });

    return sendSuccess(res, formatted);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return sendError(res, 'Failed to fetch events', 500);
  }
}

export async function getPublicExpenses(req: Request, res: Response) {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings?.showExpenseListPublicly) {
      return sendSuccess(res, { isHidden: true, expenses: [] });
    }

    const { limit = '20', categoryId } = req.query;

    const whereClause: any = {
      status: RecordStatus.CONFIRMED,
      isPublic: true,
      deletedAt: null,
    };

    if (categoryId) {
      whereClause.categoryId = parseInt(String(categoryId), 10);
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      orderBy: { expenseDate: 'desc' },
      take: parseInt(String(limit), 10),
      select: {
        id: true,
        titleMarathi: true,
        title: true,
        amount: true,
        expenseDate: true,
        category: {
          select: {
            id: true,
            nameMarathi: true,
          },
        },
      },
    });

    return sendSuccess(res, expenses);
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    return sendError(res, 'Failed to fetch expenses', 500);
  }
}

export async function getPublicMeetings(req: Request, res: Response) {
  try {
    const meetings = await prisma.meeting.findMany({
      where: { isPublic: true },
      orderBy: { meetingDate: 'desc' },
      select: {
        id: true,
        meetingTitleMarathi: true,
        meetingDate: true,
        location: true,
        descriptionMarathi: true,
        agendaMarathi: true,
        decisionsMarathi: true,
        attendanceCount: true,
        minutesFileUrl: true,
      },
    });

    return sendSuccess(res, meetings);
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    return sendError(res, 'Failed to fetch meetings', 500);
  }
}
